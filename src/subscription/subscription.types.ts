import {
  SubscriptionCreateDto,
  SubscriptionUpdateDto,
} from './subscription.dto';

export type ISubscriptionUpdate = {
  subscriptionId: number;
  memberId: number;
  data: SubscriptionUpdateDto;
};

export type ISubscriptionCreate = {
  memberId: number;
  data: SubscriptionCreateDto;
};
