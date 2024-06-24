import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ISubscriptionCreate, ISubscriptionUpdate } from './subscription.types';
import { SubscriptionDto } from './subscription.dto';
import { Subscription } from './subscription.model';

import {
  SubscriptionNotFoundException,
  SubscriptionAlreadyExistsException,
  getPageParams,
  IPagination,
  PagedMemberSubscriptionsDto,
  exceptionHandler,
} from '@utils';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectRepository(Subscription)
    private repo: Repository<Subscription>,
  ) {}

  public async getMemberSubscription(
    params: Omit<ISubscriptionUpdate, 'data'>,
  ): Promise<Subscription> {
    const condition: FindOptionsWhere<Subscription> = {
      id: params.subscriptionId,
      memberId: params.memberId,
    };
    return (await this.findSubscriptionByCondition(condition)) as Subscription;
  }

  public async getSubscription(subscriptionId: number): Promise<Subscription> {
    return (await this.findSubscriptionByCondition({
      id: subscriptionId,
    })) as Subscription;
  }

  public async getPagedMembersSubscriptions(
    memberId: number,
    params: IPagination,
  ): Promise<PagedMemberSubscriptionsDto | void> {
    const memberSubscriptions = await this.getPagedSubscriptions(
      params,
      memberId,
    );

    return memberSubscriptions;
  }

  public async getAllSubscriptions(
    params: IPagination,
  ): Promise<PagedMemberSubscriptionsDto | void> {
    const subscriptions = await this.getPagedSubscriptions(params);

    return subscriptions;
  }

  public async createSubscription(params: ISubscriptionCreate) {
    try {
      const { memberId, data } = params;

      await this.findSubscriptionByNameForMember(data.name, memberId);

      const dataToSave = {
        name: data.name,
        amount: data.amount,
        startDate: data.startDate,
        dueDate: data.dueDate,
        memberId: memberId,
      };

      const subscription = await this.repo.save(dataToSave);

      return subscription;
    } catch (error) {
      //   console.error(error);
      exceptionHandler(error);
    }
  }

  public async updateMemberSubscription(params: ISubscriptionUpdate) {
    try {
      const { memberId, subscriptionId, data } = params;

      (await this.findSubscriptionByCondition({
        id: subscriptionId,
        memberId,
      })) as Subscription;

      const updateData = {
        startDate: data.startDate,
        dueDate: data.dueDate,
      };

      await this.repo.update({ id: subscriptionId, memberId: memberId }, {
        ...updateData,
      } as Subscription);

      return true;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async deleteMemberSubscription(
    subscriptionId: number,
    memberId: number,
  ) {
    (await this.findSubscriptionByCondition({
      id: subscriptionId,
      memberId,
    })) as Subscription;

    try {
      await this.repo
        .createQueryBuilder()
        .delete()
        .from(Subscription)
        .where('id = :id', { id: subscriptionId })
        .andWhere('memberId = :memberId', { memberId: memberId })
        .execute();

      return true;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  private async findSubscriptionByNameForMember(
    name: string,
    memberId: number,
  ): Promise<void> {
    try {
      const subscription = await this.repo
        .createQueryBuilder('subscription')
        .where('subscription.name = :name', { name: name })
        .andWhere('subscription.memberId = :memberId', { memberId: memberId })
        .getOne();

      if (subscription) {
        throw new SubscriptionAlreadyExistsException(name);
      }
    } catch (error) {
      exceptionHandler(error);
    }
  }

  private async findSubscriptionByCondition(
    condition: FindOptionsWhere<Subscription>,
  ): Promise<Subscription | void> {
    try {
      const subscription = await this.repo.findOne({
        where: condition,
      });

      if (!subscription) {
        throw new SubscriptionNotFoundException(condition.id as number);
      }

      return subscription;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  private async getPagedSubscriptions(
    params: IPagination,
    memberId?: number,
  ): Promise<PagedMemberSubscriptionsDto | void> {
    try {
      const pageParams = getPageParams(params);

      const paginationOptions: FindManyOptions<Subscription> = {
        skip: pageParams.skip,
        take: pageParams.pageSize,
        order: { name: 'ASC' },
        where: memberId ? { memberId: memberId } : {},
      };

      const [itemsCount, items] = await Promise.all([
        this.repo.count(),
        this.repo.find({ ...paginationOptions }),
      ]);

      const totalPages = Math.ceil(itemsCount / pageParams.pageSize);

      const data: PagedMemberSubscriptionsDto = {
        subscriptions: items.map(SubscriptionDto.fromEntity),
        currentPage: params.pageNumber,
        pageSize: pageParams.pageSize,
        totalPages: totalPages,
        hasNext: pageParams.pageNumber < totalPages,
        hasPrevious: pageParams.pageNumber > 1,
      };

      return data;
    } catch (error) {
      exceptionHandler(error);
    }
  }
}
