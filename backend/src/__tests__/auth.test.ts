import request from 'supertest'
import express from 'express'
import { authRoutes } from '../routes/auth'

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)

describe('Auth API Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        phone: '01012345678',
        password: 'password123',
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body).toHaveProperty('user')
      expect(response.body.user).toHaveProperty('user_id')
      expect(response.body.user.name).toBe(userData.name)
      expect(response.body.user.phone).toBe(userData.phone)
      expect(response.body.user).not.toHaveProperty('password')
    })

    it('should return 400 if phone is missing', async () => {
      const userData = {
        name: 'Test User',
        password: 'password123',
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })

    it('should return 400 if phone already exists', async () => {
      const userData = {
        name: 'Test User',
        phone: '01012345678',
        password: 'password123',
      }

      // First registration
      await request(app).post('/api/auth/register').send(userData)

      // Second registration with same phone
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // First register a user
      const userData = {
        name: 'Test User',
        phone: '01012345678',
        password: 'password123',
      }
      await request(app).post('/api/auth/register').send(userData)

      // Then login
      const loginData = {
        phone: '01012345678',
        password: 'password123',
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200)

      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user.phone).toBe(loginData.phone)
    })

    it('should return 401 with invalid credentials', async () => {
      const loginData = {
        phone: '01012345678',
        password: 'wrongpassword',
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401)

      expect(response.body).toHaveProperty('message')
    })

    it('should return 400 if phone is missing', async () => {
      const loginData = {
        password: 'password123',
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400)

      expect(response.body).toHaveProperty('message')
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200)

      expect(response.body).toHaveProperty('message')
    })
  })
})


