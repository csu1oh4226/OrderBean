import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. 매장 생성
  const store1 = await prisma.store.upsert({
    where: { store_id: 'store-001' },
    update: {},
    create: {
      store_id: 'store-001',
      name: '스타벅스 강남점',
      location: '37.4979,127.0276', // 강남역 좌표
      opening_hours: '07:00-22:00',
      max_orders_per_slot: 10,
    },
  })

  const store2 = await prisma.store.upsert({
    where: { store_id: 'store-002' },
    update: {},
    create: {
      store_id: 'store-002',
      name: '이디야커피 역삼점',
      location: '37.5000,127.0300',
      opening_hours: '08:00-21:00',
      max_orders_per_slot: 8,
    },
  })

  const store3 = await prisma.store.upsert({
    where: { store_id: 'store-003' },
    update: {},
    create: {
      store_id: 'store-003',
      name: '할리스커피 선릉점',
      location: '37.5045,127.0489',
      opening_hours: '09:00-20:00',
      max_orders_per_slot: 12,
    },
  })

  console.log('✅ Stores created')

  // 2. 메뉴 생성
  const menus = [
    // 스타벅스 강남점
    {
      menu_id: 'menu-001',
      store_id: store1.store_id,
      name: '아메리카노',
      price: 4500,
      status: 'AVAILABLE' as const,
    },
    {
      menu_id: 'menu-002',
      store_id: store1.store_id,
      name: '카페라떼',
      price: 5000,
      status: 'AVAILABLE' as const,
    },
    {
      menu_id: 'menu-003',
      store_id: store1.store_id,
      name: '카푸치노',
      price: 5000,
      status: 'AVAILABLE' as const,
    },
    {
      menu_id: 'menu-004',
      store_id: store1.store_id,
      name: '바닐라라떼',
      price: 5500,
      status: 'SOLD_OUT' as const,
    },
    // 이디야커피 역삼점
    {
      menu_id: 'menu-005',
      store_id: store2.store_id,
      name: '아메리카노',
      price: 3500,
      status: 'AVAILABLE' as const,
    },
    {
      menu_id: 'menu-006',
      store_id: store2.store_id,
      name: '카페라떼',
      price: 4000,
      status: 'AVAILABLE' as const,
    },
    {
      menu_id: 'menu-007',
      store_id: store2.store_id,
      name: '카라멜마키아토',
      price: 4500,
      status: 'AVAILABLE' as const,
    },
    // 할리스커피 선릉점
    {
      menu_id: 'menu-008',
      store_id: store3.store_id,
      name: '아메리카노',
      price: 4000,
      status: 'AVAILABLE' as const,
    },
    {
      menu_id: 'menu-009',
      store_id: store3.store_id,
      name: '카페라떼',
      price: 4500,
      status: 'AVAILABLE' as const,
    },
    {
      menu_id: 'menu-010',
      store_id: store3.store_id,
      name: '헤이즐넛라떼',
      price: 5000,
      status: 'AVAILABLE' as const,
    },
  ]

  for (const menu of menus) {
    await prisma.menu.upsert({
      where: { menu_id: menu.menu_id },
      update: {},
      create: menu,
    })
  }

  console.log('✅ Menus created')

  // 3. 테스트용 관리자 계정 생성
  const adminUser = await prisma.user.upsert({
    where: { phone: '01000000000' },
    update: {},
    create: {
      name: 'Admin User',
      phone: '01000000000',
      password: '$2a$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqK', // password: admin123
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

