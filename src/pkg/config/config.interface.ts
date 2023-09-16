export interface IGenericService {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  url?: string;
}

export interface IOuathConfig {
  oauth_callback: string;
}

export interface NodeEnvironmentConfig {
  type: string; // "development" | "test" | "production"
  port: number;
}

export type RedisConfig = IGenericService;
export type DatabaseConfig = IGenericService & { logging: boolean };

export interface GithubConfig extends IOuathConfig {
  oauth_github_client_id: string;
  oauth_github_secret_key: string;
}

export interface MailerConfig {
  smtp: {
    user: string;
    host: string;
    port: number;
    address: string;
    password: string;
  };
}

export interface SwaggerConfig {
  username: string;
  password: string;
}

export interface ThrottlerConfig {
  ttl: number;
  limit: number;
}

export interface ServicesConfig {
  database: DatabaseConfig;
  redis: RedisConfig;
  mailer: MailerConfig;
  swagger: SwaggerConfig;
  throttler: ThrottlerConfig;
}

export interface AuthConfig {
  expiresIn: number;
  cookie_token_secret: string;
  access_token_secret: string;
  refresh_token_secret: string;
  github: GithubConfig;
}

export interface ConfigData {
  environment: NodeEnvironmentConfig;
  services: ServicesConfig;
  authentication: AuthConfig;
}
