import Subscription from '../subscription/subscription.model';
import BaseModel from '../utils/base.model';
import { Entity, Column, OneToMany, Index } from 'typeorm';

export enum MembershipType {
  ANNUAL = 'Annual Basic',
  MONTHLY = 'Monthly Premium',
}

@Entity('members')
export default class Member extends BaseModel {
  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  public firstName: string;

  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  public lastName: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 60,
    unique: true,
    nullable: false,
  })
  public email: string;

  @Column({
    type: 'enum',
    enum: MembershipType,
    nullable: false,
    default: MembershipType.ANNUAL,
  })
  public membershipType: MembershipType;

  @Column({
    type: 'boolean',
    default: true,
  })
  public isFirstMonth: boolean;

  @Column({
    type: 'date',
    nullable: false,
  })
  public annualStartDate: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  public annualDueDate: string;

  @Column({
    type: 'integer',
    nullable: false,
  })
  public annualAmount: number;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  public invoiceLink?: string;

  @OneToMany(() => Subscription, (subscription) => subscription.member)
  subscriptions: Subscription[];
}
