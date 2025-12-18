export type UserRole = 'CUSTOMER' | 'ADMIN'

export interface User {
  user_id: string
  name: string
  phone: string
  role: UserRole
  created_at: string
}

export interface Store {
  store_id: string
  name: string
  location: string
  opening_hours: string
  max_orders_per_slot: number
}

export type MenuStatus = 'AVAILABLE' | 'SOLD_OUT'

export interface Menu {
  menu_id: string
  store_id: string
  name: string
  price: number
  status: MenuStatus
  description?: string
  image_url?: string
}

export type OrderStatus = 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED'

export interface Order {
  order_id: string
  user_id: string
  store_id: string
  pickup_time: string
  status: OrderStatus
  total_price: number
  created_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  order_item_id: string
  order_id: string
  menu_id: string
  menu_name?: string
  options: Record<string, any>
  quantity: number
  unit_price?: number
  total_price?: number
}

export type PaymentMethod = 'CARD' | 'ACCOUNT' | 'MOBILE'

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'

export interface Payment {
  payment_id: string
  order_id: string
  method: PaymentMethod
  status: PaymentStatus
  amount: number
}

