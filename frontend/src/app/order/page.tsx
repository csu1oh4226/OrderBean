'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import MenuCard from '@/components/MenuCard'
import ShoppingCart from '@/components/ShoppingCart'
import { useCartStore } from '@/store/cartStore'
import type { Menu, MenuOptions } from '@/types'

export default function OrderPage() {
  const router = useRouter()
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [storeId, setStoreId] = useState<string>('store-001') // 임시

  const { items: cartItems, addItem, removeItem, updateQuantity, clearCart } =
    useCartStore()

  useEffect(() => {
    // TODO: API 호출로 메뉴 목록 가져오기
    // 임시 데이터 - 커피 메뉴
    setTimeout(() => {
      setMenus([
        {
          menu_id: 'menu-001',
          name: '에스프레소',
          price: 3500,
          description: '진한 에스프레소',
        },
        {
          menu_id: 'menu-002',
          name: '아메리카노(ICE)',
          price: 4000,
          description: '시원한 아메리카노',
        },
        {
          menu_id: 'menu-003',
          name: '아메리카노(HOT)',
          price: 4000,
          description: '따뜻한 아메리카노',
        },
        {
          menu_id: 'menu-004',
          name: '카푸치노',
          price: 5500,
          description: '부드러운 우유 거품과 에스프레소',
        },
        {
          menu_id: 'menu-005',
          name: '카라멜 마키아토',
          price: 6000,
          description: '카라멜 시럽이 들어간 라떼',
        },
        {
          menu_id: 'menu-006',
          name: '바닐라 라떼',
          price: 6000,
          description: '바닐라 시럽이 들어간 라떼',
        },
      ])
      setLoading(false)
    }, 500)
  }, [])

  const handleAddToCart = (
    menu: Menu,
    options: MenuOptions,
    quantity: number
  ) => {
    addItem({
      menu_id: menu.menu_id,
      menu_name: menu.name,
      base_price: menu.price,
      quantity,
      options,
    })
  }

  const handleRemoveItem = (menuId: string, options: MenuOptions) => {
    removeItem(menuId, options)
  }

  const handleUpdateQuantity = (
    menuId: string,
    options: MenuOptions,
    quantity: number
  ) => {
    updateQuantity(menuId, options, quantity)
  }

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다')
      return
    }

    // TODO: 주문 페이지로 이동 또는 주문 API 호출
    router.push('/order/checkout')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
          >
            OrderBean
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/order"
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
            >
              주문하기
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
            >
              관리자
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 메뉴 영역 */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl font-bold text-black mb-6">메뉴</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <MenuCard
                  key={menu.menu_id}
                  menu={menu}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>

          {/* 장바구니 영역 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <ShoppingCart
                items={cartItems}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
                onOrder={handleOrder}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

