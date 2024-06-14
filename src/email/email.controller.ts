import { Controller, UseFilters } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MicroServicesExceptionFilter } from '../utils/exceptions/exceptionFilter';
import { EmailService } from './email.service';
import { INewMembersEmail } from './email.type';

@UseFilters(new MicroServicesExceptionFilter())
@Controller('emails')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @MessagePattern({ cmd: 'newMembersEmailNofitications' })
  public async sendMailToNewMembers(@Payload() newMembers: INewMembersEmail[]) {
    console.log(newMembers, newMembers.length);
    if (newMembers.length === 0) {
      return;
    }
    await this.emailService.sendEmailToNewMembers(newMembers);
  }

  //   @MessagePattern({ cmd: 'existingMembersEmailNofitications' })
  //   public async getSingleFlight(@Payload() flightId: string) {
  //     return await this.flightService.getSingleFlight(flightId);
  //   }

  //   @MessagePattern({ cmd: 'getUserFlight' })
  //   public async getUserFlight(@Payload() flightDto: GetUserFlightDto) {
  //     const { userId, flightId } = flightDto;
  //     const userFlight = await this.flightService.getSingleUserFlight(
  //       userId,
  //       flightId,
  //     );

  //     return userFlight;
  //   }

  //   @MessagePattern({ cmd: 'getUserFlights' })
  //   public async getUserFlights(@Payload() flightDto: GetUserFlightDto) {
  //     const { userId, flightId } = flightDto;
  //     const userFlight = await this.flightService.getSingleUserFlight(
  //       userId,
  //       flightId,
  //     );

  //     return userFlight;
  //   }
}
