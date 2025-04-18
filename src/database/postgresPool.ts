import { Pool, PoolClient } from 'pg';
import config from '../config/index';

let pool: Pool | null = null;

export const getPostgresPool = (): Pool => {
  if (!pool) {
    const poolConfig = {
      user: config.db.user,
      host: config.db.host,
      database: config.db.database,
      password: config.db.password,
      port: config.db.port,
      max: config.db.poolSize || 5, // Use config.db.poolSize
      idleTimeoutMillis: 30000, // Default idle timeout
      connectionTimeoutMillis: 2000, // Default connection timeout
    };

    console.log(`Initializing PostgreSQL connection pool for database "${poolConfig.database}" on ${poolConfig.host}:${poolConfig.port}`);
    pool = new Pool(poolConfig);

    pool.on('error', (err: Error, _client: PoolClient) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
      // Optionally, implement logic to remove the client or handle the error
    });

    pool.on('connect', (_client: PoolClient) => {
      console.log(`PostgreSQL client connected from pool`);
      // You could set session parameters here if needed
      // client.query('SET DATESTYLE = iso, mdy');
    });

    pool.on('acquire', (_client: PoolClient) => {
      // console.log('PostgreSQL client acquired from pool');
    });

    pool.on('remove', (_client: PoolClient) => {
      // console.log('PostgreSQL client removed from pool');
    });
  }

  return pool;
};

export const checkPostgresConnection = async (): Promise<boolean> => {
  const poolInstance = getPostgresPool();
  try {
    const client = await poolInstance.connect();
    await client.query('SELECT 1'); // Simple query to check connection
    client.release();
    console.log('PostgreSQL connection check successful.');
    return true;
  } catch (error) {
    console.error('PostgreSQL connection check failed:', error);
    return false;
  }
};

// Optional: Function to gracefully close the pool
export const closePostgresPool = async (): Promise<void> => {
  if (pool) {
    console.log('Closing PostgreSQL connection pool...');
    await pool.end();
    pool = null;
    console.log('PostgreSQL connection pool closed.');
  }
}; 