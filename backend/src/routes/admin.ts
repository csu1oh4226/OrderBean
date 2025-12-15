import { Router } from 'express'
import {
  getOrders,
  updateOrderStatus,
  createMenu,
  updateMenu,
  getDashboard,
} from '../controllers/adminController'
import { authenticate, requireAdmin } from '../middleware/auth'

export const adminRoutes = Router()

adminRoutes.use(authenticate)
adminRoutes.use(requireAdmin)

adminRoutes.get('/orders', getOrders)
adminRoutes.patch('/orders/:id/status', updateOrderStatus)
adminRoutes.post('/menus', createMenu)
adminRoutes.patch('/menus/:id', updateMenu)
adminRoutes.get('/dashboard', getDashboard)

