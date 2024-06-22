import { Injectable } from '@nestjs/common';

import { IPagination, PagedMemberSubscriptionsDto } from '@utils';

import { SubscriptionRepository } from './subscription.repository';
import { ISubscriptionCreate, ISubscriptionUpdate } from './subscription.types';
import { SubscriptionDto } from './subscription.dto';
import { Subscription } from './subscription.model';

@Injectable()
export class SubscriptionService {
  constructor(private readonly _repo: SubscriptionRepository) {}

  public async getMemberSubscription(
    params: Omit<ISubscriptionUpdate, 'data'>,
  ) {
    const subscription = await this._repo.getMemberSubscription(params);

    return SubscriptionDto.fromEntity(subscription);
  }

  public async getSubscription(subscriptionId: number) {
    const subscription = await this._repo.getSubscription(subscriptionId);

    return SubscriptionDto.fromEntity(subscription);
  }

  public async getMemberSubscriptions(
    memberId: number,
    pageParams: IPagination,
  ) {
    const data = (await this._repo.getPagedMembersSubscriptions(
      memberId,
      pageParams,
    )) as PagedMemberSubscriptionsDto;

    return data;
  }

  public async getSubscriptions(pageParams: IPagination) {
    const data = (await this._repo.getAllSubscriptions(
      pageParams,
    )) as PagedMemberSubscriptionsDto;

    return data;
  }

  public async createSubscription(data: ISubscriptionCreate) {
    const subscription = (await this._repo.createSubscription(
      data,
    )) as Subscription;

    return SubscriptionDto.fromEntity(subscription);
  }

  public async updateSubscription(params: ISubscriptionUpdate) {
    const isUpdated = await this._repo.updateMemberSubscription(params);

    return isUpdated;
  }

  public async deleteSubscription(subscriptionId: number, memberId: number) {
    const isDeleted = await this._repo.deleteMemberSubscription(
      subscriptionId,
      memberId,
    );

    return isDeleted;
  }
}
