import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@pkg/config';
import { MailService } from './services/mail.service';
import { MailContactEntity } from './entities/mail-contact.entity';
import { MailController } from './controllers/mail.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MailContactEntity]),
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
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
