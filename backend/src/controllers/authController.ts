import { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import { registerSchema, loginSchema } from '../utils/validation'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import { z } from 'zod'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. 입력 검증
    const validated = registerSchema.parse(req.body)

    // 2. 전화번호 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { phone: validated.phone },
    })

    if (existingUser) {
      throw new AppError('Phone number already exists', 400)
    }

    // 3. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(validated.password, 10)

    // 4. 사용자 생성
    const user = await prisma.user.create({
      data: {
        name: validated.name,
        phone: validated.phone,
        password: hashedPassword,
      },
      select: {
        user_id: true,
        name: true,
        phone: true,
        role: true,
        created_at: true,
      },
    })

    // 5. 응답
    res.status(201).json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid input', 400))
    }
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. 입력 검증
    const validated = loginSchema.parse(req.body)

    // 2. 사용자 조회
    const user = await prisma.user.findUnique({
      where: { phone: validated.phone },
    })

    if (!user) {
      throw new AppError('Invalid credentials', 401)
    }

    // 3. 비밀번호 검증
    const isValid = await bcrypt.compare(validated.password, user.password)

    if (!isValid) {
      throw new AppError('Invalid credentials', 401)
    }

    // 4. JWT 토큰 생성
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      jwtSecret,
      { expiresIn }
    )

    // 5. 응답
    res.json({
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return next(new AppError('Invalid input', 400))
    }
    next(error)
  }
}

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 로그아웃은 클라이언트에서 토큰을 삭제하는 방식
    // 서버에서는 성공 응답만 반환
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

