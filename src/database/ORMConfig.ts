// This file serves only as the path for typeorm migrations generation as it is the duplicate
// of the configuration found in database.module.ts file in this same folder path.
// TypeOrm requires an exported Datasource file. This is it

import { DataSource } from 'typeorm';
import configuration from '../utils/config';

import Member from '../member/member.model';
import Subscription from '../subscription/subscription.model';

/**
 * This is for typeorm migrations generation.
 */
const dataSource: DataSource = new DataSource({
  // TypeORM PostgreSQL DB Drivers configuration
  ...configuration().POSTGRES,
  entities: [Member, Subscription],
  // Synchronize database schema with entities
  synchronize: configuration().NODE_ENV === 'development',
  migrations: ['./migrations/*.ts'],
  migrationsTableName: 'fitnessplus_migrations',
  logging: true,
});

export default dataSource;
