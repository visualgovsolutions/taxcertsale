import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from '@config/index';

const app = express();
const port = config.server.port;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.server.nodeEnv,
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Florida Tax Certificate Sale API',
    documentation: '/api-docs',
  });
});

// Only start the server if this file is run directly, not if it's imported in tests
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running in ${config.server.nodeEnv} mode on port ${port}`);
  });
}

// Export the Express app for testing purposes
export { app }; 