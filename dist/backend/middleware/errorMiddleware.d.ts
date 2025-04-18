import { Request, Response } from 'express';
import AppError from '../utils/AppError';
declare const globalErrorHandler: (err: AppError | Error, _req: Request, res: Response) => void | Response<any, Record<string, any>>;
export default globalErrorHandler;
