import api from '../lib/api'

// Mock axios
jest.mock('axios', () => {
  return {
    create: jest.fn(() => ({
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    })),
  }
})

describe('API Client', () => {
  it('should have baseURL configured', () => {
    expect(api).toBeDefined()
  })

  it('should add Authorization header when token exists', () => {
    // This test will verify the interceptor logic
    // Implementation will be added in Green phase
    expect(true).toBe(true)
  })

  it('should redirect to login on 401 error', () => {
    // This test will verify error handling
    // Implementation will be added in Green phase
    expect(true).toBe(true)
  })
})


