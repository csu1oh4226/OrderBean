import { render, screen } from '@testing-library/react'
import Home from '../app/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
}))

describe('Home Page', () => {
  it('should render OrderBean title', () => {
    render(<Home />)
    const title = screen.getByText(/OrderBean/i)
    expect(title).toBeInTheDocument()
  })

  it('should render description text', () => {
    render(<Home />)
    const description = screen.getByText(/바쁜 직장인을 위한 시간 절약형 커피 주문 웹 서비스/i)
    expect(description).toBeInTheDocument()
  })
})


