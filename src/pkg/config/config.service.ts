import { Injectable } from '@nestjs/common';
import { DEFAULT_CONFIG } from './config.default';
import {
  ConfigData,
  ServicesConfig,
  AuthConfig,
  NodeEnvironmentConfig,
} from './config.interface';
import { config } from 'dotenv';

// auto load envs into config service
config();

/**
 * Provides an adaptable environment configuration extension
 */
@Injectable()
export class ConfigService {
  private config: ConfigData;
  constructor(data: ConfigData = DEFAULT_CONFIG) {
    this.config = data;
  }

  public loadFromEnv() {
    this.config = this.parseConfigFromEnv(process.env);
  }

  private parseConfigFromEnv(env: NodeJS.ProcessEnv): ConfigData {
    return {
      environment: this.parseNodeEnvironmentConfig(
        env,
        DEFAULT_CONFIG.environment,
      ),
      services: this.parseServicesConfig(env, DEFAULT_CONFIG.services),
      authentication: this.parseAuthenticationConfig(
        env,
        DEFAULT_CONFIG.authentication,
      ),
    };
  }

  private parseNodeEnvironmentConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<NodeEnvironmentConfig>,
  ): NodeEnvironmentConfig {
    return {
      type: env.NODE_ENV! || defaultConfig.type,
      port: parseInt(env.PORT!) || defaultConfig.port,
    };
  }

  private parseServicesConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<ServicesConfig>,
  ): ServicesConfig {
    return {
      database: {
        host: env.DATABASE_HOST! || defaultConfig.database.host,
        port: parseInt(env.DATABASE_PORT!) || defaultConfig.database.port,
        username: env.DATABASE_USERNAME! || defaultConfig.database.username,
        password: env.DATABASE_PASSWORD! || defaultConfig.database.password,
        name: env.DATABASE_NAME! || defaultConfig.database.name,
        url: env.DATABASE_URL! || defaultConfig.database.url,
        logging:
          Boolean(env.DATABASE_LOGGING!) || defaultConfig.database.logging,
      },
      redis: {
        host: env.REDIS_HOST! || defaultConfig.redis.host,
        port: parseInt(env.REDIS_PORT!) || defaultConfig.redis.port,
        username: env.REDIS_USERNAME! || defaultConfig.redis.username,
        password: env.REDIS_PASSWORD! || defaultConfig.redis.password,
        name: env.REDIS_NAME! || defaultConfig.redis.name,
        url: env.REDIS_URL! || defaultConfig.redis.url,
      },
      mailer: {
        smtp: {
          host: env.SMTP_HOST! || defaultConfig.mailer.smtp.host,
          port: parseInt(env.SMTP_PORT!) || defaultConfig.mailer.smtp.port,
          address: env.SMTP_ADDRESS! || defaultConfig.mailer.smtp.address,
          password: env.SMTP_PASSWORD! || defaultConfig.mailer.smtp.password,
        },
      },
      novu: {
        api_key: env.NOVU_API_KEY! || defaultConfig.novu.api_key,
      },
      swagger: {
        username: env.SWAGGER_USERNAME! || defaultConfig.swagger.username,
        password: env.SWAGGER_PASSWORD! || defaultConfig.swagger.password,
      },
      throttler: {
        ttl: parseInt(env.THROTTLER_TTL!) || defaultConfig.throttler.ttl,
        limit: parseInt(env.THROTTLER_LIMIT!) || defaultConfig.throttler.limit,
      },
    };
  }

  private parseAuthenticationConfig(
    env: NodeJS.ProcessEnv,
    defaultConfig: Readonly<AuthConfig>,
  ): AuthConfig {
    return {
      expiresIn: parseInt(env.TOKEN_EXPIRY!) || defaultConfig.expiresIn,
      cookie_token_secret:
        env.COOKIE_TOKEN_SECRET! || defaultConfig.cookie_token_secret,
      access_token_secret:
        env.JWT_ACCESS_TOKEN_SECRET! || defaultConfig.access_token_secret,
      refresh_token_secret:
        env.JWT_REFRESH_TOKEN_SECRET! || defaultConfig.refresh_token_secret,
      github: {
        oauth_github_client_id:
          env.OAUTH_GITHUB_CLIENT_ID! ||
          defaultConfig.github.oauth_github_client_id,
        oauth_callback:
          env.OAUTH_CALLBACK_URL! || defaultConfig.github.oauth_callback,
        oauth_github_secret_key:
          env.OAUTH_GITHUB_SECRET_KEY! ||
          defaultConfig.github.oauth_github_secret_key,
      },
    };
  }

  public get(): Readonly<ConfigData> {
    return this.config;
  }
}
