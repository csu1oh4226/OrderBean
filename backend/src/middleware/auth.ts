import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: {
    userId: string
    role: string
  }
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      throw new AppError('Authentication required', 401)
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as { userId: string; role: string }

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    }

    next()
  } catch (error) {
    next(new AppError('Invalid or expired token', 401))
  }
}

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError('Admin access required', 403))
  }
  next()
}

