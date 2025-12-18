import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth'
import { AppError } from '../middleware/errorHandler'
import { createOrderSchema } from '../utils/validation'
import prisma from '../lib/prisma'
import { z } from 'zod'

export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. 입력 검증
    const validated = createOrderSchema.parse(req.body)

    // 2. 픽업 시간 검증 (과거 시간 체크)
    const pickupTime = new Date(validated.pickup_time)
    const now = new Date()
    if (pickupTime <= now) {
      throw new AppError('Pickup time must be in the future', 400)
    }

    // 3. 매장 존재 확인
    const store = await prisma.store.findUnique({
      where: { store_id: validated.store_id },
    })

    if (!store) {
      throw new AppError('Store not found', 404)
    }

    // 4. 메뉴 존재 및 품절 확인
    const menuIds = validated.items.map((item) => item.menu_id)
    const menus = await prisma.menu.findMany({
      where: {
        menu_id: { in: menuIds },
        store_id: validated.store_id,
      },
    })

    if (menus.length !== menuIds.length) {
      throw new AppError('Some menus not found', 400)
    }

    const soldOutMenus = menus.filter((menu) => menu.status === 'SOLD_OUT')
    if (soldOutMenus.length > 0) {
      throw new AppError('Some menus are sold out', 400)
    }

    // 5. 시간대별 주문 제한 확인
    const timeSlot = new Date(pickupTime)
    timeSlot.setMinutes(0, 0, 0) // 시간대별로 그룹화

    const ordersInSlot = await prisma.order.count({
      where: {
        store_id: validated.store_id,
        pickup_time: {
          gte: timeSlot,
          lt: new Date(timeSlot.getTime() + 60 * 60 * 1000), // 1시간 후
        },
        status: {
          not: 'CANCELLED',
        },
      },
    })

    if (ordersInSlot >= store.max_orders_per_slot) {
      throw new AppError('Time slot is full', 400)
    }

    // 6. 총 가격 계산
    let totalPrice = 0
    for (const item of validated.items) {
      const menu = menus.find((m) => m.menu_id === item.menu_id)
      if (menu) {
        totalPrice += Number(menu.price) * item.quantity
      }
    }

    // 7. 주문 생성 (트랜잭션)
    const order = await prisma.$transaction(async (tx) => {
      // 주문 생성
      const newOrder = await tx.order.create({
        data: {
          user_id: req.user!.userId,
          store_id: validated.store_id,
          pickup_time: pickupTime,
          total_price: totalPrice,
          status: 'PENDING',
          items: {
            create: validated.items.map((item) => ({
              menu_id: item.menu_id,
              quantity: item.quantity,
              options: item.options || {},
            })),
          },
        },
        include: {
          items: {
            include: {
              menu: true,
            },
          },
        },
      })

      // 결제 정보 생성
      await tx.payment.create({
        data: {
          order_id: newOrder.order_id,
          method: 'CARD',
          status: 'PENDING',
          amount: totalPrice,
        },
      })

      return newOrder
    })

    res.status(201).json({ order })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid input', 400))
    }
    next(error)
  }
}

export const getOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const userId = req.user!.userId
    const userRole = req.user!.role

    // 주문 조회
    const order = await prisma.order.findUnique({
      where: { order_id: id },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
        payment: true,
      },
    })

    if (!order) {
      throw new AppError('Order not found', 404)
    }

    // 권한 확인 (본인 주문이거나 관리자)
    if (order.user_id !== userId && userRole !== 'ADMIN') {
      throw new AppError('Access denied', 403)
    }

    res.json({ order })
  } catch (error) {
    next(error)
  }
}

export const getUserOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    // 주문 목록 조회
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              menu: true,
            },
          },
          payment: true,
        },
      }),
      prisma.order.count({
        where: { user_id: userId },
      }),
    ])

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    next(error)
  }
}

