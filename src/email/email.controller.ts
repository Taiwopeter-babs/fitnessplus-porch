import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MicroServicesExceptionFilter } from '../utils/exceptions/exceptionFilter';
import { EmailService } from './email.service';
import { IAnnualNewMembersEmail } from '../cron/cron.types';

@UseFilters(new MicroServicesExceptionFilter())
@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('newMembersEmailNotifications')
  public async sendMailToNewMembers(@Payload() member: IAnnualNewMembersEmail) {
    try {
      await this.emailService.sendEmailToNewMember(member);
    } catch (error) {
      console.log('Emails sending failed');
    }
  }

  //   @MessagePattern({ cmd: 'existingMembersEmailNofitications' })
  //   public async getSingleFlight(@Payload() flightId: string) {
  //     return await this.flightService.getSingleFlight(flightId);
  //   }
}
