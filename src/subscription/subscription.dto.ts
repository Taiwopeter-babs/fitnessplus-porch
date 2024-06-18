import { Expose, plainToInstance } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import Subscription, { SubscriptionName } from './subscription.model';

export class SubscriptionCreateDto {
  @IsEnum(SubscriptionName)
  @IsNotEmpty()
  public name: SubscriptionName;

  @IsNumber()
  @IsNotEmpty()
  public amount: number;

  @IsDateString()
  @IsNotEmpty()
  public startDate: string;

  @IsDateString()
  @IsNotEmpty()
  public dueDate: string;
}

export class SubscriptionUpdateDto extends PartialType(SubscriptionCreateDto) {}

export class SubscriptionDto {
  @Expose()
  id: number;

  @Expose({ name: 'subscriptionName' })
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public amount: number;

  @Expose()
  public startDate: string;

  @Expose()
  public dueDate: string;

  static fromEntity(entity: Subscription): SubscriptionDto {
    const dto = plainToInstance(SubscriptionDto, entity, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    return dto;
  }
}
