import { Module } from '@nestjs/common';
import { CronService } from './cron.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import { MemberModule } from '@member';
import { SubscriptionModule } from '@subscription';

@Module({
  imports: [ConfigModule, MemberModule, SubscriptionModule],
  providers: [
    CronService,
    {
      provide: 'EMAIL_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const user = configService.get<string>('RABBITMQ_USER');
        const password = configService.get<string>('RABBITMQ_PASSWORD');
        const host = configService.get<string>('RABBITMQ_HOST');
        const queueName = configService.get<string>('RABBITMQ_QUEUE_NAME');

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
  ],
})
export class CronModule {}
