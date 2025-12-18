import { create } from 'zustand'
import type { CartItem, MenuOptions } from '@/types'
import { calculateTotalPrice } from '@/utils/priceCalculator'
import {
  saveCartToStorage,
  loadCartFromStorage,
  clearCartFromStorage,
} from '@/utils/cartStorage'
import { findCartItemIndex, isMatchingCartItem } from '@/utils/cartUtils'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (menuId: string, options: MenuOptions) => void
  updateQuantity: (menuId: string, options: MenuOptions, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    const existingItems = get().items
    const existingIndex = findCartItemIndex(
      existingItems,
      item.menu_id,
      item.options
    )

    let updatedItems: CartItem[]
    if (existingIndex >= 0) {
      updatedItems = [...existingItems]
      updatedItems[existingIndex].quantity += item.quantity
    } else {
      updatedItems = [...existingItems, item]
    }

    set({ items: updatedItems })
    saveCartToStorage(updatedItems)
  },
  removeItem: (menuId, options) => {
    const filteredItems = get().items.filter(
      (item) => !isMatchingCartItem(item, menuId, options)
    )
    set({ items: filteredItems })
    saveCartToStorage(filteredItems)
  },
  updateQuantity: (menuId, options, quantity) => {
    const mappedItems = get().items.map((item) =>
      isMatchingCartItem(item, menuId, options)
        ? { ...item, quantity }
        : item
    )
    set({ items: mappedItems })
    saveCartToStorage(mappedItems)
  },
  clearCart: () => {
    set({ items: [] })
    clearCartFromStorage()
  },
  getTotal: () => {
    return calculateTotalPrice(get().items)
  },
}))

// 로컬 스토리지에서 초기 데이터 로드
const savedCart = loadCartFromStorage()
if (savedCart) {
  useCartStore.setState({ items: savedCart })
}

