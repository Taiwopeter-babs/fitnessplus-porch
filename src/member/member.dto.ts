import { Exclude, Expose, plainToInstance } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

import Member, { MembershipType } from './member.model';
import {
  SubscriptionCreateDto,
  SubscriptionDto,
} from '../subscription/subscription.dto';

export class BaseDto {
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @IsEnum(MembershipType)
  @IsNotEmpty()
  public membershipType: MembershipType;

  @IsDateString()
  @IsNotEmpty()
  public startDate: string;

  @IsDateString()
  @IsNotEmpty()
  public dueDate: string;

  @IsNumber()
  @IsDefined()
  public amount: number;

  @IsArray()
  @IsOptional()
  public subscriptions: SubscriptionCreateDto[];
}

export class MemberCreateDto extends BaseDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public email: string;
}

export class MemberUpdateDto extends PartialType(BaseDto) {}

export class MemberDto {
  @Expose({ name: 'membershipId' })
  id: number;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;

  @Expose()
  public membershipType: MembershipType;

  @Expose()
  public email: string;

  @Expose()
  public startDate: string;

  @Expose()
  public dueDate: string;

  @Expose()
  public isFirstMonth: boolean;

  @Exclude()
  public invoiceLink: string;

  @Expose()
  public subscriptions: SubscriptionDto[];

  static fromEntity(entity: Member): MemberDto {
    const dto = plainToInstance(MemberDto, entity, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    return dto;
  }
}

export class ParamsDto {
  @IsNumber()
  @IsOptional()
  pageNumber?: number;

  @IsNumber()
  @IsOptional()
  pageSize?: number;

  @IsEnum(MembershipType)
  @IsOptional()
  searchString?: MembershipType;
}
