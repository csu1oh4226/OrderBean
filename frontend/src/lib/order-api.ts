import api from './api'
import type { Menu, Order, MenuOptions } from '../types'

// 매장 메뉴 조회
export const getStoreMenus = async (storeId: string) => {
  const response = await api.get(`/api/stores/${storeId}/menus`)
  return response.data
}

// 주문 생성
export const createOrder = async (data: {
  store_id: string
  pickup_time: string
  items: Array<{
    menu_id: string
    quantity: number
    options: MenuOptions
  }>
}) => {
  const response = await api.post('/api/orders', data)
  return response.data
}

// 주문 조회
export const getOrder = async (orderId: string) => {
  const response = await api.get(`/api/orders/${orderId}`)
  return response.data
}

// 사용자 주문 목록
export const getUserOrders = async (page = 1, limit = 10) => {
  const response = await api.get('/api/orders/users/me/orders', {
    params: { page, limit },
  })
  return response.data
}

