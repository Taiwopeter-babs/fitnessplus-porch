import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ICorsConfig } from './utils/types';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
// import * as fs from 'node:fs';

import { MicroServicesExceptionFilter } from './utils/exceptions/exceptionFilter';
// import { MyLogger } from './logger/logger.service';
// import * as path from 'path';

async function bootstrap() {
  // Create logger folder
  // const folderName = path.join(__dirname, '../logs');

  // try {
  //   if (!fs.existsSync(folderName)) {
  //     fs.mkdirSync(folderName);
  //   }
  // } catch (err) {
  //   console.error(err);
  //   return;
  // }

  const app = await NestFactory.create(AppModule, {
    // bufferLogs: false,
    // logger: ['error', 'warn', 'fatal'],
  });

  const configService = app.get(ConfigService);

  // cors config
  const corsConfig = configService.get<ICorsConfig>('CORS_OPTIONS');
  app.enableCors(corsConfig);

  // global path prefix and versioning
  app.setGlobalPrefix('api');

  // global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // ======= MICROSERVICES ========== //

  const user = configService.get('RABBITMQ_USER');
  const password = configService.get('RABBITMQ_PASSWORD');
  const host = configService.get('RABBITMQ_HOST');
  const queueName = configService.get('RABBITMQ_QUEUE_NAME');

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${password}@${host}`],
        queue: queueName,
        queueOptions: {
          durable: true,
        },
        noAck: false,
      },
    },
    { inheritAppConfig: true },
  );

  // logger registration
  // app.useLogger(app.get(MyLogger));

  // register microservices exception filter
  app.useGlobalFilters(new MicroServicesExceptionFilter());

  // ======== START OF SWAGGER SETUP CONFIG ======== //
  const swaggerOptions: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    ignoreGlobalPrefix: false,
  };

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Fitness+ API')
    .setDescription('The Fitness+ API Documentation')
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions,
  );

  SwaggerModule.setup('api/swagger', app, swaggerDocument);
  // ======= END OF SWAGGER SETUP CONFIG ======== //

  await app.startAllMicroservices();

  // get config
  const port = configService.get('PORT') || 3001;

  await app.listen(port);
  console.log(`API Server is listening on port ${port}`);
}

bootstrap();
