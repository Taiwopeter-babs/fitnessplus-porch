import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubscriptionController } from './subscription.controller';
import { Subscription } from './subscription.model';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionService } from './subscription.service';
@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  providers: [SubscriptionRepository, SubscriptionService],
  exports: [SubscriptionRepository, SubscriptionService],
  controllers: [SubscriptionController],
})
export class SubscriptionModule {}
