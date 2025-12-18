// Test setup file
import dotenv from 'dotenv'

// Load test environment variables
dotenv.config({ path: '.env.test' })

// Set test environment variables
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key'
process.env.DATABASE_URL = process.env.DATABASE_URL || process.env.TEST_DATABASE_URL || 'postgresql://orderbean:orderbean@localhost:5432/orderbean_test'
process.env.REDIS_URL = process.env.REDIS_URL || process.env.TEST_REDIS_URL || 'redis://localhost:6379'
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'


