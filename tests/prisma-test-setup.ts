import { execSync } from 'child_process';
import { Client } from 'pg';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables from .env
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const generateTestDatabaseUrl = (originalUrl: string): { testDbName: string; testDbUrl: string; defaultDbConfig: ClientConfig } => {
  const url = new URL(originalUrl);
  const testDbName = `test_${uuidv4().replace(/-/g, '')}`;
  const testDbUrl = `${url.protocol}//${url.username}:${url.password}@${url.hostname}${url.port ? ':' + url.port : ''}/${testDbName}?schema=public`;

  const defaultDbConfig: ClientConfig = {
    user: url.username,
    password: url.password,
    host: url.hostname,
    port: parseInt(url.port || '5432', 10),
    database: 'postgres', // Connect to default db for admin tasks
  };

  return { testDbName, testDbUrl, defaultDbConfig };
};

interface ClientConfig {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
}

export default async () => {
  console.log('\nSetting up test database...');

  const originalDatabaseUrl = process.env.DATABASE_URL;
  if (!originalDatabaseUrl) {
    throw new Error('DATABASE_URL not found in .env file');
  }

  const { testDbName, testDbUrl, defaultDbConfig } = generateTestDatabaseUrl(originalDatabaseUrl);

  // Store the test database URL for the teardown script and test environment
  process.env.TEST_DATABASE_URL = testDbUrl;
  // Also write it to a temporary file for teardown robustness
  fs.writeFileSync(path.join(__dirname, '.test_db_url'), testDbUrl);

  console.log(`  Using test database: ${testDbName}`);

  // Create the test database
  const client = new Client(defaultDbConfig);
  try {
    await client.connect();
    console.log('  Dropping existing test database (if any)...');
    // Ensure no connections before dropping
    await client.query(`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid();`, [testDbName]);
    await client.query(`DROP DATABASE IF EXISTS "${testDbName}";`);
    console.log(`  Creating new test database "${testDbName}"...`);
    await client.query(`CREATE DATABASE "${testDbName}";`);
  } catch (error) {
    console.error('Error creating test database:', error);
    await client.end();
    throw error;
  } finally {
    await client.end();
  }

  // Run migrations against the test database
  try {
    console.log('  Running migrations on test database...');
    // Set the DATABASE_URL temporarily for the prisma command
    process.env.DATABASE_URL = testDbUrl;
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    // Restore original DATABASE_URL in case other processes need it (though Jest should isolate)
    process.env.DATABASE_URL = originalDatabaseUrl;
  } catch (error) {
    console.error('Error running migrations on test database:', error);
    // Attempt to clean up the created database on error
    const cleanupClient = new Client(defaultDbConfig);
    try {
      await cleanupClient.connect();
      await cleanupClient.query(`DROP DATABASE IF EXISTS "${testDbName}";`);
    } finally {
      await cleanupClient.end();
    }
    throw error;
  }

  console.log('Test database setup complete.');
}; 