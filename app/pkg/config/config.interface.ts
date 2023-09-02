export interface IGenericService {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  url: string;
}

export interface IOuathConfig {
  oauth_callback: string;
}

export interface NodeEnvironmentConfig {
  type: string; // "local" | "test" | "production"
  port: number;
}

export interface CloudinaryConfig {
  name: string;
  api_key: string;
  secret_key: string;
}

export type RedisConfig = IGenericService;
export type DatabaseConfig = IGenericService & { logging: boolean };

export interface GoogleConfig extends IOuathConfig {
  oauth_google_client_id: string;
  oauth_google_secret_key: string;
}

export interface GithubConfig extends IOuathConfig {
  oauth_github_client_id: string;
  oauth_github_secret_key: string;
}

export interface AzureConfig {
  blob: {
    storage_container_name: string;
    storage_account_name: string;
    storage_connection_string: string;
  };
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
  cloudinary: CloudinaryConfig;
  azure: AzureConfig;
  mailer: MailerConfig;
  swagger: SwaggerConfig;
  throttler: ThrottlerConfig;
}

export interface AuthConfig {
  expiresIn: number;
  access_token_secret: string;
  refresh_token_secret: string;
  google: GoogleConfig;
  github: GithubConfig;
}

export interface ConfigData {
  environment: NodeEnvironmentConfig;

  services: ServicesConfig;

  authentication: AuthConfig;
}
