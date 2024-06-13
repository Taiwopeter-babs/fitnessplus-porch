import { FindManyOptions, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import exceptionHandler from '../utils/exceptions/exceptionHandler';

import { IPagination, PagedMemberSubscriptionsDto } from '../utils/types';

import Subscription from './subscription.model';
import { SubscriptionNotFoundException } from '../utils/exceptions/notFound.exception';
import { SubscriptionAlreadyExistsException } from '../utils/exceptions/badRequest.exception';

import { SubscriptionDto } from './subscription.dto';
import { ISubscriptionCreate, ISubscriptionUpdate } from './subscription.types';
import { getPageParams } from '../utils/pagination';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectRepository(Subscription)
    private repo: Repository<Subscription>,
  ) {}

  public async getMemberSubscription(
    params: Omit<ISubscriptionUpdate, 'data'>,
  ): Promise<Subscription> {
    const { memberId, subscriptionId } = params;

    return (await this.findSubscriptionByMemberId(
      subscriptionId,
      memberId,
    )) as Subscription;
  }

  public async getPagedMembersSubscriptions(
    params: IPagination,
  ): Promise<PagedMemberSubscriptionsDto | void> {
    try {
      const pageParams = getPageParams(params);

      const paginationOptions: FindManyOptions<Subscription> = {
        skip: pageParams.skip,
        take: pageParams.pageSize,
        order: { name: 'ASC' },
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

  public async createSubscription(params: ISubscriptionCreate) {
    try {
      const { data } = params;

      //   await this.findSubscriptionByNameForMember(data.name, data.memberId);

      const dataToSave = {
        name: data.name,
        amount: data.amount,
        startDate: data.startDate,
        dueDate: data.dueDate,
        memberId: data.memberId,
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

      (await this.findSubscriptionByMemberId(
        subscriptionId,
        memberId,
      )) as Subscription;

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
    (await this.findSubscriptionByMemberId(
      subscriptionId,
      memberId,
    )) as Subscription;

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
        .createQueryBuilder()
        .where(`ILIKE :name`, { name: name })
        .andWhere('memberId = :memberId', { memberId: memberId })
        .getOne();

      if (!subscription) {
        throw new SubscriptionAlreadyExistsException(name);
      }
    } catch (error) {
      exceptionHandler(error);
    }
  }

  private async findSubscriptionByMemberId(
    subscriptionId: number,
    memberId: number,
  ): Promise<Subscription | void> {
    try {
      const subscription = await this.repo.findOne({
        where: { id: subscriptionId, memberId: memberId },
      });

      if (!subscription) {
        throw new SubscriptionNotFoundException(subscriptionId);
      }

      return subscription;
    } catch (error) {
      exceptionHandler(error);
    }
  }
}
