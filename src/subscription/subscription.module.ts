import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  Subscription,
  SubscriptionController,
  SubscriptionRepository,
  SubscriptionService,
} from '@subscription';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  providers: [SubscriptionRepository, SubscriptionService],
  exports: [SubscriptionRepository, SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
