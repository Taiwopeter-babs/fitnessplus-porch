import { Expose, plainToInstance } from 'class-transformer';
import { IsDateString, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { SubscriptionName, Subscription } from './subscription.model';

console.log(SubscriptionName);

export class SubscriptionCreateDto {
  // @ApiProperty({ enum: ['personal training', 'towel rentals'] })
  @ApiProperty()
  @IsEnum(SubscriptionName)
  @IsNotEmpty()
  public name: SubscriptionName;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public amount: number;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  public startDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  public dueDate: string;
}

export class SubscriptionUpdateDto extends PartialType(SubscriptionCreateDto) {}

export class SubscriptionDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose({ name: 'subscriptionName' })
  public name: string;

  @ApiProperty()
  @Expose()
  public email: string;

  @ApiProperty()
  @Expose()
  public amount: number;

  @ApiProperty()
  @Expose()
  public startDate: string;

  @ApiProperty()
  @Expose()
  public dueDate: string;

  @ApiProperty()
  @Expose()
  public memberId: number;

  static fromEntity(entity: Subscription): SubscriptionDto {
    const dto = plainToInstance(SubscriptionDto, entity, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    return dto;
  }
}
