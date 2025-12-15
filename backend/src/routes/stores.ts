import { Router } from 'express'
import { getNearbyStores, getStoreMenus } from '../controllers/storeController'
import { authenticate } from '../middleware/auth'

export const storeRoutes = Router()

storeRoutes.get('/nearby', authenticate, getNearbyStores)
storeRoutes.get('/:id/menus', authenticate, getStoreMenus)

