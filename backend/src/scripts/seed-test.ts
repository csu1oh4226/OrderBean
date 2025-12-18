import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://orderbean:orderbean@localhost:5432/orderbean_test',
    },
  },
})

async function main() {
  console.log('🌱 Seeding test database...')

  // 테스트용 매장 생성 (테스트에서 사용할 ID)
  const testStore = await prisma.store.upsert({
    where: { store_id: 'test-store-id' },
    update: {},
    create: {
      store_id: 'test-store-id',
      name: 'Test Store',
      location: '37.5665,126.9780', // 서울시청 좌표
      opening_hours: '09:00-18:00',
      max_orders_per_slot: 10,
    },
  })

  // 테스트용 메뉴 생성
  const testMenu = await prisma.menu.upsert({
    where: { menu_id: 'test-menu-id' },
    update: {},
    create: {
      menu_id: 'test-menu-id',
      store_id: testStore.store_id,
      name: 'Test Menu',
      price: 4500,
      status: 'AVAILABLE',
    },
  })

  // 품절 메뉴 (테스트용)
  const soldOutMenu = await prisma.menu.upsert({
    where: { menu_id: 'sold-out-menu-id' },
    update: {},
    create: {
      menu_id: 'sold-out-menu-id',
      store_id: testStore.store_id,
      name: 'Sold Out Menu',
      price: 5000,
      status: 'SOLD_OUT',
    },
  })

  console.log('✅ Test data created')
  console.log(`   Store: ${testStore.store_id}`)
  console.log(`   Menu: ${testMenu.menu_id}`)
  console.log(`   Sold Out Menu: ${soldOutMenu.menu_id}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

