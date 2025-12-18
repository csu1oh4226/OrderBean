import type { CartItem } from '@/types'

const CART_STORAGE_KEY = 'orderbean-cart'

/**
 * 장바구니를 localStorage에 저장
 * @param items 장바구니 아이템 배열
 */
export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save cart to localStorage', error)
  }
}

/**
 * localStorage에서 장바구니 로드
 * @returns 장바구니 아이템 배열 또는 null
 */
export function loadCartFromStorage(): CartItem[] | null {
  if (typeof window === 'undefined') return null

  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (!savedCart) return null

    return JSON.parse(savedCart) as CartItem[]
  } catch (error) {
    console.error('Failed to load cart from localStorage', error)
    return null
  }
}

/**
 * localStorage에서 장바구니 삭제
 */
export function clearCartFromStorage(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(CART_STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear cart from localStorage', error)
  }
}

