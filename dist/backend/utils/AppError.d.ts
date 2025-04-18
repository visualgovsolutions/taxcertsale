/**
 * Custom application error class.
 */
declare class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    /**
     * Creates an instance of AppError.
     * @param message - The error message.
     * @param statusCode - The HTTP status code (e.g., 404, 500).
     * @param isOperational - Indicates if the error is operational (expected) vs. a programming error.
     */
    constructor(message: string, statusCode: number, isOperational?: boolean);
}
export default AppError;
