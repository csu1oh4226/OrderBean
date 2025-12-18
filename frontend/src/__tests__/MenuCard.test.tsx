import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MenuCard from '@/components/MenuCard'

describe('MenuCard - RED Phase Tests', () => {
  const mockMenu = {
    menu_id: 'menu-001',
    name: '에스프레소',
    price: 3500,
    description: '진한 에스프레소',
  }

  const mockOnAddToCart = jest.fn()

  beforeEach(() => {
    mockOnAddToCart.mockClear()
  })

  it('메뉴 이름이 표시되어야 한다', () => {
    render(<MenuCard menu={mockMenu} onAddToCart={mockOnAddToCart} />)
    expect(screen.getByText('에스프레소')).toBeInTheDocument()
  })

  it('메뉴 가격이 표시되어야 한다', () => {
    render(<MenuCard menu={mockMenu} onAddToCart={mockOnAddToCart} />)
    expect(screen.getByText('3,500원')).toBeInTheDocument()
  })

  it('담기 버튼이 청록색 계열로 표시되어야 한다', () => {
    render(<MenuCard menu={mockMenu} onAddToCart={mockOnAddToCart} />)
    const addButton = screen.getByText('담기')
    expect(addButton).toHaveClass('bg-teal-500')
    expect(addButton).toHaveClass('hover:bg-teal-600')
  })

  it('담기 버튼 클릭 시 onAddToCart가 호출되어야 한다', () => {
    render(<MenuCard menu={mockMenu} onAddToCart={mockOnAddToCart} />)
    const addButton = screen.getByText('담기')
    fireEvent.click(addButton)
    expect(mockOnAddToCart).toHaveBeenCalledTimes(1)
  })

  it('샷 추가 옵션 선택 시 가격이 증가해야 한다', () => {
    render(<MenuCard menu={mockMenu} onAddToCart={mockOnAddToCart} />)
    const shotCheckbox = screen.getByLabelText(/샷 추가/)
    fireEvent.click(shotCheckbox)
    expect(screen.getByText('4,000원')).toBeInTheDocument()
  })
})

