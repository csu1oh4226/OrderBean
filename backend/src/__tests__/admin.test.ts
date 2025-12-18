import request from 'supertest'
import express from 'express'
import { adminRoutes } from '../routes/admin'
import { authenticate, requireAdmin } from '../middleware/auth'

const app = express()
app.use(express.json())
app.use('/api/admin', adminRoutes)

// Mock authenticate and requireAdmin middleware for testing
jest.mock('../middleware/auth', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { userId: 'test-admin-id', role: 'ADMIN' }
    next()
  },
  requireAdmin: (req: any, res: any, next: any) => {
    if (req.user?.role === 'ADMIN') {
      next()
    } else {
      res.status(403).json({ message: 'Admin access required' })
    }
  },
}))

describe('Admin API Tests', () => {
  describe('GET /api/admin/orders', () => {
    it('should return all orders for admin', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .expect(200)

      expect(response.body).toHaveProperty('orders')
      expect(Array.isArray(response.body.orders)).toBe(true)
    })

    it('should support filtering by status', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .query({ status: 'PENDING' })
        .expect(200)

      const orders = response.body.orders
      orders.forEach((order: any) => {
        expect(order.status).toBe('PENDING')
      })
    })

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/admin/orders')
        .query({ page: 1, limit: 20 })
        .expect(200)

      expect(response.body).toHaveProperty('pagination')
    })
  })

  describe('PATCH /api/admin/orders/:id/status', () => {
    it('should update order status', async () => {
      const orderId = 'test-order-id'
      const statusData = {
        status: 'PREPARING',
      }

      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .send(statusData)
        .expect(200)

      expect(response.body).toHaveProperty('order')
      expect(response.body.order.status).toBe(statusData.status)
    })

    it('should return 400 for invalid status', async () => {
      const orderId = 'test-order-id'
      const statusData = {
        status: 'INVALID_STATUS',
      }

      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .send(statusData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })

    it('should return 404 for non-existent order', async () => {
      const orderId = 'non-existent-order-id'
      const statusData = {
        status: 'PREPARING',
      }

      const response = await request(app)
        .patch(`/api/admin/orders/${orderId}/status`)
        .send(statusData)
        .expect(404)

      expect(response.body).toHaveProperty('message')
    })
  })

  describe('POST /api/admin/menus', () => {
    it('should create a new menu', async () => {
      const menuData = {
        store_id: 'test-store-id',
        name: 'Americano',
        price: 4500,
        status: 'AVAILABLE',
      }

      const response = await request(app)
        .post('/api/admin/menus')
        .send(menuData)
        .expect(201)

      expect(response.body).toHaveProperty('menu')
      expect(response.body.menu.name).toBe(menuData.name)
      expect(response.body.menu.price).toBe(menuData.price)
    })

    it('should return 400 if required fields are missing', async () => {
      const menuData = {
        name: 'Americano',
        // Missing store_id, price
      }

      const response = await request(app)
        .post('/api/admin/menus')
        .send(menuData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })
  })

  describe('PATCH /api/admin/menus/:id', () => {
    it('should update menu information', async () => {
      const menuId = 'test-menu-id'
      const updateData = {
        price: 5000,
        status: 'SOLD_OUT',
      }

      const response = await request(app)
        .patch(`/api/admin/menus/${menuId}`)
        .send(updateData)
        .expect(200)

      expect(response.body).toHaveProperty('menu')
      expect(response.body.menu.price).toBe(updateData.price)
      expect(response.body.menu.status).toBe(updateData.status)
    })

    it('should return 404 for non-existent menu', async () => {
      const menuId = 'non-existent-menu-id'
      const updateData = {
        price: 5000,
      }

      const response = await request(app)
        .patch(`/api/admin/menus/${menuId}`)
        .send(updateData)
        .expect(404)

      expect(response.body).toHaveProperty('message')
    })
  })

  describe('GET /api/admin/dashboard', () => {
    it('should return dashboard data', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .expect(200)

      expect(response.body).toHaveProperty('stats')
      expect(response.body.stats).toHaveProperty('totalOrders')
      expect(response.body.stats).toHaveProperty('totalRevenue')
      expect(response.body.stats).toHaveProperty('todayOrders')
    })

    it('should return peak hours data', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .expect(200)

      expect(response.body).toHaveProperty('peakHours')
      expect(Array.isArray(response.body.peakHours)).toBe(true)
    })

    it('should support date range filtering', async () => {
      const response = await request(app)
        .get('/api/admin/dashboard')
        .query({
          startDate: '2025-12-01',
          endDate: '2025-12-31',
        })
        .expect(200)

      expect(response.body).toHaveProperty('stats')
    })
  })
})


