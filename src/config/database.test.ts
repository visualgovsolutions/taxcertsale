import { DataSource, EntityTarget, ObjectLiteral, Repository, QueryRunner } from 'typeorm';
import { Bid } from '../models/entities/bid.entity';
import { User } from '../models/entities/user.entity';
import { Auction } from '../models/entities/auction.entity';
import { Certificate } from '../models/entities/certificate.entity';
import { County } from '../models/entities/county.entity';
import { Property } from '../models/entities/property.entity';

// Create a unique database name for each test run to ensure isolation
const getTestDatabaseName = () => {
  return `test_${process.env.JEST_WORKER_ID || '1'}_${Date.now()}`;
};

export const TestDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'test',
  password: process.env.DB_PASSWORD || 'test',
  database: process.env.DB_DATABASE || getTestDatabaseName(),
  synchronize: true,
  dropSchema: true,
  logging: process.env.DEBUG === 'true',
  entities: [Bid, User, Auction, Certificate, County, Property],
  migrations: [],
  subscribers: [],
});

let connection: DataSource | null = null;
let queryRunner: QueryRunner | null = null;

export const initializeTestDatabase = async (): Promise<DataSource> => {
  try {
    if (!connection || !connection.isInitialized) {
      connection = await TestDataSource.initialize();
      await connection.synchronize(true); // Force schema recreation
      queryRunner = connection.createQueryRunner();
    }
    return connection;
  } catch (error) {
    console.error('Error during test database initialization:', error);
    throw error;
  }
};

export const closeTestDatabase = async (): Promise<void> => {
  try {
    if (queryRunner) {
      await queryRunner.release();
      queryRunner = null;
    }
    if (connection?.isInitialized) {
      await connection.dropDatabase(); // Drop the test database
      await connection.destroy(); // Close the connection
      connection = null;
    }
  } catch (error) {
    console.error('Error during test database cleanup:', error);
    throw error;
  }
};

export const getTestRepository = <T extends ObjectLiteral>(
  entity: EntityTarget<T>
): Repository<T> => {
  if (!connection?.isInitialized) {
    throw new Error('Database connection not initialized');
  }
  return connection.getRepository(entity);
};

// Helper function to clear all tables
export const clearAllTables = async (): Promise<void> => {
  if (!connection?.isInitialized) {
    throw new Error('Database connection not initialized');
  }

  try {
    await connection.query('TRUNCATE TABLE bid CASCADE');
    await connection.query('TRUNCATE TABLE certificate CASCADE');
    await connection.query('TRUNCATE TABLE auction CASCADE');
    await connection.query('TRUNCATE TABLE property CASCADE');
    await connection.query('TRUNCATE TABLE county CASCADE');
    await connection.query('TRUNCATE TABLE "user" CASCADE');
  } catch (error) {
    console.error('Error clearing tables:', error);
    throw error;
  }
};

// Helper function to start a transaction
export const startTransaction = async (): Promise<void> => {
  if (!queryRunner) {
    throw new Error('Query runner not initialized');
  }
  await queryRunner.startTransaction();
};

// Helper function to rollback a transaction
export const rollbackTransaction = async (): Promise<void> => {
  if (!queryRunner) {
    throw new Error('Query runner not initialized');
  }
  await queryRunner.rollbackTransaction();
};

// Helper function to commit a transaction
export const commitTransaction = async (): Promise<void> => {
  if (!queryRunner) {
    throw new Error('Query runner not initialized');
  }
  await queryRunner.commitTransaction();
};
