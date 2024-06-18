import Member from '../member/member.model';
import BaseModel from '../utils/base.model';
import { Entity, Column, ManyToOne } from 'typeorm';

export enum SubscriptionName {
  PERSONAL = 'personal training',
  TOWEL = 'towel rentals',
}

@Entity('subscriptions')
export default class Subscription extends BaseModel {
  @Column({
    type: 'enum',
    enum: SubscriptionName,
    nullable: false,
  })
  public name: SubscriptionName;

  @Column({
    type: 'integer',
    nullable: false,
  })
  public amount: number;

  @Column({
    type: 'date',
    nullable: false,
  })
  public startDate: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  public dueDate: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  public memberId: number;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  public isPaid: boolean;

  @ManyToOne(() => Member, (member) => member.subscriptions)
  member: Member;
}
