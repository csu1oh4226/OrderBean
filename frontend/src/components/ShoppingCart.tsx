'use client'

import type { CartItem, MenuOptions } from '@/types'
import {
  calculateItemPrice,
  calculateItemUnitPrice,
  calculateTotalPrice,
} from '@/utils/priceCalculator'

interface ShoppingCartProps {
  items: CartItem[]
  onRemoveItem: (menuId: string, options: MenuOptions) => void
  onUpdateQuantity: (menuId: string, options: MenuOptions, quantity: number) => void
  onOrder: () => void
}

export default function ShoppingCart({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onOrder,
}: ShoppingCartProps) {
  const calculateTotal = () => {
    return calculateTotalPrice(items)
  }

  const getItemKey = (item: CartItem) => {
    return `${item.menu_id}-${JSON.stringify(item.options)}`
  }

  const getItemDisplayName = (item: CartItem) => {
    let name = item.menu_name
    const options: string[] = []
    if (item.options.shot) options.push('샷 추가')
    if (item.options.syrup) options.push('시럽 추가')
    if (options.length > 0) {
      name += ` (${options.join(', ')})`
    }
    return name
  }

  if (items.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">장바구니</h2>
        <p className="text-gray-500 text-center py-8">장바구니가 비어있습니다</p>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
      <h2 className="text-xl font-bold text-gray-800 p-6 pb-4 border-b border-gray-200">
        장바구니
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
        {/* 왼쪽: 주문 내역 */}
        <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div
              key={getItemKey(item)}
              className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 mb-1 truncate">
                  {getItemDisplayName(item)}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>단가: {calculateItemUnitPrice(item.base_price, item.options).toLocaleString()}원</span>
                  <span>×</span>
                  <span>{item.quantity}개</span>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-base font-bold text-gray-900 whitespace-nowrap">
                    {calculateItemPrice(item).toLocaleString()}원
                  </p>
                </div>
                <button
                  onClick={() => onRemoveItem(item.menu_id, item.options)}
                  className="text-red-500 text-sm hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  title="삭제"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 오른쪽: 총 금액 및 주문하기 버튼 */}
        <div className="p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={getItemKey(item)}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-600 truncate pr-2">
                    {getItemDisplayName(item)} × {item.quantity}
                  </span>
                  <span className="text-gray-800 font-medium whitespace-nowrap">
                    {calculateItemPrice(item).toLocaleString()}원
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-300">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-800">총 금액</span>
                <span className="text-2xl font-bold text-teal-600">
                  {calculateTotal().toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onOrder}
            className="w-full mt-6 px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-medium shadow-sm hover:shadow-md transition-all"
          >
            주문하기
          </button>
        </div>
      </div>
    </div>
  )
}
