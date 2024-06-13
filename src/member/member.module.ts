import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Member from './member.model';
import { MemberRepository } from './member.repository';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), SubscriptionModule],
  providers: [MemberService, MemberRepository],
  controllers: [MemberController],
})
export class MemberModule {}
