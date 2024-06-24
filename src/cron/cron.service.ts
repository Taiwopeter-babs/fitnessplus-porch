import { Inject, Injectable } from '@nestjs/common';
import { format, getMonth, getYear, isAfter } from 'date-fns';
import { FindOptionsWhere, Raw } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';

import { IExistingMemberEmail, IAnnualNewMemberEmail } from './cron.types';

import { SubscriptionDto } from '@subscription';
import { MemberDto, MemberService, Member } from '@member';
import { getCurrentDateParams, getNumberOfDaysDifference } from '@utils';

@Injectable()
export class CronService {
  constructor(
    private memberService: MemberService,
    @Inject('EMAIL_SERVICE') private emailService: ClientProxy,
  ) {}

  /**
   * handler send new members jobs to rabbitmq email queue for processing.
   * This job runs at 7:30am Sunday-Saturday
   */
  @Cron('0 9 17 * * 1-7', { name: 'newMembersEmailNotifications' })
  public async triggerNewMembersEmail() {
    // const newMembersData = await this.getDueAnnualNewMembers(6);
    const newMembersDataGenerator = this.getDueAnnualNewMembers(6);

    // for await (const data of newMembersDataGenerator) {
    //   const { value, done } = data;
    // }
    while (true) {
      const data = await newMembersDataGenerator.next();

      const { value, done } = data;

      if (done) {
        return;
      }

      console.log(value);

      this.emailService.emit('newMembersEmailNotifications', value);
    }
  }

  /**
   * handler for sending existing members jobs to rabbitmq email queue for processing.
   * This job runs at 8:30am Sunday-Saturday
   */
  @Cron('0 45 18 * * 1-7', { name: 'existingMembersEmailNotifications' })
  public async triggerExistingMembersEmail() {
    const existingMembersData = await this.getDueExistingMembers();

    if (existingMembersData.length === 0) {
      return;
    }

    // enqueue each member's data
    for (const data of existingMembersData) {
      this.emailService.emit('existingMembersEmailNotifications', data);
    }
  }

  /**
   * Gets the new members who subscribed for annual basic/premium
   * and subscriptions are due `reminderDays` from current date.
   */
  private async *getDueAnnualNewMembers(reminderDays: number) {
    const { currentDateString, currentMonth, currentYear } =
      getCurrentDateParams();

    // find members who match first month and whose due date - reminderDays
    // match the current date
    const condition: FindOptionsWhere<Member> = {
      isFirstMonth: true,
      isPaid: false,

      dueDate: Raw(
        // NOTE!!!
        // raw postgresql query for date subtraction
        // No risk of sql injection for `reminderDays` except the error comes from a developer's input
        (alias) =>
          `EXTRACT(month FROM ${alias}) = :month
            AND EXTRACT(year FROM ${alias}) = :year
            AND ${alias} - :currentDateString <= ${reminderDays}
          `,
        {
          currentDateString: currentDateString,
          month: currentMonth,
          year: currentYear,
        },
      ),
    };

    const dueNewAnnualMembers =
      await this.memberService.getMembersByCondition(condition);

    let i = 0;
    while (i < dueNewAnnualMembers.length) {
      yield this.getNewMemberEmailObject(dueNewAnnualMembers[i++]);
    }
    // format data for email template
    // const membersEmailData: IAnnualNewMemberEmail[] = dueNewAnnualMembers.map(
    //   this.getNewMemberEmailObject,
    // );

    // return membersEmailData;
  }

  /**
   * Processes the memberDto data for email notofications
   * @param member member's data to be processed
   * @returns
   */
  private getNewMemberEmailObject(member: MemberDto): IAnnualNewMemberEmail {
    const formattedDueDate = format(member.dueDate, 'MMMM dd, yyyy');

    // local function to compute the combined annual and first month subscription fee
    const computeCombinedAmount = (
      annualFee: number,
      subscriptions: SubscriptionDto[],
    ) => {
      if (subscriptions.length === 0) {
        return annualFee;
      }

      const combinedAmount = subscriptions
        .map((sub) => sub.amount)
        .reduce((acc, currVal) => acc + currVal, annualFee);

      return combinedAmount;
    };

    const memberEmailData: IAnnualNewMemberEmail = {
      memberFirstName: member.firstName,

      membershipType: member.membershipType,

      dueDate: formattedDueDate,

      invoiceLink: member.invoiceLink,

      email: member.email,

      combinedAnnualAndFirstMonthFee: computeCombinedAmount(
        member.amount,
        member.subscriptions,
      ),
    };

    return memberEmailData;
  }

  /**
   * Gets the existing members (monthly and annual) whose subscriptions due dates
   * (monthly and add-on services) fall into the current date range as determined by
   * `currenDateParams`
   */
  private async getDueExistingMembers(): Promise<IExistingMemberEmail[]> {
    const { currentDateString } = getCurrentDateParams();

    const condition: FindOptionsWhere<Member> = {
      isFirstMonth: false,
    };

    const existingMembers =
      await this.memberService.getMembersByCondition(condition);

    // email objects of members who have main monthly subscriptions and
    // whose subscriptions due dates are equal or after the currentDate and
    // are <= 7 days from currentDate
    const existingMembersEmailObject = existingMembers

      .filter((member) => isAfter(member.dueDate, currentDateString))

      .map(this.getExistingMemberEmailObject);

    return existingMembersEmailObject;
  }

  private getExistingMemberEmailObject(member: MemberDto) {
    const { amount, dueDate, subscriptions } = member;

    let totalMonthlyAmount = 0;

    const { currentDateString, currentMonth, currentYear } =
      getCurrentDateParams();

    const dueDateFilter = (dueDate: string) => {
      return (
        getYear(dueDate) === currentYear &&
        getMonth(dueDate) + 1 === currentMonth && // getMonth function returns index 0-11
        getNumberOfDaysDifference(currentDateString, dueDate) <= 7
      );
    };

    // add monthly main subscription for close due dates
    if (dueDateFilter(dueDate)) {
      totalMonthlyAmount += amount;
    }

    // member's subscriptions with impending due dates
    const totalMonthlySubscriptions =
      subscriptions.length === 0
        ? 0
        : subscriptions
            .filter((subscription) => dueDateFilter(subscription.dueDate))

            .map((subscription) => subscription.amount)

            .reduce((acc, currVal) => acc + currVal, 0);

    return {
      memberFirstName: member.firstName,

      email: member.email,

      membershipType: member.membershipType,

      totalMonthlyAmount: totalMonthlyAmount + totalMonthlySubscriptions,

      invoiceLink: member.invoiceLink,
    } as IExistingMemberEmail;
  }
}
