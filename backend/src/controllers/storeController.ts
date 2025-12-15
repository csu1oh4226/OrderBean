import { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'

export const getNearbyStores = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement get nearby stores logic
    res.json({ message: 'Get nearby stores endpoint' })
  } catch (error) {
    next(error)
  }
}

export const getStoreMenus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement get store menus logic
    res.json({ message: 'Get store menus endpoint' })
  } catch (error) {
    next(error)
  }
}

