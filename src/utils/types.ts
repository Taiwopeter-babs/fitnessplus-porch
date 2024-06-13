import { MemberDto } from '../member/member.dto';
import { SubscriptionDto } from '../subscription/subscription.dto';

export interface ICorsConfig {
  methods: string | string;
  origin: string | string[];
}

export interface IPagination {
  pageNumber: number;
  pageSize: number;
}

export type PagedItemDto = {
  hasPrevious: boolean;
  hasNext: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
};

export type PagedMemberDto = {
  members: MemberDto[];
} & PagedItemDto;

export type PagedMemberSubscriptionsDto = {
  subscriptions: SubscriptionDto[];
} & PagedItemDto;
