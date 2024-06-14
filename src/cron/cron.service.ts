import { Inject, Injectable, Logger } from '@nestjs/common';
import { format, getMonth, getYear } from 'date-fns';
import { FindOptionsWhere, Raw } from 'typeorm';

import { MemberService } from '../member/member.service';
import { SubscriptionService } from '../subscription/subscription.service';

import Member from '../member/member.model';
import { IDateParams } from './cron.types';
import { Cron } from '@nestjs/schedule';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { INewMembersEmail } from 'src/email/email.type';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    private memberService: MemberService,
    private subscriptionService: SubscriptionService,
    @Inject('EMAIL_SERVICE') private emailService: ClientProxy,
  ) {}

  /**
   * handle send new members jobs to email queue for processing.
   * This job is run at 7:30am Sunday-Saturday
   */
  // @Cron('30 7 * * 0-6')
  @Cron('0 49 23 * * 1-7')
  public async handleNewMembersEmail() {
    const newMembersData = await this.getDueAnnualNewMembers();

    console.log('Cron service running');
    this.logger.debug('Called when the current second is 45');
    return this.emailService
      .send({ cmd: 'newMembersEmailNofitications' }, newMembersData)
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }

  /**
   * Gets the new members who subscribed for annual basic/premium
   * and subscriptions are due `reminderDays` from current date.
   */
  public async getDueAnnualNewMembers() {
    // get current date string
    const { currentDateString } = this.getCurrentDateParams();

    // find members who match first month and whose due date - reminderDays
    // match the current date
    const condition: FindOptionsWhere<Member> = {
      isFirstMonth: true,
      dueDate: Raw((alias) => `${alias} - INTERVAL '7 days' = :date`, {
        // days: reminderDays,
        date: currentDateString,
      }),
      isPaid: false,
    };

    const dueNewAnnualMembers =
      await this.memberService.getMembersByCondition(condition);

    const membersEmailData: INewMembersEmail[] = dueNewAnnualMembers.map(
      (member) => {
        const formattedDueDate = format(member.dueDate, 'MMMM dd, yyyy');
        return {
          memberFirstName: member.firstName,
          membershipType: member.membershipType,
          dueDate: formattedDueDate,
          invoiceLink: member.invoiceLink,
        };
      },
    );

    return membersEmailData;
  }

  /**
   * Gets the existing members (monthly and annual) whose subscriptions due dates
   * (monthly and add-on services) fall into the current date range as determined by
   * `reminderDays`.
   */
  public async getDueExistingMembers() {
    // get current year and month
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
