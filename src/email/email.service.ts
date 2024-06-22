import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

import { IAnnualNewMemberEmail, IExistingMemberEmail } from '@cron';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  public async sendEmailToNewMember(member: IAnnualNewMemberEmail) {
    const mailOption: ISendMailOptions = {
      to: member.email,

      from: 'Fitness+ Gym Support',

      subject: `Fitness+ Membership Reminder - ${member.membershipType}`,

      template: path.resolve(__dirname, 'templates/newMember'),

      context: {
        memberFirstName: member.memberFirstName,

        membershipType: member.membershipType,

        dueDate: member.dueDate,

        invoiceLink: member.invoiceLink,

        combinedAnnualAndFirstMonthFee: member.combinedAnnualAndFirstMonthFee,
      },
    };

    try {
      await this.mailerService.sendMail(mailOption);
    } catch (error) {}
  }

  public async sendEmailToExistingMember(member: IExistingMemberEmail) {
    const mailOption: ISendMailOptions = {
      to: member.email,

      from: 'Fitness+ Gym Support',

      subject: `Fitness+ Membership Reminder - ${member.membershipType}`,

      template: path.resolve(__dirname, 'templates/existingMember'),

      context: {
        memberFirstName: member.memberFirstName,

        membershipType: member.membershipType,

        invoiceLink: member.invoiceLink,

        totalMonthlyAmount: member.totalMonthlyAmount,
      },
    };

    try {
      await this.mailerService.sendMail(mailOption);
    } catch (error) {
      console.error(error);
    }
  }
}
