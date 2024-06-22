import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { MemberCreateDto, MemberDto, MemberUpdateDto } from './member.dto';
import { IPagination, PagedMemberDto } from '@utils';
import { FindOptionsWhere } from 'typeorm';
import Member from './member.model';

@Injectable()
export class MemberService {
  constructor(private readonly _repo: MemberRepository) {}

  public async getMember(memberId: number) {
    const member = await this._repo.getMember(memberId);

    return MemberDto.fromEntity(member);
  }

  public async getMembers(pageParams: IPagination) {
    const data = (await this._repo.getPagedMembers(
      pageParams,
    )) as PagedMemberDto;

    return data;
  }

  public async getMembersByCondition(condition: FindOptionsWhere<Member>) {
    const members = (await this._repo.getMembersByCondition(
      condition,
    )) as Member[];

    return members.map(MemberDto.fromEntity);
  }

  public async createMember(data: MemberCreateDto) {
    const memberDto = (await this._repo.createMember(data)) as MemberDto;

    return memberDto;
  }

  public async updateMember(memberId: number, data: MemberUpdateDto) {
    const isUpdated = await this._repo.updateMember(memberId, data);

    return isUpdated;
  }

  public async deleteMember(memberId: number) {
    const isDeleted = await this._repo.deleteMember(memberId);

    return isDeleted;
  }
}
