import { Router, Request, Response } from 'express';
import healthRouter from './health';
import complianceRouter from './compliance.routes';

const router = Router();

// Health check route
router.use('/health', healthRouter);

// Compliance routes
router.use('/compliance', complianceRouter);

// Root endpoint
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Florida Tax Certificate Sale API',
    documentation: '/api-docs', // Placeholder for future API docs link
  });
});

// Add other routes here
// e.g., router.use('/users', userRouter);

export default router; 