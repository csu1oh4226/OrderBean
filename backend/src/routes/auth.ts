import { Router } from 'express'
import { login, register, logout } from '../controllers/authController'

export const authRoutes = Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)

