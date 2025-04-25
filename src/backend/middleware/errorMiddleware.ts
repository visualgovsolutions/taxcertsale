import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import config from '../../config/index';

// Error handling function for development environment
const sendErrorDev = (err: AppError | Error, res: Response) => {
  // Log the full error in development
  console.error('ERROR 💥:', err);

  // Check if it's our operational error or a generic one
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Generic error (likely a programming error)
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
      error: err, // Send full error details in dev
      stack: err.stack, // Send stack trace in dev
    });
  }
};

// Error handling function for production environment
const sendErrorProd = (err: AppError | Error, res: Response) => {
  // Operational, trusted error: send message to client
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      // Do not leak error details like stack trace or full error object
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    // 1) Log error (consider using a dedicated logging service)
    console.error('ERROR 💥 (Production):', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// Global error handling middleware
const globalErrorHandler = (err: AppError | Error, _req: Request, res: Response, next: NextFunction) => {
  // Set default status code and status if not already set (e.g., by AppError)
  if (err instanceof AppError) {
      err.statusCode = err.statusCode || 500;
      err.status = err.status || 'error';
  } else {
      // Handle generic Errors that aren't AppErrors
      // Assign a default status code if it doesn't exist or is not a number
      const statusCode = (err as any).statusCode && typeof (err as any).statusCode === 'number' ? (err as any).statusCode : 500;
      // For generic errors in prod, don't leak details
      if (config.server.nodeEnv === 'production') {
        console.error('ERROR 💥 (Production - Generic):', err);
        // Check if headers are already sent before sending response
        if (!res.headersSent) {
           res.status(statusCode).json({
             status: 'error',
             message: 'Something went wrong. Please try again later.',
           });
        }
        return; // Explicit return after handling
      }
  }

  // Check if headers sent before attempting to send another response
  if (res.headersSent) {
     console.error('Error handler called after headers were sent:', err);
     // If headers are sent, we can't send a new response. Delegate to default handler.
     return next(err); 
  }

  if (config.server.nodeEnv === 'development') {
    // Add return to make exit path explicit
    return sendErrorDev(err, res); 
  } else if (config.server.nodeEnv === 'production') {
    // Note: Add specific error handling for known production errors if needed
    // e.g., handle JWT errors, validation errors specifically below if desired
    // Add return to make exit path explicit
    return sendErrorProd(err, res);
  } else {
     // Default to development behavior if env is not set or recognized
     // Add return to make exit path explicit
     return sendErrorDev(err, res);
  }
};

export default globalErrorHandler; 