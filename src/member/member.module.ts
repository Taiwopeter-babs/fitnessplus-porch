import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import {
  MemberRepository,
  Member,
  MemberService,
  MemberController,
} from '@member';

import { SubscriptionModule } from '@subscription';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), SubscriptionModule],
  providers: [MemberService, MemberRepository],
  controllers: [MemberController],
  exports: [MemberService],
})
export class MemberModule {}
