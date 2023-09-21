import { getSecretKey } from '@utils/transformers';
import { ConfigData } from './config.interface';

export const DEFAULT_CONFIG: ConfigData = {
  environment: {
    port: 3000,
    type: 'production',
  },
  services: {
    database: {
      host: '',
      port: 5432,
      username: '',
      password: '',
      name: '',
      url: '',
      logging: true,
    },
    redis: {
      host: '',
      port: 6379,
      username: '',
      password: '',
      name: '',
      url: '',
    },
    mailer: {
      smtp: {
        host: '',
        port: 579,
        address: '',
        password: '',
      },
    },
    swagger: {
      username: '',
      password: '',
    },
    throttler: {
      ttl: 60,
      limit: 10,
    },
  },
  authentication: {
    expiresIn: 30000,
    cookie_token_secret: getSecretKey(),
    access_token_secret: getSecretKey(),
    refresh_token_secret: getSecretKey(),
    github: {
      oauth_github_client_id: '',
      oauth_callback: '',
      oauth_github_secret_key: '',
    },
  },
};
