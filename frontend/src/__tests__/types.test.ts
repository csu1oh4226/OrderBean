import type { User, Store, Menu, Order, OrderItem, Payment } from '../types'

describe('Type Definitions', () => {
  it('should have correct User type structure', () => {
    const user: User = {
      user_id: 'test-id',
      name: 'Test User',
      phone: '01012345678',
      role: 'CUSTOMER',
      created_at: '2025-12-15T00:00:00Z',
    }

    expect(user.user_id).toBe('test-id')
    expect(user.role).toBe('CUSTOMER')
  })

  it('should have correct Store type structure', () => {
    const store: Store = {
      store_id: 'store-id',
      name: 'Test Store',
      location: 'Seoul',
      opening_hours: '09:00-18:00',
      max_orders_per_slot: 10,
    }

    expect(store.store_id).toBe('store-id')
    expect(store.max_orders_per_slot).toBe(10)
  })

  it('should have correct Menu type structure', () => {
    const menu: Menu = {
      menu_id: 'menu-id',
      store_id: 'store-id',
      name: 'Americano',
      price: 4500,
      status: 'AVAILABLE',
    }

    expect(menu.menu_id).toBe('menu-id')
    expect(menu.status).toBe('AVAILABLE')
  })

  it('should have correct Order type structure', () => {
    const order: Order = {
      order_id: 'order-id',
      user_id: 'user-id',
      store_id: 'store-id',
      pickup_time: '2025-12-15T12:00:00Z',
      status: 'PENDING',
      total_price: 9000,
      created_at: '2025-12-15T10:00:00Z',
    }

    expect(order.order_id).toBe('order-id')
    expect(order.status).toBe('PENDING')
  })
})


