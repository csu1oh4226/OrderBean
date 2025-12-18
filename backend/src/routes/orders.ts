import { Router } from 'express'
import {
  createOrder,
  getOrder,
  getUserOrders,
} from '../controllers/orderController'
import { authenticate } from '../middleware/auth'

export const orderRoutes = Router()

orderRoutes.use(authenticate)

orderRoutes.post('/', createOrder)
orderRoutes.get('/users/me/orders', getUserOrders)
orderRoutes.get('/:id', getOrder)

