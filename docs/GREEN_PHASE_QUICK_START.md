# Green 단계 빠른 시작 가이드

Green 단계를 빠르게 시작하기 위한 핵심 가이드입니다.

## 🚀 빠른 시작 (5분)

### 1. 현재 상태 확인

```bash
cd backend
npm test
```

**예상 결과**: 38개 테스트 실패

### 2. 첫 번째 구현: 사용자 등록

가장 간단한 기능부터 시작합니다.

#### 2.1 Prisma Client 설정

```bash
# 파일 생성
touch backend/src/lib/prisma.ts
```

```typescript
// backend/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma
```

#### 2.2 입력 검증 스키마

```bash
# 파일 생성
touch backend/src/utils/validation.ts
```

```typescript
// backend/src/utils/validation.ts
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().regex(/^010\d{8}$/),
  password: z.string().min(6),
})

export const loginSchema = z.object({
  phone: z.string().regex(/^010\d{8}$/),
  password: z.string().min(1),
})
```

#### 2.3 사용자 등록 구현

```typescript
// backend/src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express'
import { AppError } from '../middleware/errorHandler'
import { registerSchema } from '../utils/validation'
import bcrypt from 'bcryptjs'
import prisma from '../lib/prisma'

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
        // Note: Prisma 스키마에 password 필드가 없으므로 추가 필요
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
```

#### 2.4 테스트 실행

```bash
npm test -- auth.test.ts
```

**목표**: 3개 테스트 중 최소 1개 통과

---

## 📝 중요 참고사항

### Prisma 스키마 수정 필요

현재 Prisma 스키마에 `password` 필드가 없습니다. 추가해야 합니다:

```prisma
model User {
  user_id    String   @id @default(uuid())
  name       String
  phone      String   @unique
  password   String   // 추가 필요
  role       UserRole @default(CUSTOMER)
  created_at DateTime @default(now())

  orders Order[]

  @@map("users")
}
```

마이그레이션 실행:
```bash
cd backend
npm run migrate
```

### 데이터베이스 설정

테스트용 데이터베이스가 필요합니다:

```env
# backend/.env
DATABASE_URL=postgresql://orderbean:orderbean@localhost:5432/orderbean_test
```

---

## 🎯 단계별 목표

### 1단계: 첫 테스트 통과 (30분)
- [ ] 사용자 등록 1개 테스트 통과

### 2단계: 인증 기능 완성 (2시간)
- [ ] 인증 관련 6개 테스트 모두 통과

### 3단계: 나머지 기능 (6-8시간)
- [ ] 매장, 주문, 관리자 기능 구현

---

## 💡 팁

1. **한 번에 하나씩**: 한 번에 하나의 테스트만 통과시키기
2. **최소 구현**: 테스트를 통과하는 최소한의 코드만 작성
3. **자주 테스트**: 구현 후 즉시 테스트 실행
4. **에러 메시지 확인**: 실패한 테스트의 에러 메시지를 자세히 읽기

---

## 🔗 관련 문서

- [Green Phase Guide](./GREEN_PHASE_GUIDE.md) - 상세 구현 가이드
- [Green Phase Checklist](./GREEN_PHASE_CHECKLIST.md) - 체크리스트
- [Red Phase Results](../Report/RED_PHASE_RESULTS.md) - 실패한 테스트 상세

---

**시작일**: 2025-12-15

