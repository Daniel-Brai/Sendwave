import { Module } from '@nestjs/common';
import { ConfigService } from '@pkg/config';
import { REDIS } from './redis.constants';
import IOREDIS from 'ioredis';

@Module({
  providers: [
    {
      provide: REDIS,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisClient = new IOREDIS({
          host: `${configService.get().services.redis.host}`,
          port: configService.get().services.redis.port,
          username: `${configService.get().services.redis.username}`,
          password: `${configService.get().services.redis.password}`,
        });
        return redisClient;
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
