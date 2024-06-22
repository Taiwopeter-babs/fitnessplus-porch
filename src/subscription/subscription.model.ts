import { Member } from '@member';
import { BaseModel } from '@shared';
import { Entity, Column, ManyToOne } from 'typeorm';

export enum SubscriptionName {
  PERSONAL = 'personal training',
  TOWEL = 'towel rentals',
}

@Entity('subscriptions')
export class Subscription extends BaseModel {
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
