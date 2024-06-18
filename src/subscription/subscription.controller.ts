import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

import { IPagination } from '../utils/types';

import { SubscriptionService } from './subscription.service';
import { ParamsDto } from '../member/member.dto';
import { ISubscriptionCreate } from './subscription.types';
import { SubscriptionCreateDto } from './subscription.dto';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly _service: SubscriptionService) {}

  @Get(':id')
  public async getSubscription(@Param('id', ParseIntPipe) id: number) {
    const subscription = await this._service.getSubscription(id);

    return { statusCode: 200, data: subscription };
  }

  @Get()
  public async getSubscriptions(@Query() requestParamsDto: ParamsDto) {
    const { pageNumber, pageSize } = requestParamsDto;

    const pageParams = {
      pageNumber,
      pageSize,
    } as IPagination;

    const subscriptions = await this._service.getSubscriptions(pageParams);

    return { statusCode: 200, data: subscriptions };
  }

  @Post()
  public async createMemberSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Query() subscriptionDto: SubscriptionCreateDto,
  ) {
    const data: ISubscriptionCreate = {
      memberId: id,
      data: subscriptionDto,
    };
    const subscription = await this._service.createSubscription(data);

    return { statusCode: 201, data: subscription };
  }
}
