import { Injectable } from '@nestjs/common';
import { format, getMonth, getYear } from 'date-fns';
import { FindOptionsWhere, Raw } from 'typeorm';

import { MemberService } from '../member/member.service';
import { SubscriptionService } from '../subscription/subscription.service';

import Member from '../member/member.model';
import { IDateParams } from './cron.types';

@Injectable()
export class CronService {
  constructor(
    private memberService: MemberService,
    private subscriptionService: SubscriptionService,
  ) {}

  // method to send jobs to email queue for processing

  /**
   * Gets the new members who subscribed for annual basic/premium
   * and subscriptions are due `reminderDays` from current date.
   */
  public async getDueAnnualNewMembers(reminderDays: number) {
    // get current date string
    const { currentDateString } = this.getCurrentDateParams();

    // find members who match first month and whose due date - reminderDays
    // match the current date
    const condition: FindOptionsWhere<Member> = {
      isFirstMonth: true,
      dueDate: Raw((alias) => `${alias} - :days = :date`, {
        days: reminderDays,
        date: currentDateString,
      }),
    };

    const dueAnnualMembers =
      await this.memberService.getMembersByCondition(condition);

    return dueAnnualMembers;
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
