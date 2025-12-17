import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  statusCode?: number
  status?: string

  constructor(message: string, statusCode: number = 500, status: string = 'error') {
    super(message)
    this.statusCode = statusCode
    this.status = status
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod validation error
  if (err.name === 'ZodError') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input',
      errors: err.errors,
    })
  }

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate entry',
    })
  }

  // AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message || 'Internal Server Error',
    })
  }

  // Default error
  const statusCode = err.statusCode || 500
  const status = err.status || 'error'

  res.status(statusCode).json({
    status,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

