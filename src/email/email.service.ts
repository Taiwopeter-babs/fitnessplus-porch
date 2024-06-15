import { Injectable } from '@nestjs/common';

// import Mailjet from 'node-mailjet';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

import { IAnnualNewMembersEmail } from '../cron/cron.types';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  public async sendEmailToNewMember(member: IAnnualNewMembersEmail) {
    console.log(member);

    // const emailsOptions = newMembers.map((member) => {
    //   return {
    //     to: member.email,
    //     from: 'Fitness+ Gym Support',
    //     subject: `Fitness+ Membership Reminder - ${member.membershipType}`,
    //     template: path.resolve(__dirname, 'templates/newMember'),
    //     context: {
    //       memberFirstName: member.memberFirstName,
    //       membershipType: member.membershipType,
    //       dueDate: member.dueDate,
    //       invoiceLink: member.invoiceLink,
    //     },
    //   } as ISendMailOptions;
    // });

    // // construct a promise object of the emails to be sent
    // const transporterEmailObjects = emailsOptions.map((option) => {
    //   return this.mailerService.sendMail(option);
    // });

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
      },
    };

    try {
      const resp = await this.mailerService.sendMail(mailOption);
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  }
}
