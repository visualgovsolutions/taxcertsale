/**
 * Custom application error class.
 */
class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  // Optional: Add an errorCode field for specific error types
  // public errorCode?: string;

  /**
   * Creates an instance of AppError.
   * @param message - The error message.
   * @param statusCode - The HTTP status code (e.g., 404, 500).
   * @param isOperational - Indicates if the error is operational (expected) vs. a programming error.
   */
  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational; // Used to distinguish expected errors from bugs
    // this.errorCode = errorCode;

    // Capture stack trace, excluding constructor call from it
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly (needed for extending built-in classes like Error)
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export default AppError; 