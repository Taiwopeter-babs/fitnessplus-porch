import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { MemberController } from './member.controller';
import { Member } from './member.model';
import { MemberRepository } from './member.repository';
import { MemberService } from './member.service';

import { SubscriptionModule } from '@subscription';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), SubscriptionModule],
  providers: [MemberService, MemberRepository],
  controllers: [MemberController],
  exports: [MemberService],
})
export class MemberModule {}
