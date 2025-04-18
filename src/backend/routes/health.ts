import { Router, Request, Response } from 'express';
import config from '../../config/index';
import { checkPostgresConnection } from '../../database/postgresPool'; // Import the check function
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../../package.json'); // Adjust path as needed

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  // Perform database check
  const dbConnected = await checkPostgresConnection();

  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? 'ok' : 'error',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
    version: version,
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

export default router; 