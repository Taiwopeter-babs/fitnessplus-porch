import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MicroServicesExceptionFilter } from '../utils/exceptions/exceptionFilter';
import { EmailService } from './email.service';
import {
  IAnnualNewMemberEmail,
  IExistingMemberEmail,
} from '../cron/cron.types';

@UseFilters(new MicroServicesExceptionFilter())
@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('newMembersEmailNotifications')
  public async sendMailToNewMembers(@Payload() member: IAnnualNewMemberEmail) {
    try {
      await this.emailService.sendEmailToNewMember(member);
    } catch (error) {
      console.log('Emails sending failed');
    }
  }

  @EventPattern('existingMembersEmailNotifications')
  public async sendMailToExistingMembers(
    @Payload() member: IExistingMemberEmail,
  ) {
    try {
      await this.emailService.sendEmailToExistingMember(member);
    } catch (error) {
      console.log('Emails sending failed');
    }
  }
}
