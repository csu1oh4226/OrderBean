'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { OrderStatus } from '@/types'

interface Order {
  order_id: string
  user: {
    name: string
    phone: string
  }
  store: {
    name: string
  }
  total_price: number
  status: OrderStatus
  created_at: string
  pickup_time: string
  items: Array<{
    menu: {
      name: string
    }
    quantity: number
  }>
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    // TODO: API 호출로 주문 목록 가져오기
    // 임시 데이터
    setTimeout(() => {
      setOrders([
        {
          order_id: 'order-001',
          user: { name: '김철수', phone: '010-1234-5678' },
          store: { name: '스타벅스 강남점' },
          total_price: 12500,
          status: 'PENDING',
          created_at: new Date().toISOString(),
          pickup_time: new Date(Date.now() + 3600000).toISOString(),
          items: [
            { menu: { name: '아메리카노(ICE)' }, quantity: 2 },
            { menu: { name: '카페라떼' }, quantity: 1 },
          ],
        },
        {
          order_id: 'order-002',
          user: { name: '이영희', phone: '010-9876-5432' },
          store: { name: '이디야커피 역삼점' },
          total_price: 8000,
          status: 'PREPARING',
          created_at: new Date(Date.now() - 1800000).toISOString(),
          pickup_time: new Date(Date.now() + 1800000).toISOString(),
          items: [{ menu: { name: '아메리카노(HOT)' }, quantity: 2 }],
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    // TODO: API 호출로 주문 상태 변경
    setOrders(
      orders.map((order) =>
        order.order_id === orderId
          ? { ...order, status: newStatus as OrderStatus }
          : order
      )
    )
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: '대기중',
      PREPARING: '준비중',
      READY: '준비완료',
      COMPLETED: '완료',
      CANCELLED: '취소',
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PREPARING: 'bg-blue-100 text-blue-800',
      READY: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const filteredOrders =
    statusFilter === 'all'
      ? orders
      : orders.filter((order) => order.status === statusFilter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">주문 관리</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 text-sm"
        >
          <option value="all">전체</option>
          <option value="PENDING">대기중</option>
          <option value="PREPARING">준비중</option>
          <option value="READY">준비완료</option>
          <option value="COMPLETED">완료</option>
          <option value="CANCELLED">취소</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="border border-gray-300 rounded p-8 text-center">
            <p className="text-gray-500">주문이 없습니다</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.order_id}
              className="border border-gray-300 rounded p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-black">
                    주문 #{order.order_id.slice(-6)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {order.user.name} ({order.user.phone})
                  </p>
                  <p className="text-sm text-gray-600">{order.store.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-black">
                    {order.total_price.toLocaleString()}원
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusLabel(order.status)}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-bold text-black mb-2">주문 내역</h4>
                <ul className="space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {item.menu.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>
                  주문 시간:{' '}
                  {format(new Date(order.created_at), 'yyyy-MM-dd HH:mm', {
                    locale: ko,
                  })}
                </p>
                <p>
                  픽업 시간:{' '}
                  {format(new Date(order.pickup_time), 'yyyy-MM-dd HH:mm', {
                    locale: ko,
                  })}
                </p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleStatusChange(order.order_id, 'PREPARING')}
                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    준비 시작
                  </button>
                )}
                {order.status === 'PREPARING' && (
                  <button
                    onClick={() => handleStatusChange(order.order_id, 'READY')}
                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    준비 완료
                  </button>
                )}
                {order.status === 'READY' && (
                  <button
                    onClick={() => handleStatusChange(order.order_id, 'COMPLETED')}
                    className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    완료 처리
                  </button>
                )}
                {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleStatusChange(order.order_id, 'CANCELLED')}
                    className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
                  >
                    취소
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

