import { create } from 'zustand'

interface CartItem {
  menu_id: string
  menu_name: string
  base_price: number
  quantity: number
  options: {
    shot?: boolean
    syrup?: boolean
  }
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (menuId: string, options: any) => void
  updateQuantity: (menuId: string, options: any, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => {
    const existingItems = get().items
    const existingIndex = existingItems.findIndex(
      (existing) =>
        existing.menu_id === item.menu_id &&
        JSON.stringify(existing.options) === JSON.stringify(item.options)
    )

    if (existingIndex >= 0) {
      const updatedItems = [...existingItems]
      updatedItems[existingIndex].quantity += item.quantity
      set({ items: updatedItems })
    } else {
      set({ items: [...existingItems, item] })
    }

    // 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('orderbean-cart', JSON.stringify(get().items))
    }
  },
  removeItem: (menuId, options) => {
    const newItems = get().items.filter(
      (item) =>
        !(
          item.menu_id === menuId &&
          JSON.stringify(item.options) === JSON.stringify(options)
        )
    )
    set({ items: newItems })

    // 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('orderbean-cart', JSON.stringify(newItems))
    }
  },
  updateQuantity: (menuId, options, quantity) => {
    const newItems = get().items.map((item) =>
      item.menu_id === menuId &&
      JSON.stringify(item.options) === JSON.stringify(options)
        ? { ...item, quantity }
        : item
    )
    set({ items: newItems })

    // 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('orderbean-cart', JSON.stringify(newItems))
    }
  },
  clearCart: () => {
    set({ items: [] })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('orderbean-cart')
    }
  },
  getTotal: () => {
    return get().items.reduce((total, item) => {
      let price = item.base_price
      if (item.options.shot) price += 500
      return total + price * item.quantity
    }, 0)
  },
}))

// 로컬 스토리지에서 초기 데이터 로드
if (typeof window !== 'undefined') {
  const savedCart = localStorage.getItem('orderbean-cart')
  if (savedCart) {
    try {
      const items = JSON.parse(savedCart)
      useCartStore.setState({ items })
    } catch (e) {
      console.error('Failed to load cart from localStorage', e)
    }
  }
}

