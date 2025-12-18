'use client'

import { useState } from 'react'
import type { Menu, MenuOptions } from '@/types'
import { SHOT_PRICE, SYRUP_PRICE } from '@/constants/prices'
import { calculateUnitPrice } from '@/utils/priceCalculator'

interface MenuCardProps {
  menu: Menu
  onAddToCart: (menu: Menu, options: MenuOptions, quantity: number) => void
}

export default function MenuCard({ menu, onAddToCart }: MenuCardProps) {
  const [shotAdded, setShotAdded] = useState(false)
  const [syrupAdded, setSyrupAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const calculatePrice = (): number => {
    const options: MenuOptions = {
      shot: shotAdded,
      syrup: syrupAdded,
    }
    const unitPrice = calculateUnitPrice(menu.price, options)
    return unitPrice * quantity
  }

  const handleAddToCart = (): void => {
    onAddToCart(
      menu,
      {
        shot: shotAdded,
        syrup: syrupAdded,
      },
      quantity
    )
    // 초기화
    resetOptions()
  }

  const resetOptions = (): void => {
    setShotAdded(false)
    setSyrupAdded(false)
    setQuantity(1)
  }

  const handleQuantityChange = (delta: number): void => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  // 메뉴별 실제 커피 이미지 URL
  const getCoffeeImageUrl = (): string => {
    const menuName = menu.name.toLowerCase()
    
    if (menuName.includes('에스프레소')) {
      return 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop&q=80'
    } else if (menuName.includes('아메리카노')) {
      // ICE 또는 HOT 구분
      if (menu.name.includes('ICE') || menu.name.includes('ice')) {
        return 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&q=80'
      } else {
        // HOT 또는 기본 아메리카노
        return 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop&q=80'
      }
    } else if (menuName.includes('카푸치노')) {
      return 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop&q=80'
    } else if (menuName.includes('카라멜')) {
      return 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop&q=80'
    } else if (menuName.includes('바닐라')) {
      return 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop&q=80'
    }
    // 기본 이미지
    return 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop&q=80'
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* 커피 이미지 - 실제 사진 */}
      <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 relative bg-gray-100">
        <img
          src={getCoffeeImageUrl()}
          alt={menu.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // 이미지 로드 실패 시 기본 이미지로 대체
            e.currentTarget.src = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop&q=80'
          }}
        />
        {/* 그라데이션 오버레이 (텍스트 가독성 향상) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </div>

      {/* 메뉴 정보 */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-gray-800">{menu.name}</h3>
        <p className="text-xl font-bold text-teal-600">
          {calculatePrice().toLocaleString()}원
        </p>
        {menu.description && (
          <p className="text-sm text-gray-600">{menu.description}</p>
        )}
      </div>

      {/* 수량 조절 */}
      <div className="flex items-center justify-between border border-gray-200 rounded-md p-2">
        <button
          onClick={() => handleQuantityChange(-1)}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium"
          disabled={quantity <= 1}
        >
          −
        </button>
        <span className="text-gray-800 font-medium">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(1)}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-medium"
        >
          +
        </button>
      </div>

      {/* 옵션 */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
          <input
            type="checkbox"
            checked={shotAdded}
            onChange={(e) => setShotAdded(e.target.checked)}
            className="w-4 h-4 border-gray-300 rounded text-teal-500 focus:ring-teal-500"
          />
          <span className="text-sm text-gray-700">
            샷 추가 (+{SHOT_PRICE.toLocaleString()}원)
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
          <input
            type="checkbox"
            checked={syrupAdded}
            onChange={(e) => setSyrupAdded(e.target.checked)}
            className="w-4 h-4 border-gray-300 rounded text-teal-500 focus:ring-teal-500"
          />
          <span className="text-sm text-gray-700">
            시럽 추가 (+{SYRUP_PRICE.toLocaleString()}원)
          </span>
        </label>
      </div>

      {/* 담기 버튼 */}
      <button
        onClick={handleAddToCart}
        className="w-full px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-medium transition-colors shadow-sm hover:shadow-md"
      >
        담기
      </button>
    </div>
  )
}

