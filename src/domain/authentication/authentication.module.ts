import { Module, forwardRef } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@pkg/config';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './services/authentication.service';
import { LocalAuthStrategy } from './strategies/local-authentication.strategy';
import { AuthenticationSerializer } from './providers/session.serializer';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get().services.throttler.ttl,
          limit: configService.get().services.throttler.limit,
        },
      ],
    }),
    PassportModule.register({ session: true }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    LocalAuthStrategy,
    AuthenticationSerializer,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
