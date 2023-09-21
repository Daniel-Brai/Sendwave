import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { ConfigModule, ConfigService } from '@pkg/config';
import { MailProcessor } from './stmp-mailer.processor';
import { MailService } from './stmp-mailer.service';
import { MAIL_QUEUE } from '../mailer.constants';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get().services.mailer.smtp.host,
          port: configService.get().services.mailer.smtp.port,
          secure: false,
          auth: {
            user: configService.get().services.mailer.smtp.address,
            pass: configService.get().services.mailer.smtp.password,
          },
          tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"No Reply" <${
            configService.get().services.mailer.smtp.address
          }>`,
        },
        template: {
          dir: join(__dirname, '../templates'),
          adapter: new EjsAdapter(),
          options: { strict: true },
        },
      }),
    }),
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
  ],
  providers: [MailProcessor, MailService],
  exports: [MailService],
})
export class MailModule {}
