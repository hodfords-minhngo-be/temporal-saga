import { DataSource, DataSourceOptions } from 'typeorm';
import { envConfig } from './env.config';

export const dataSourceOptions: DataSourceOptions = {
  type: envConfig.DATABASE.CONNECT,
  host: envConfig.DATABASE.HOST,
  port: envConfig.DATABASE.PORT,
  username: envConfig.DATABASE.USER,
  password: envConfig.DATABASE.PASSWORD,
  database: envConfig.DATABASE.NAME + (envConfig.IS_TEST ? '-test' : ''),
  synchronize: false,
  bigNumberStrings: true,
  multipleStatements: true,
  logging: false,
  dropSchema: envConfig.IS_TEST,
  ssl: envConfig.DATABASE.SSL ? { rejectUnauthorized: false } : false,
  entities: [
    `${envConfig.ROOT_PATH}/domains/**/*.entity.${envConfig.IS_TEST ? 'ts' : 'js'}`,
  ],
  migrations: [
    `${envConfig.ROOT_PATH}/dist/migrations/*.js`,
    `${envConfig.ROOT_PATH}/**/databases/migrations/*.${envConfig.IS_TEST ? 'ts' : 'js'}`,
  ],
  migrationsRun: true,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
