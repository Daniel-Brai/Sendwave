import { Module } from '@nestjs/common';
import { DatabaseModule } from '@pkg/database';
import { AuthenticationModule } from './authentication/authentication.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';

@Module({
  imports: [
    DatabaseModule.forRoot({
      entities: [UserEntity],
    }),
    AuthenticationModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class DomainModule {}
