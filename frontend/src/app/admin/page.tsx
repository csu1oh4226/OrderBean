'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface InventoryItem {
  menu_id: string
  name: string
  stock: number
}

interface Order {
  order_id: string
  created_at: string
  items: Array<{
    menu: {
      name: string
    }
    quantity: number
  }>
  total_price: number
  status: 'PENDING' | 'RECEIVED' | 'PREPARING' | 'READY' | 'COMPLETED'
}

export default function AdminDashboard() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // 대시보드 통계
  const totalOrders = orders.length
  const receivedOrders = orders.filter((o) => o.status === 'RECEIVED').length
  const preparingOrders = orders.filter((o) => o.status === 'PREPARING').length
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED').length

  useEffect(() => {
    // TODO: API 호출로 데이터 가져오기
    // 임시 데이터
    setTimeout(() => {
      setInventory([
        { menu_id: 'menu-001', name: '에스프레소', stock: 10 },
        { menu_id: 'menu-002', name: '아메리카노(ICE)', stock: 10 },
        { menu_id: 'menu-003', name: '아메리카노(HOT)', stock: 10 },
        { menu_id: 'menu-004', name: '카푸치노', stock: 10 },
        { menu_id: 'menu-005', name: '카라멜 마키아토', stock: 10 },
        { menu_id: 'menu-006', name: '바닐라 라떼', stock: 10 },
      ])

      setOrders([
        {
          order_id: 'order-001',
          created_at: new Date().toISOString(),
          items: [{ menu: { name: '아메리카노(ICE)' }, quantity: 1 }],
          total_price: 4000,
          status: 'PENDING',
        },
      ])

      setLoading(false)
    }, 500)
  }, [])

  const handleStockChange = (menuId: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.menu_id === menuId
          ? { ...item, stock: Math.max(0, item.stock + delta) }
          : item
      )
    )
  }

  const handleReceiveOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.order_id === orderId
          ? { ...order, status: 'RECEIVED' as const }
          : order
      )
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 관리자 대시보드 */}
      <div className="border border-gray-300 rounded p-6 bg-gray-50">
        <h2 className="text-lg font-bold text-black mb-3">관리자 대시보드</h2>
        <p className="text-sm text-gray-700">
          총 주문 {totalOrders} / 주문 접수 {receivedOrders} / 제조 중{' '}
          {preparingOrders} / 제조 완료 {completedOrders}
        </p>
      </div>

      {/* 재고 현황 */}
      <div className="border border-gray-300 rounded p-6 bg-gray-50">
        <h2 className="text-lg font-bold text-black mb-4">재고 현황</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inventory.map((item) => (
            <div
              key={item.menu_id}
              className="border border-gray-300 rounded p-4 bg-white"
            >
              <h3 className="text-base font-medium text-black mb-2">
                {item.name}
              </h3>
              <p className="text-lg font-bold text-black mb-3">
                {item.stock}개
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleStockChange(item.menu_id, -1)}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 text-gray-700 font-bold"
                >
                  −
                </button>
                <button
                  onClick={() => handleStockChange(item.menu_id, 1)}
                  className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 text-gray-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 주문 현황 */}
      <div className="border border-gray-300 rounded p-6 bg-gray-50">
        <h2 className="text-lg font-bold text-black mb-4">주문 현황</h2>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-gray-500 text-center py-4">주문이 없습니다</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.order_id}
                className="border border-gray-300 rounded p-4 bg-white flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">
                    {format(new Date(order.created_at), 'M월 d일 HH:mm', {
                      locale: ko,
                    })}
                  </p>
                  <p className="text-base text-black mb-1">
                    {order.items
                      .map((item) => `${item.menu.name} x ${item.quantity}`)
                      .join(', ')}
                  </p>
                  <p className="text-base font-bold text-black">
                    {order.total_price.toLocaleString()}원
                  </p>
                </div>
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleReceiveOrder(order.order_id)}
                    className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 text-sm font-medium"
                  >
                    주문 접수
                  </button>
                )}
                {order.status === 'RECEIVED' && (
                  <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm font-medium">
                    접수 완료
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
