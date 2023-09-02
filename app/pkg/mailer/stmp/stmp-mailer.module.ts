import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailProcessor } from './stmp-mailer.processor';
import { MailService } from './stmp-mailer.service';
import { ConfigModule, ConfigService } from '@pkg/config';
import { join } from 'path';
import { MAIL_QUEUE } from '../mailer.constants';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('EMAIL_HOST'),
          port: +configService.get('EMAIL_PORT'),
          secure: false,
          auth: {
            user: configService.get('EMAIL_ADDRESS'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
          tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false,
          },
        },
        defaults: { from: '"No Reply" <db.projects@outlook.com>' },
        template: {
          dir: join(__dirname, '../../mailer/templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  providers: [EmailProcessor, MailService],
  exports: [MailService],
})
export class MailModule {}
