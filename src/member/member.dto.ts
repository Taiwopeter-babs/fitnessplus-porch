import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import Member, { MembershipType } from './member.model';
import {
  SubscriptionCreateDto,
  SubscriptionDto,
} from '../subscription/subscription.dto';

export class BaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public lastName: string;

  @ApiProperty({
    enum: [
      'Annual Basic',
      'Annual Premium',
      'Monthly Basic',
      'Monthly Premium',
    ],
  })
  @IsEnum(MembershipType)
  @IsNotEmpty()
  public membershipType: MembershipType;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  public startDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  public dueDate: string;

  @ApiProperty()
  @IsNumber()
  @IsDefined()
  public amount: number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  public isPaid: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  public isFirstMonth: boolean;

  @ApiPropertyOptional({ type: [SubscriptionCreateDto] })
  @ValidateNested({ each: true })
  @Type(() => SubscriptionCreateDto)
  @IsOptional()
  public subscriptions: SubscriptionCreateDto[];
}

export class MemberCreateDto extends BaseDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public email: string;
}

export class MemberUpdateDto extends PartialType(BaseDto) {}

export class MemberDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  public firstName: string;

  @ApiProperty()
  @Expose()
  public lastName: string;

  @ApiProperty()
  @Expose()
  public membershipType: MembershipType;

  @ApiProperty()
  @Expose()
  public email: string;

  @ApiProperty()
  @Expose()
  public startDate: string;

  @ApiProperty()
  @Expose()
  public dueDate: string;

  @ApiProperty()
  @Expose()
  amount: number;

  @ApiProperty()
  @Expose()
  public isFirstMonth: boolean;

  @ApiProperty()
  @Expose()
  public isPaid: boolean;

  @ApiProperty()
  @Exclude()
  public invoiceLink: string;

  @ApiProperty()
  @Expose()
  public subscriptions: SubscriptionDto[];

  static fromEntity(entity: Member): MemberDto {
    const dto = plainToInstance(MemberDto, entity, {
      // excludeExtraneousValues: true,
      // enableImplicitConversion: true,
    });

    return dto;
  }
}

export class ParamsDto {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  pageNumber?: number;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional()
  @IsEnum(MembershipType)
  @IsOptional()
  searchString?: MembershipType;
}
