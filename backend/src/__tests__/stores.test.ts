import request from 'supertest'
import express from 'express'
import { storeRoutes } from '../routes/stores'
import { authenticate } from '../middleware/auth'

const app = express()
app.use(express.json())
app.use('/api/stores', storeRoutes)

// Mock authenticate middleware for testing
jest.mock('../middleware/auth', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { userId: 'test-user-id', role: 'CUSTOMER' }
    next()
  },
}))

describe('Store API Tests', () => {
  describe('GET /api/stores/nearby', () => {
    it('should return nearby stores with location', async () => {
      const response = await request(app)
        .get('/api/stores/nearby')
        .query({ latitude: 37.5665, longitude: 126.9780 })
        .expect(200)

      expect(response.body).toHaveProperty('stores')
      expect(Array.isArray(response.body.stores)).toBe(true)
    })

    it('should return stores sorted by distance', async () => {
      const response = await request(app)
        .get('/api/stores/nearby')
        .query({ latitude: 37.5665, longitude: 126.9780 })
        .expect(200)

      const stores = response.body.stores
      if (stores.length > 1) {
        expect(stores[0].distance).toBeLessThanOrEqual(stores[1].distance)
      }
    })

    it('should return 400 if location is missing', async () => {
      const response = await request(app)
        .get('/api/stores/nearby')
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })
  })

  describe('GET /api/stores/:id/menus', () => {
    it('should return menus for a valid store', async () => {
      const storeId = 'test-store-id'

      const response = await request(app)
        .get(`/api/stores/${storeId}/menus`)
        .expect(200)

      expect(response.body).toHaveProperty('menus')
      expect(Array.isArray(response.body.menus)).toBe(true)
    })

    it('should only return available menus', async () => {
      const storeId = 'test-store-id'

      const response = await request(app)
        .get(`/api/stores/${storeId}/menus`)
        .expect(200)

      const menus = response.body.menus
      menus.forEach((menu: any) => {
        expect(menu.status).toBe('AVAILABLE')
      })
    })

    it('should return 404 for non-existent store', async () => {
      const storeId = 'non-existent-store-id'

      const response = await request(app)
        .get(`/api/stores/${storeId}/menus`)
        .expect(404)

      expect(response.body).toHaveProperty('message')
    })
  })
})


