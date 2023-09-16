import { Module } from '@nestjs/common';
import { Database } from './database.interface';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService, DatabaseConfig } from '@pkg/config';

/**
 * Provides an extensible way to configure databases
 */
@Module({})
export class DatabaseModule {
  private static getConnectionOptions(
    config: ConfigService,
    dbConfig: Database,
  ): TypeOrmModuleOptions {
    const dbData = config.get().services.database;
    if (!dbData) {
      throw Error('No Database Configuration found');
    }
    const connectionOptions = this.getConnectionOptionsPostgres(dbData);
    return {
      ...connectionOptions,
      entities: dbConfig.entities,
      synchronize: true,
      logging: dbData.logging,
    };
  }

  private static getConnectionOptionsPostgres(
    dbData: DatabaseConfig,
  ): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: dbData.host,
      port: dbData.port,
      username: dbData.username,
      password: dbData.password,
      database: dbData.name,
      url: dbData.url,
      keepConnectionAlive: true,
      ssl:
        process.env.NODE_ENV !== 'development' &&
        process.env.NODE_ENV !== 'test'
          ? { rejectUnauthorized: false }
          : false,
    };
  }

  public static forRoot(dbConfig: Database) {
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            return DatabaseModule.getConnectionOptions(configService, dbConfig);
          },
        }),
      ],
      controllers: [],
      providers: [],
      exports: [],
    };
  }
}
