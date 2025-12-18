import { z } from 'zod'

// 인증 관련 스키마
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^010\d{8}$/, 'Phone must be 010XXXXXXXX format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  phone: z.string().regex(/^010\d{8}$/, 'Phone must be 010XXXXXXXX format'),
  password: z.string().min(1, 'Password is required'),
})

// 주문 관련 스키마
export const createOrderSchema = z.object({
  store_id: z.string().uuid('Invalid store ID'),
  pickup_time: z.string().datetime('Invalid pickup time'),
  items: z
    .array(
      z.object({
        menu_id: z.string().uuid('Invalid menu ID'),
        quantity: z.number().int().positive('Quantity must be positive'),
        options: z.record(z.any()).optional(),
      })
    )
    .min(1, 'Items array cannot be empty'),
})

// 관리자 관련 스키마
export const createMenuSchema = z.object({
  store_id: z.string().uuid('Invalid store ID'),
  name: z.string().min(1, 'Menu name is required'),
  price: z.number().positive('Price must be positive'),
  status: z.enum(['AVAILABLE', 'SOLD_OUT']).optional(),
})

export const updateMenuSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  status: z.enum(['AVAILABLE', 'SOLD_OUT']).optional(),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED']),
})

