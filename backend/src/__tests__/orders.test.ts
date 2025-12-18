import request from 'supertest'
import express from 'express'
import { orderRoutes } from '../routes/orders'
import { authenticate } from '../middleware/auth'

const app = express()
app.use(express.json())
app.use('/api/orders', orderRoutes)

// Mock authenticate middleware for testing
jest.mock('../middleware/auth', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { userId: 'test-user-id', role: 'CUSTOMER' }
    next()
  },
}))

describe('Order API Tests', () => {
  describe('POST /api/orders', () => {
    it('should create an order with valid data', async () => {
      const orderData = {
        store_id: 'test-store-id',
        pickup_time: '2025-12-15T12:00:00Z',
        items: [
          {
            menu_id: 'test-menu-id',
            quantity: 2,
            options: {
              sugar: 'normal',
              ice: 'normal',
              shots: 1,
            },
          },
        ],
      }

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201)

      expect(response.body).toHaveProperty('order')
      expect(response.body.order).toHaveProperty('order_id')
      expect(response.body.order.store_id).toBe(orderData.store_id)
      expect(response.body.order.pickup_time).toBe(orderData.pickup_time)
      expect(response.body.order.status).toBe('PENDING')
    })

    it('should return 400 if store_id is missing', async () => {
      const orderData = {
        pickup_time: '2025-12-15T12:00:00Z',
        items: [],
      }

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })

    it('should return 400 if items array is empty', async () => {
      const orderData = {
        store_id: 'test-store-id',
        pickup_time: '2025-12-15T12:00:00Z',
        items: [],
      }

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })

    it('should return 400 if pickup_time is in the past', async () => {
      const orderData = {
        store_id: 'test-store-id',
        pickup_time: '2020-01-01T12:00:00Z',
        items: [
          {
            menu_id: 'test-menu-id',
            quantity: 1,
          },
        ],
      }

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })

    it('should return 400 if menu is sold out', async () => {
      const orderData = {
        store_id: 'test-store-id',
        pickup_time: '2025-12-15T12:00:00Z',
        items: [
          {
            menu_id: 'sold-out-menu-id',
            quantity: 1,
          },
        ],
      }

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toContain('sold out')
    })

    it('should return 400 if time slot is full', async () => {
      const orderData = {
        store_id: 'test-store-id',
        pickup_time: '2025-12-15T12:00:00Z',
        items: [
          {
            menu_id: 'test-menu-id',
            quantity: 1,
          },
        ],
      }

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
      expect(response.body.message).toContain('full')
    })
  })

  describe('GET /api/orders/:id', () => {
    it('should return order details for valid order', async () => {
      const orderId = 'test-order-id'

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200)

      expect(response.body).toHaveProperty('order')
      expect(response.body.order.order_id).toBe(orderId)
      expect(response.body.order).toHaveProperty('items')
      expect(response.body.order).toHaveProperty('payment')
    })

    it('should return 404 for non-existent order', async () => {
      const orderId = 'non-existent-order-id'

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(404)

      expect(response.body).toHaveProperty('message')
    })

    it('should return 403 if user tries to access another user\'s order', async () => {
      const orderId = 'other-user-order-id'

      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(403)

      expect(response.body).toHaveProperty('message')
    })
  })

  describe('GET /api/users/me/orders', () => {
    it('should return user\'s orders', async () => {
      const response = await request(app)
        .get('/api/users/me/orders')
        .expect(200)

      expect(response.body).toHaveProperty('orders')
      expect(Array.isArray(response.body.orders)).toBe(true)
    })

    it('should return orders sorted by created_at descending', async () => {
      const response = await request(app)
        .get('/api/users/me/orders')
        .expect(200)

      const orders = response.body.orders
      if (orders.length > 1) {
        const firstDate = new Date(orders[0].created_at)
        const secondDate = new Date(orders[1].created_at)
        expect(firstDate.getTime()).toBeGreaterThanOrEqual(secondDate.getTime())
      }
    })

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/users/me/orders')
        .query({ page: 1, limit: 10 })
        .expect(200)

      expect(response.body).toHaveProperty('pagination')
      expect(response.body.pagination).toHaveProperty('page')
      expect(response.body.pagination).toHaveProperty('limit')
      expect(response.body.pagination).toHaveProperty('total')
    })
  })
})


