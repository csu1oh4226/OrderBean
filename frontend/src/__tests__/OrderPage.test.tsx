import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import OrderPage from '@/app/order/page'
import { useCartStore } from '@/store/cartStore'

// Mock the cart store
jest.mock('@/store/cartStore', () => ({
  useCartStore: jest.fn(),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

describe('OrderPage - RED Phase Tests', () => {
  const mockAddItem = jest.fn()
  const mockRemoveItem = jest.fn()
  const mockUpdateQuantity = jest.fn()
  const mockClearCart = jest.fn()

  beforeEach(() => {
    ;(useCartStore as jest.Mock).mockReturnValue({
      items: [],
      addItem: mockAddItem,
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
      clearCart: mockClearCart,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('커피 메뉴 표시', () => {
    it('커피 메뉴 목록이 표시되어야 한다', async () => {
      render(<OrderPage />)

      await waitFor(() => {
        expect(screen.getByText('에스프레소')).toBeInTheDocument()
        expect(screen.getByText('카푸치노')).toBeInTheDocument()
        expect(screen.getByText('카라멜 마키아토')).toBeInTheDocument()
        expect(screen.getByText('바닐라 라떼')).toBeInTheDocument()
        expect(screen.getByText('콜드브루')).toBeInTheDocument()
      })
    })

    it('각 메뉴의 가격이 표시되어야 한다', async () => {
      render(<OrderPage />)

      await waitFor(() => {
        expect(screen.getByText('3,500원')).toBeInTheDocument()
        expect(screen.getByText('5,500원')).toBeInTheDocument()
        expect(screen.getByText('6,000원')).toBeInTheDocument()
      })
    })
  })

  describe('네비게이션 색상', () => {
    it('네비게이션 링크가 보라색 계열로 표시되어야 한다', async () => {
      render(<OrderPage />)

      await waitFor(() => {
        const orderLink = screen.getByText('주문하기').closest('a')
        expect(orderLink).toHaveClass('text-purple-600')
      })
    })

    it('관리자 링크가 보라색 계열로 표시되어야 한다', async () => {
      render(<OrderPage />)

      await waitFor(() => {
        const adminLink = screen.getByText('관리자').closest('a')
        expect(adminLink).toHaveClass('text-purple-600')
      })
    })
  })

  describe('버튼 색상', () => {
    it('담기 버튼이 청록색 계열로 표시되어야 한다', async () => {
      render(<OrderPage />)

      await waitFor(() => {
        const addButtons = screen.getAllByText('담기')
        addButtons.forEach((button) => {
          expect(button).toHaveClass('bg-teal-500')
          expect(button).toHaveClass('hover:bg-teal-600')
        })
      })
    })

    it('주문하기 버튼이 청록색 계열로 표시되어야 한다', async () => {
      ;(useCartStore as jest.Mock).mockReturnValue({
        items: [
          {
            menu_id: 'menu-001',
            menu_name: '에스프레소',
            base_price: 3500,
            quantity: 1,
            options: {},
          },
        ],
        addItem: mockAddItem,
        removeItem: mockRemoveItem,
        updateQuantity: mockUpdateQuantity,
        clearCart: mockClearCart,
      })

      render(<OrderPage />)

      await waitFor(() => {
        const orderButton = screen.getByText('주문하기')
        expect(orderButton).toHaveClass('bg-teal-500')
        expect(orderButton).toHaveClass('hover:bg-teal-600')
      })
    })
  })

  describe('메뉴 카드 기능', () => {
    it('메뉴를 장바구니에 추가할 수 있어야 한다', async () => {
      render(<OrderPage />)

      await waitFor(() => {
        const addButtons = screen.getAllByText('담기')
        fireEvent.click(addButtons[0])
      })

      expect(mockAddItem).toHaveBeenCalled()
    })

    it('샷 추가 옵션을 선택할 수 있어야 한다', async () => {
      render(<OrderPage />)

      await waitFor(() => {
        const shotCheckboxes = screen.getAllByLabelText(/샷 추가/)
        fireEvent.click(shotCheckboxes[0])
        expect(shotCheckboxes[0]).toBeChecked()
      })
    })
  })
})

