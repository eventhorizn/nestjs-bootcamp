import { DataSource, DataSourceOptions } from 'typeorm';

export const appDevDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: ['**/*.entity.ts'],
  migrations: [__dirname + '/migrations/*.ts'],
  migrationsRun: true,
} as DataSourceOptions);
