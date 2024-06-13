import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import Member from '../member/member.model';
import Subscription from '../subscription/subscription.model';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get<DataSourceOptions>('POSTGRES'),

        // configured for development environments only
        synchronize: configService.get<string>('NODE_ENV') === 'development',

        // entities configured with TypeOrmModule.forFeature() are loaded
        autoLoadEntities: true,
        // NestJs autoLoadEntities didn't work. entities had to be specified
        entities: [Member, Subscription],
        migrations: ['./migrations/*.ts'],
        migrationsTableName: 'fitnessplus_migrations',
        ssl: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
  ],
})
export class DatabaseModule {}
