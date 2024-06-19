import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MemberService } from './member.service';
import { IPagination } from '../utils/types';

import {
  MemberCreateDto,
  MemberDto,
  MemberUpdateDto,
  ParamsDto,
} from './member.dto';

import { SubscriptionService } from '../subscription/subscription.service';
import {
  SubscriptionCreateDto,
  SubscriptionUpdateDto,
} from '../subscription/subscription.dto';
import {
  ISubscriptionCreate,
  ISubscriptionUpdate,
} from 'src/subscription/subscription.types';

@Controller('members')
export class MemberController {
  constructor(
    private readonly _service: MemberService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post()
  public async createMember(@Body() createMemberDto: MemberCreateDto) {
    const member = (await this._service.createMember(
      createMemberDto,
    )) as MemberDto;

    return {
      statusCode: HttpStatus.OK,
      message: 'Registration successful',
      data: member,
    };
  }

  @Get(':id')
  public async getMember(@Param('id', ParseIntPipe) id: number) {
    const member = await this._service.getMember(id);

    return { statusCode: 200, member: member };
  }

  @Get()
  public async getMembers(@Query() requestParamsDto: ParamsDto) {
    const { pageNumber, pageSize } = requestParamsDto;

    const pageParams = {
      pageNumber,
      pageSize,
    } as IPagination;

    const members = await this._service.getMembers(pageParams);

    return { statusCode: 200, members: { ...members } };
  }

  @Put(':id')
  @HttpCode(204)
  public async updateMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMemberDto: MemberUpdateDto,
  ) {
    await this._service.updateMember(id, updateMemberDto);

    return {};
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteMember(@Param('id', ParseIntPipe) id: number) {
    await this._service.deleteMember(id);
    return {};
  }

  // ========== SUBSCRIPTIONS =================

  @Post(':id/subscriptions')
  public async createMemberSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Body() subscriptionDto: SubscriptionCreateDto,
  ) {
    const subscriptionData: ISubscriptionCreate = {
      memberId: id,
      data: subscriptionDto,
    };
    const subscription =
      await this.subscriptionService.createSubscription(subscriptionData);

    return {
      statusCode: 200,
      message: 'Subscription added to member',
      subscription: { ...subscription },
    };
  }

  @Get(':id/subscriptions')
  public async getMemberSubscriptions(
    @Param('id', ParseIntPipe) id: number,
    @Query() requestParamsDto: ParamsDto,
  ) {
    const { pageNumber, pageSize } = requestParamsDto;

    const pageParams = {
      pageNumber,
      pageSize,
    } as IPagination;

    const subscriptions = await this.subscriptionService.getMemberSubscriptions(
      id,
      pageParams,
    );

    return { statusCode: 200, ...subscriptions };
  }

  @Get(':id/subscriptions/:subscriptionId')
  public async getMemberSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
  ) {
    const subscription = await this.subscriptionService.getMemberSubscription({
      memberId: id,
      subscriptionId,
    });

    return { statusCode: 200, subscription: subscription };
  }

  @Put(':id/subscriptions/:subscriptionId')
  @HttpCode(204)
  public async updateMemberSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
    @Body() updateSubscriptionDto: SubscriptionUpdateDto,
  ) {
    const data: ISubscriptionUpdate = {
      memberId: id,
      data: updateSubscriptionDto,
      subscriptionId,
    };
    await this.subscriptionService.updateSubscription(data);

    return {};
  }

  @Delete(':id/subscriptions/:subscriptionId')
  @HttpCode(204)
  public async deleteMemberSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Param('subscriptionId', ParseIntPipe) subscriptionId: number,
  ) {
    await this.subscriptionService.deleteSubscription(subscriptionId, id);
    return {};
  }
}
