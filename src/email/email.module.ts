import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const user = configService.get<string>('MAIL_USER');
        const password = configService.get<string>('MAIL_PASSWORD');
        const clientId = configService.get<string>('OAUTH_CLIENTID');
        const clientSecret = configService.get<string>('OAUTH_CLIENT_SECRET');
        const accessToken = configService.get<string>('OAUTH_ACCESS_TOKEN');
        const refreshToken = configService.get<string>('OAUTH_REFRESH_TOKEN');

        return {
          transport: {
            service: 'gmail',
            // host: 'smtp.example.com',
            secure: true,
            auth: {
              type: 'OAuth2',
              user: user,
              pass: password,
              clientId: clientId,
              clientSecret: clientSecret,
              refreshToken: refreshToken,
              accessToken: accessToken,
            },
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
          defaults: {
            from: '"No Reply" <noreply@example.com>',
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
