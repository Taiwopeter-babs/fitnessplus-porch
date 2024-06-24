import { Controller, UseFilters } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';

import { EmailService } from './email.service';

import { MicroServicesExceptionFilter } from '@utils';
import { IAnnualNewMemberEmail, IExistingMemberEmail } from '@cron';

@UseFilters(new MicroServicesExceptionFilter())
@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('newMembersEmailNotifications')
  public async sendMailToNewMembers(
    @Payload() member: IAnnualNewMemberEmail,
    @Ctx() context: RmqContext,
  ) {
    try {
      console.log('email', member);
      await this.emailService.sendEmailToNewMember(member);

      this.messageAcknowledgment(context);
    } catch (error) {
      console.log('Emails sending failed');
    }
  }

  @EventPattern('existingMembersEmailNotifications')
  public async sendMailToExistingMembers(
    @Payload() member: IExistingMemberEmail,
    @Ctx() context: RmqContext,
  ) {
    try {
      await this.emailService.sendEmailToExistingMember(member);

      this.messageAcknowledgment(context);
    } catch (error) {
      console.log('Emails sending failed');
    }
  }

  /**
   * Manually acknowledges a message delivery
   */
  private messageAcknowledgment(context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    channel.ack(originalMsg);
  }
}
