// /* eslint-disable prettier/prettier */
import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

const CONFIG = {
  /** POSTGRESQL CONFIGURATION OPTIONS */
  POSTGRES: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST as string,
    port: parseInt(process.env.POSTGRES_PORT as string, 10) || 5432,
    database: process.env.POSTGRES_DB as string,
    username: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD as string,
  } as DataSourceOptions,

  RABBITMQ_USER: process.env.RABBITMQ_USER as string,
  RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD as string,
  RABBITMQ_HOST: process.env.RABBITMQ_HOST as string,
  RABBITMQ_QUEUE_NAME: process.env.RABBITMQ_QUEUE_NAME,

  OAUTH_CLIENTID: process.env.OAUTH_CLIENTID as string,
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET,
  OAUTH_ACCESS_TOKEN: process.env.OAUTH_ACCESS_TOKEN,
  OAUTH_REFRESH_TOKEN: process.env.OAUTH_REFRESH_TOKEN,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASSWORD: process.env.MAIL_PASSWORD,

  NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
  PORT: parseInt(process.env.PORT as string, 10) || 3001,
};

export default (): Record<string, any> => ({
  POSTGRES: CONFIG.POSTGRES,
  RABBITMQ_USER: CONFIG.RABBITMQ_USER,
  RABBITMQ_PASSWORD: CONFIG.RABBITMQ_PASSWORD,
  RABBITMQ_HOST: CONFIG.RABBITMQ_HOST,
  RABBITMQ_QUEUE_NAME: CONFIG.RABBITMQ_QUEUE_NAME,
  OAUTH_CLIENTID: CONFIG.OAUTH_CLIENTID,
  OAUTH_CLIENT_SECRET: CONFIG.OAUTH_CLIENT_SECRET,
  OAUTH_ACCESS_TOKEN: CONFIG.OAUTH_ACCESS_TOKEN,
  OAUTH_REFRESH_TOKEN: CONFIG.OAUTH_REFRESH_TOKEN,
  MAIL_USER: CONFIG.MAIL_USER,
  MAIL_PASSWORD: CONFIG.MAIL_PASSWORD,
  NODE_ENV: CONFIG.NODE_ENV,

  PORT: CONFIG.PORT,
  CORS_OPTIONS: {
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    origin: '*',
  },
});
