import { Module } from '@nestjs/common';
import { DatabaseModule } from '@pkg/database';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    DatabaseModule.forRoot({
      entities: [UserEntity],
    }),
    AuthenticationModule,
    UserModule,
    EmailModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class DomainModule {}
