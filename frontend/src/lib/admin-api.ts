import api from './api'
import type { Order, Menu } from '../types'

// 대시보드 통계
export const getDashboardStats = async () => {
  const response = await api.get('/api/admin/dashboard')
  return response.data
}

// 주문 목록 조회
export const getOrders = async (status?: string, page = 1, limit = 20) => {
  const params: { page: number; limit: number; status?: string } = {
    page,
    limit,
  }
  if (status && status !== 'all') {
    params.status = status
  }
  const response = await api.get('/api/admin/orders', { params })
  return response.data
}

// 주문 상태 변경
export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await api.patch(`/api/admin/orders/${orderId}/status`, {
    status,
  })
  return response.data
}

// 메뉴 목록 조회
export const getMenus = async (storeId?: string) => {
  const params = storeId ? { store_id: storeId } : {}
  const response = await api.get('/api/admin/menus', { params })
  return response.data
}

// 메뉴 생성
export const createMenu = async (data: {
  store_id: string
  name: string
  price: number
  status?: 'AVAILABLE' | 'SOLD_OUT'
}) => {
  const response = await api.post('/api/admin/menus', data)
  return response.data
}

// 메뉴 수정
export const updateMenu = async (
  menuId: string,
  data: Partial<{
    name: string
    price: number
    status: 'AVAILABLE' | 'SOLD_OUT'
  }>
) => {
  const response = await api.patch(`/api/admin/menus/${menuId}`, data)
  return response.data
}

// 메뉴 삭제
export const deleteMenu = async (menuId: string) => {
  const response = await api.delete(`/api/admin/menus/${menuId}`)
  return response.data
}

