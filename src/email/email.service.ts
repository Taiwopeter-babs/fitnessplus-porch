import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import Mailjet from 'node-mailjet';
import { LibraryResponse } from 'node-mailjet';
import { newMembersEmailTemplate } from './emai.template';

import { INewMembersEmail } from './email.type';
import { RequestData } from 'node-mailjet/declarations/request/Request';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  public async sendEmailToNewMembers(newMembers: INewMembersEmail[]) {
    const mailjet = new Mailjet({
      apiKey: this.configService.get<string>('MJ_APIKEY_PUBLIC'),
      apiSecret: this.configService.get<string>('MJ_APIKEY_PRIVATE'),
    });

    console.log(newMembers);

    const emailsToSend: Promise<LibraryResponse<RequestData>>[] =
      newMembers.map((member) => {
        const request = mailjet.post('send').request({
          FromEmail: 'babalolataiwop@gmail.com',
          FromName: 'Fitness+ Gym',
          Subject: `Fitness+ Membership Reminder - ${member.membershipType}`,
          'Mj-TemplateLanguage': 'true',
          'Mj-TemplateID': '',
          'Html-part': newMembersEmailTemplate,

          Recipients: [
            {
              Email: 'passenger1@mailjet.com',
              Name: 'passenger 1',
              Vars: {
                memberFirstName: member.memberFirstName,
                membershipType: member.membershipType,
                dueDate: member.dueDate,
                invoiceLink: member.invoiceLink,
              },
            },
          ],
        });
        return request;
      });

    try {
      await Promise.all([...emailsToSend]);
    } catch (error) {
      console.error(error);
    }
  }
}
