import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';
import config from '../config';

// Dynamically load entity files
const entityPath = join(__dirname, '../models/entities');

const options: DataSourceOptions = {
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.user,
  password: config.db.password,
  database: config.db.database,
  synchronize: process.env.NODE_ENV === 'development', // Only for development
  logging: process.env.NODE_ENV === 'development',
  entities: [join(entityPath, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '**', '*.{ts,js}')],
  subscribers: [join(__dirname, 'subscribers', '**', '*.{ts,js}')],
  migrationsTableName: 'typeorm_migrations',
  metadataTableName: 'typeorm_metadata',
};

// Export the configured data source
export const AppDataSource = new DataSource(options);

export default AppDataSource; 