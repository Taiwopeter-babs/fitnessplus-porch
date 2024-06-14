import { Module } from '@nestjs/common';
import { CronService } from './cron.service';

import { MemberModule } from '../member/member.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [MemberModule, SubscriptionModule],
  providers: [CronService],
})
export class CronModule {}
