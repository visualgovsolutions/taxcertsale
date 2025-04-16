import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'taxcertsale',
    poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_development_secret',
    expiresIn: parseInt(process.env.JWT_EXPIRATION || '3600', 10),
    refreshExpiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRATION || '2592000', 10),
  },
  api: {
    prefix: process.env.API_PREFIX || '/api/v1',
  },
};

export default config; 