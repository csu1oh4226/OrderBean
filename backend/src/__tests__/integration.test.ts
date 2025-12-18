import request from 'supertest'
import express from 'express'
import { authRoutes } from '../routes/auth'
import { storeRoutes } from '../routes/stores'
import { orderRoutes } from '../routes/orders'

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/stores', storeRoutes)
app.use('/api/orders', orderRoutes)

describe('Integration Tests', () => {
  describe('Complete Order Flow', () => {
    let authToken: string
    let userId: string
    let storeId: string
    let menuId: string

    it('should complete full order flow: register -> login -> browse stores -> create order', async () => {
      // Step 1: Register
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Integration Test User',
          phone: '01099999999',
          password: 'password123',
        })
        .expect(201)

      userId = registerResponse.body.user.user_id

      // Step 2: Login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          phone: '01099999999',
          password: 'password123',
        })
        .expect(200)

      authToken = loginResponse.body.token

      // Step 3: Get nearby stores
      const storesResponse = await request(app)
        .get('/api/stores/nearby')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ latitude: 37.5665, longitude: 126.9780 })
        .expect(200)

      expect(storesResponse.body.stores.length).toBeGreaterThan(0)
      storeId = storesResponse.body.stores[0].store_id

      // Step 4: Get store menus
      const menusResponse = await request(app)
        .get(`/api/stores/${storeId}/menus`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(menusResponse.body.menus.length).toBeGreaterThan(0)
      menuId = menusResponse.body.menus[0].menu_id

      // Step 5: Create order
      const orderResponse = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          store_id: storeId,
          pickup_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          items: [
            {
              menu_id: menuId,
              quantity: 2,
              options: {
                sugar: 'normal',
                ice: 'normal',
              },
            },
          ],
        })
        .expect(201)

      expect(orderResponse.body.order).toHaveProperty('order_id')
      expect(orderResponse.body.order.user_id).toBe(userId)
      expect(orderResponse.body.order.store_id).toBe(storeId)
    })
  })
})


