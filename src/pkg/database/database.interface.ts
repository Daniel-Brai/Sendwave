import { DataSourceOptions } from 'typeorm';

export interface Database {
  entities: DataSourceOptions['entities'];
}
