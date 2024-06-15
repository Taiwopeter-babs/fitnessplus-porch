import { Inject, Injectable, Logger } from '@nestjs/common';
import { format, getMonth, getYear } from 'date-fns';
import { FindOptionsWhere, Raw } from 'typeorm';

import { MemberService } from '../member/member.service';
import { SubscriptionService } from '../subscription/subscription.service';

import Member from '../member/member.model';
import { IDateParams } from './cron.types';
import { Cron } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';

import { IAnnualNewMembersEmail } from './cron.types';
import { SubscriptionDto } from 'src/subscription/subscription.dto';
import { MemberDto } from 'src/member/member.dto';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private memberService: MemberService,
    private subscriptionService: SubscriptionService,
    @Inject('EMAIL_SERVICE') private emailService: ClientProxy,
  ) {}

  /**
   * handle send new members jobs to rabbitmq email queue for processing.
   * This job runs at 7:30am Sunday-Saturday
   */
  @Cron('0 54 17 * * 1-7', { name: 'newMembersEmailNotifications' })
  public async triggerNewMembersEmail() {
    const newMembersData = await this.getDueAnnualNewMembers(7);

    // enqueue each member's data
    for (const data of newMembersData) {
      this.emailService.emit('newMembersEmailNotifications', data);
    }
  }

  /**
   * Gets the new members who subscribed for annual basic/premium
   * and subscriptions are due `reminderDays` from current date.
   */
  private async getDueAnnualNewMembers(reminderDays: number) {
    const { currentDateString } = this.getCurrentDateParams();

    // find members who match first month and whose due date - reminderDays
    // match the current date
    const condition: FindOptionsWhere<Member> = {
      isFirstMonth: true,

      dueDate: Raw(
        // NOTE!!!
        // raw postgresql query for date subtraction
        // No risk of sql injection except the error comes from a developer's input
        (alias) => `${alias} - ${reminderDays} <= :date`,
        {
          date: currentDateString,
        },
      ),

      isPaid: false,
    };

    const dueNewAnnualMembers =
      await this.memberService.getMembersByCondition(condition);

    // format data for email processable template
    const membersEmailData: IAnnualNewMembersEmail[] = dueNewAnnualMembers.map(
      this.processMemberEmailData,
    );

    return membersEmailData;
  }

  /**
   * Processes the memberDto data for email notofications
   * @param member member's data to be processed
   * @returns
   */
  private processMemberEmailData(member: MemberDto): IAnnualNewMembersEmail {
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

    const memberEmailData: IAnnualNewMembersEmail = {
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

    console.log(memberEmailData);

    return memberEmailData;
  }

  /**
   * Gets the existing members (monthly and annual) whose subscriptions due dates
   * (monthly and add-on services) fall into the current date range as determined by
   * `reminderDays`.
   */
  private async getDueExistingMembers() {
    const { currentMonth, currentYear } = this.getCurrentDateParams();

    const rawQuery = Raw(
      (alias) =>
        `EXTRACT(month FROM ${alias}) = :currentMonth 
            AND EXTRACT(year FROM ${alias}) = :currentYear`,
      {
        currentMonth: currentMonth,
        currentYear: currentYear,
      },
    );

    // check if the dueDate falls in the range of the reminderDays
    const condition: FindOptionsWhere<Member> = {
      isFirstMonth: false,
      dueDate: rawQuery,
      isPaid: false,
      subscriptions: {
        dueDate: rawQuery,
        isPaid: false,
      },
    };

    const dueExistingMembers =
      await this.memberService.getMembersByCondition(condition);

    return dueExistingMembers;
  }

  private getCurrentDateParams() {
    const currentDate = new Date();

    const currentDateString = format(currentDate, 'yyyy-MM-dd');

    const currentMonth = getMonth(currentDate);

    const currentYear = getYear(currentDate);

    return {
      currentMonth,
      currentYear,
      currentDateString,
    } as IDateParams;
  }
}
