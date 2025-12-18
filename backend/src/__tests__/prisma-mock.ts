// Prisma Client Mock for testing
export const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
  store: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  menu: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  order: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  orderItem: {
    create: jest.fn(),
  },
  payment: {
    create: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(mockPrisma)),
}

jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}))

export default mockPrisma

