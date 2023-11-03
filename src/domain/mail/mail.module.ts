import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@pkg/config';
import { BATCH_MAIL_QUEUE } from './mail.constants';
import { MailService } from './services/mail.service';
import { MailProcessor } from './services/mail.processor';
import { MailContactEntity } from './entities/mail-contact.entity';
import { MailTemplateEntity } from './entities/mail-template.entity';
import { MailController } from './controllers/mail.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MailContactEntity, MailTemplateEntity]),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get().services.redis.host,
        port: configService.get().services.redis.port,
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule),
    BullModule.registerQueue({
      name: BATCH_MAIL_QUEUE,
    }),
  ],
  controllers: [MailController],
  providers: [MailService, MailProcessor],
  exports: [MailService],
})
export class MailModule {}
