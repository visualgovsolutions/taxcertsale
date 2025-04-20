import { Client } from 'pg';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface ClientConfig {
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
}

export default async () => {
  console.log('\nTearing down test database...');

  let testDbUrl: string | undefined;
  const tempUrlPath = path.join(__dirname, '.test_db_url');

  try {
    // Read the test DB URL from the temporary file
    if (fs.existsSync(tempUrlPath)) {
      testDbUrl = fs.readFileSync(tempUrlPath, 'utf-8');
    } else {
      // Fallback to environment variable if file not found
      testDbUrl = process.env.TEST_DATABASE_URL;
    }

    if (!testDbUrl) {
      console.warn('Test database URL not found, skipping teardown.');
      return;
    }

    const url = new URL(testDbUrl);
    const testDbName = url.pathname.substring(1); // Remove leading '/'

    const defaultDbConfig: ClientConfig = {
      user: url.username,
      password: url.password,
      host: url.hostname,
      port: parseInt(url.port || '5432', 10),
      database: 'postgres', // Connect to default db for admin tasks
    };

    console.log(`  Dropping test database: ${testDbName}`);
    const client = new Client(defaultDbConfig);
    try {
      await client.connect();
      // Ensure no connections before dropping
      await client.query(`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid();`, [testDbName]);
      await client.query(`DROP DATABASE IF EXISTS "${testDbName}";`);
      console.log('  Test database dropped successfully.');
    } catch (error) {
      console.error('Error dropping test database:', error);
      // Don't throw error during teardown
    } finally {
      await client.end();
    }

  } catch (error) {
    console.error('Error during teardown process:', error);
  } finally {
    // Clean up the temporary file
    if (fs.existsSync(tempUrlPath)) {
      try {
        fs.unlinkSync(tempUrlPath);
      } catch (unlinkError) {
        console.error('Error removing .test_db_url file:', unlinkError);
      }
    }
  }
}; 