import { FindManyOptions, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import exceptionHandler from '../utils/exceptions/exceptionHandler';
import { getPageParams } from '../utils/pagination';
import { IPagination, PagedMemberDto } from '../utils/types';

import Member from './member.model';

import { MemberNotFoundException } from 'src/utils/exceptions/notFound.exception';
import { MemberAlreadyExistsException } from 'src/utils/exceptions/badRequest.exception';
import { MemberCreateDto, MemberDto, MemberUpdateDto } from './member.dto';

import { SubscriptionRepository } from '../subscription/subscription.repository';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member)
    private repo: Repository<Member>,
    private subscriptionRepo: SubscriptionRepository,
  ) {}

  public async getMember(id: number): Promise<Member> {
    return (await this.findMemberById(id)) as Member;
  }

  public async getPagedMembers(
    params: IPagination,
  ): Promise<PagedMemberDto | void> {
    try {
      const pageParams = getPageParams(params);

      const paginationOptions: FindManyOptions<Member> = {
        skip: pageParams.skip,
        take: pageParams.pageSize,
        order: { firstName: 'ASC' },
      };

      const [itemsCount, items] = await Promise.all([
        this.repo.count(),
        this.repo.find({ ...paginationOptions }),
      ]);

      const totalPages = Math.ceil(itemsCount / pageParams.pageSize);

      const data: PagedMemberDto = {
        members: items.map(MemberDto.fromEntity),
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

  public async getMemberByEmail(email: string): Promise<Member | void> {
    try {
      const member = await this.repo.findOne({
        where: { email: email },
        relations: { subscriptions: true },
      });

      if (!member) {
        throw new MemberNotFoundException(email);
      }

      return member;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async createMember(member: MemberCreateDto) {
    try {
      await this.findMemberByEmail(member.email);

      const dataToSave = {
        email: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
        membershipType: member.membershipType,
        startDate: member.startDate,
        dueDate: member.dueDate,
      };

      const newMember = await this.repo.save(dataToSave as Member);

      // save subscriptons of member
      const memberSubscriptions = member.subscriptions.map((subscription) => {
        return this.subscriptionRepo.createSubscription({
          memberId: newMember.id,
          data: subscription,
        });
      });

      await Promise.all([...memberSubscriptions]);

      return MemberDto.fromEntity(newMember);
    } catch (error) {
      //   console.error(error);
      exceptionHandler(error);
    }
  }

  public async updateMember(memberId: number, data: MemberUpdateDto) {
    try {
      await this.findMemberById(memberId);

      //   const updateData = {
      //     firstName: data.firstName,
      //     lastName: data.lastName,
      //     memebershipType: data.membershipType,
      //     annualStartDate: data.phone,
      //   };

      await this.repo.update(memberId, { ...data } as Member);

      return true;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async deleteMember(id: number) {
    (await this.findMemberById(id)) as Member;

    try {
      await this.repo
        .createQueryBuilder()
        .delete()
        .from(Member)
        .where('id = :id', { id: id })
        .execute();

      return true;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  private async findMemberByEmail(email: string): Promise<void> {
    try {
      const member = await this.repo.findOne({
        select: { email: true },
        // or query
        where: { email: email.toLowerCase() },
      });

      if (member) {
        throw new MemberAlreadyExistsException(email);
      }
    } catch (error) {
      exceptionHandler(error);
    }
  }

  private async findMemberById(id: number): Promise<Member | void> {
    try {
      const member = await this.repo.findOne({
        where: { id: id },
        relations: { subscriptions: true },
      });

      if (!member) {
        throw new MemberNotFoundException(id);
      }

      return member;
    } catch (error) {
      exceptionHandler(error);
    }
  }
}
