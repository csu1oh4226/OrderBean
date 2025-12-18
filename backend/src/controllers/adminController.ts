import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth'
import { AppError } from '../middleware/errorHandler'
import {
  createMenuSchema,
  updateMenuSchema,
  updateOrderStatusSchema,
} from '../utils/validation'
import prisma from '../lib/prisma'
import { z } from 'zod'

export const getOrders = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = req.query.status as string | undefined
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const skip = (page - 1) * limit

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              user_id: true,
              name: true,
              phone: true,
            },
          },
          store: {
            select: {
              store_id: true,
              name: true,
            },
          },
          items: {
            include: {
              menu: true,
            },
          },
        },
      }),
      prisma.order.count({ where }),
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

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const validated = updateOrderStatusSchema.parse(req.body)

    // 주문 존재 확인
    const order = await prisma.order.findUnique({
      where: { order_id: id },
    })

    if (!order) {
      throw new AppError('Order not found', 404)
    }

    // 주문 상태 업데이트
    const updatedOrder = await prisma.order.update({
      where: { order_id: id },
      data: { status: validated.status },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
        payment: true,
      },
    })

    res.json({ order: updatedOrder })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid status', 400))
    }
    next(error)
  }
}

export const createMenu = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const validated = createMenuSchema.parse(req.body)

    // 매장 존재 확인
    const store = await prisma.store.findUnique({
      where: { store_id: validated.store_id },
    })

    if (!store) {
      throw new AppError('Store not found', 404)
    }

    // 메뉴 생성
    const menu = await prisma.menu.create({
      data: {
        store_id: validated.store_id,
        name: validated.name,
        price: validated.price,
        status: validated.status || 'AVAILABLE',
      },
    })

    res.status(201).json({ menu })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid input', 400))
    }
    next(error)
  }
}

export const updateMenu = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params
    const validated = updateMenuSchema.parse(req.body)

    // 메뉴 존재 확인
    const menu = await prisma.menu.findUnique({
      where: { menu_id: id },
    })

    if (!menu) {
      throw new AppError('Menu not found', 404)
    }

    // 메뉴 업데이트
    const updatedMenu = await prisma.menu.update({
      where: { menu_id: id },
      data: validated,
    })

    res.json({ menu: updatedMenu })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid input', 400))
    }
    next(error)
  }
}

export const getDashboard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const startDate = req.query.startDate
      ? new Date(req.query.startDate as string)
      : new Date(new Date().setHours(0, 0, 0, 0))
    const endDate = req.query.endDate
      ? new Date(req.query.endDate as string)
      : new Date(new Date().setHours(23, 59, 59, 999))

    const where = {
      created_at: {
        gte: startDate,
        lte: endDate,
      },
    }

    // 통계 데이터
    const [totalOrders, totalRevenue, todayOrders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.aggregate({
        where,
        _sum: {
          total_price: true,
        },
      }),
      prisma.order.count({
        where: {
          created_at: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ])

    // 피크 시간 분석 (시간대별 주문 수)
    const orders = await prisma.order.findMany({
      where,
      select: {
        created_at: true,
      },
    })

    const peakHours: { hour: number; count: number }[] = []
    for (let hour = 0; hour < 24; hour++) {
      const count = orders.filter((order) => {
        const orderHour = new Date(order.created_at).getHours()
        return orderHour === hour
      }).length
      peakHours.push({ hour, count })
    }

    peakHours.sort((a, b) => b.count - a.count)

    res.json({
      stats: {
        totalOrders,
        totalRevenue: totalRevenue._sum.total_price || 0,
        todayOrders,
      },
      peakHours: peakHours.slice(0, 5), // 상위 5개 시간대
    })
  } catch (error) {
    next(error)
  }
}

