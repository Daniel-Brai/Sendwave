import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { DatabaseModule } from '@pkg/database';
import { ConfigModule, ConfigService } from '@pkg/config';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    DatabaseModule.forRoot({
      entities: [UserEntity],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get().services.redis.host,
          port: configService.get().services.redis.port,
        },
      }),
      inject: [ConfigService],
    }),
    AuthenticationModule,
    UserModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class DomainModule {}
