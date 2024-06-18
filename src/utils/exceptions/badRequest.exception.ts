import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class MemberAlreadyExistsException extends BadRequestException {
  constructor(memberId: string) {
    super(`Member with the id: ${memberId}, already exists`);
  }
}

export class SubscriptionAlreadyExistsException extends BadRequestException {
  constructor(subscriptionName: string) {
    super(
      `Subscription with the name: ${subscriptionName}, already exists for member`,
    );
  }
}

export class ServerErrorException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
