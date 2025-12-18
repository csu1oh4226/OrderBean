import { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import prisma from '../lib/prisma'

export const getNearbyStores = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { latitude, longitude } = req.query

    // 위치 파라미터 검증
    if (!latitude || !longitude) {
      throw new AppError('Latitude and longitude are required', 400)
    }

    const lat = parseFloat(latitude as string)
    const lng = parseFloat(longitude as string)

    if (isNaN(lat) || isNaN(lng)) {
      throw new AppError('Invalid latitude or longitude', 400)
    }

    // 모든 매장 조회 (실제로는 위치 기반 쿼리 필요)
    const stores = await prisma.store.findMany({
      select: {
        store_id: true,
        name: true,
        location: true,
        opening_hours: true,
        max_orders_per_slot: true,
      },
    })

    // 거리 계산 (간단한 예시 - 실제로는 Haversine 공식 사용)
    const storesWithDistance = stores.map((store) => {
      // location에서 좌표 파싱 (예: "37.5665,126.9780")
      const [storeLat, storeLng] = store.location.split(',').map(Number)
      const distance = Math.sqrt(
        Math.pow(lat - storeLat, 2) + Math.pow(lng - storeLng, 2)
      )
      return {
        ...store,
        distance,
      }
    })

    // 거리순 정렬
    storesWithDistance.sort((a, b) => a.distance - b.distance)

    res.json({ stores: storesWithDistance })
  } catch (error) {
    next(error)
  }
}

export const getStoreMenus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    // 매장 존재 확인
    const store = await prisma.store.findUnique({
      where: { store_id: id },
    })

    if (!store) {
      throw new AppError('Store not found', 404)
    }

    // AVAILABLE 상태 메뉴만 조회
    const menus = await prisma.menu.findMany({
      where: {
        store_id: id,
        status: 'AVAILABLE',
      },
      select: {
        menu_id: true,
        store_id: true,
        name: true,
        price: true,
        status: true,
      },
    })

    res.json({ menus })
  } catch (error) {
    next(error)
  }
}

