import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Subscription from './subscription.model';
import { SubscriptionRepository } from './subscription.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription])],
  providers: [SubscriptionRepository],
  exports: [SubscriptionRepository],
})
export class SubscriptionModule {}
