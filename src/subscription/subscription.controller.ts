import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';

import {
  ISubscriptionCreate,
  SubscriptionService,
  SubscriptionCreateDto,
} from '@subscription';

import { ParamsDto } from '@member';
import { IPagination } from '@utils';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly _service: SubscriptionService) {}

  @Get(':id')
  public async getSubscription(@Param('id', ParseIntPipe) id: number) {
    const subscription = await this._service.getSubscription(id);

    return { statusCode: 200, subscription: subscription };
  }

  @Get()
  public async getSubscriptions(@Query() requestParamsDto: ParamsDto) {
    const { pageNumber, pageSize } = requestParamsDto;

    const pageParams = {
      pageNumber,
      pageSize,
    } as IPagination;

    const subscriptions = await this._service.getSubscriptions(pageParams);

    return { statusCode: 200, subscriptions: subscriptions };
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

    return { statusCode: 201, subscription: subscription };
  }
}
