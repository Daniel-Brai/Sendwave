import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@pkg/config';
import { AppController } from './app.controller';
import { AuthMiddleware } from './app.middleware';
import { AppService } from './app.service';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: (req, res) => ({
          context: 'HTTP',
        }),
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    DomainModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/login', method: RequestMethod.GET },
        { path: '/signup', method: RequestMethod.GET },
        { path: '/verify-account', method: RequestMethod.GET },
        { path: '/forget-password', method: RequestMethod.GET },
        { path: '/dashboard', method: RequestMethod.GET },
      );
  }
}
