import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class MemberNotFoundException extends NotFoundException {
  constructor(memberId: number | string) {
    super(`Member with the id: ${memberId}, was not found`);
  }
}

export class SubscriptionNotFoundException extends NotFoundException {
  constructor(productId: number) {
    super(`Product with the id: ${productId}, was not found`);
  }
}
