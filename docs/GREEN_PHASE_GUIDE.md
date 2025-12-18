# Green 단계 구현 가이드

이 문서는 TDD Green 단계를 효과적으로 진행하기 위한 전략과 단계별 구현 가이드를 제공합니다.

## 📋 목차

1. [전략 개요](#전략-개요)
2. [구현 우선순위](#구현-우선순위)
3. [단계별 구현 계획](#단계별-구현-계획)
4. [구현 체크리스트](#구현-체크리스트)
5. [코드 예시](#코드-예시)

---

## 전략 개요

### Green 단계 목표

- **38개의 실패한 테스트를 모두 통과**시키기
- **최소한의 코드**로 테스트 통과 (Refactor는 나중에)
- **단계별로 진행**하여 점진적으로 테스트 통과

### 핵심 원칙

1. **작은 단위로 진행**: 한 번에 하나의 기능씩 구현
2. **테스트 주도**: 구현 후 즉시 테스트 실행
3. **최소 구현**: 테스트를 통과하는 최소한의 코드만 작성
4. **의존성 순서**: 기반이 되는 기능부터 구현

---

## 구현 우선순위

### Phase 1: 기반 구축 (필수)
1. ✅ Prisma Client 설정 및 데이터베이스 연결
2. ✅ 입력 검증 유틸리티 (Zod 스키마)
3. ✅ 인증 미들웨어 완성

### Phase 2: 인증 기능 (우선순위 1)
4. ✅ 사용자 등록 (회원가입)
5. ✅ 로그인 및 JWT 토큰 생성
6. ✅ 로그아웃

### Phase 3: 매장 기능 (우선순위 2)
7. ✅ 근처 매장 조회
8. ✅ 매장 메뉴 조회

### Phase 4: 주문 기능 (우선순위 3)
9. ✅ 주문 생성
10. ✅ 주문 조회
11. ✅ 사용자 주문 목록

### Phase 5: 관리자 기능 (우선순위 4)
12. ✅ 주문 관리
13. ✅ 메뉴 관리
14. ✅ 대시보드

---

## 단계별 구현 계획

### Step 1: 기반 구축 (1-2시간)

#### 1.1 Prisma Client 설정

```typescript
// backend/src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default prisma
```

#### 1.2 입력 검증 유틸리티

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

#### 1.3 인증 미들웨어 완성

- JWT 토큰 검증 로직 구현
- 사용자 정보 추출

---

### Step 2: 인증 기능 구현 (2-3시간)

#### 2.1 사용자 등록

**구현 항목:**
- [ ] 입력 검증 (Zod 스키마)
- [ ] 전화번호 중복 확인
- [ ] 비밀번호 해싱 (bcrypt)
- [ ] 사용자 생성 (Prisma)
- [ ] 응답 형식 맞추기

**테스트 통과 목표:**
- ✅ should register a new user with valid data
- ✅ should return 400 if phone is missing
- ✅ should return 400 if phone already exists

#### 2.2 로그인

**구현 항목:**
- [ ] 입력 검증
- [ ] 사용자 조회
- [ ] 비밀번호 검증
- [ ] JWT 토큰 생성
- [ ] 응답 형식 맞추기

**테스트 통과 목표:**
- ✅ should login with valid credentials
- ✅ should return 401 with invalid credentials
- ✅ should return 400 if phone is missing

#### 2.3 로그아웃

**구현 항목:**
- [ ] 간단한 성공 응답 (토큰 무효화는 나중에)

**테스트 통과 목표:**
- ✅ should logout successfully

---

### Step 3: 매장 기능 구현 (1-2시간)

#### 3.1 근처 매장 조회

**구현 항목:**
- [ ] 위치 파라미터 검증
- [ ] 매장 목록 조회 (Prisma)
- [ ] 거리 계산 및 정렬
- [ ] 응답 형식 맞추기

**테스트 통과 목표:**
- ✅ should return nearby stores with location
- ✅ should return stores sorted by distance
- ✅ should return 400 if location is missing

#### 3.2 매장 메뉴 조회

**구현 항목:**
- [ ] 매장 존재 확인
- [ ] 메뉴 조회 (AVAILABLE만)
- [ ] 404 에러 처리
- [ ] 응답 형식 맞추기

**테스트 통과 목표:**
- ✅ should return menus for a valid store
- ✅ should only return available menus
- ✅ should return 404 for non-existent store

---

### Step 4: 주문 기능 구현 (3-4시간)

#### 4.1 주문 생성

**구현 항목:**
- [ ] 입력 검증 (store_id, items, pickup_time)
- [ ] 픽업 시간 검증 (과거 시간 체크)
- [ ] 메뉴 존재 및 품절 확인
- [ ] 시간대별 주문 제한 확인
- [ ] 주문 생성 (트랜잭션)
- [ ] 결제 정보 생성
- [ ] 응답 형식 맞추기

**테스트 통과 목표:**
- ✅ should create an order with valid data
- ✅ should return 400 if store_id is missing
- ✅ should return 400 if items array is empty
- ✅ should return 400 if pickup_time is in the past
- ✅ should return 400 if menu is sold out
- ✅ should return 400 if time slot is full

#### 4.2 주문 조회

**구현 항목:**
- [ ] 주문 존재 확인
- [ ] 권한 확인 (본인 주문만)
- [ ] 주문 정보 조회 (items, payment 포함)
- [ ] 404/403 에러 처리

**테스트 통과 목표:**
- ✅ should return order details for valid order
- ✅ should return 404 for non-existent order
- ✅ should return 403 if user tries to access another user's order

#### 4.3 사용자 주문 목록

**구현 항목:**
- [ ] 라우트 경로 수정 (필요시)
- [ ] 사용자 주문 조회
- [ ] 정렬 (created_at DESC)
- [ ] 페이지네이션

**테스트 통과 목표:**
- ✅ should return user's orders
- ✅ should return orders sorted by created_at descending
- ✅ should support pagination

---

### Step 5: 관리자 기능 구현 (2-3시간)

#### 5.1 주문 관리

**구현 항목:**
- [ ] 주문 목록 조회
- [ ] 상태별 필터링
- [ ] 페이지네이션
- [ ] 주문 상태 업데이트
- [ ] 상태 값 검증
- [ ] 404 에러 처리

**테스트 통과 목표:**
- ✅ should return all orders for admin
- ✅ should support filtering by status
- ✅ should support pagination
- ✅ should update order status
- ✅ should return 400 for invalid status
- ✅ should return 404 for non-existent order

#### 5.2 메뉴 관리

**구현 항목:**
- [ ] 메뉴 생성
- [ ] 필수 필드 검증
- [ ] 메뉴 수정
- [ ] 404 에러 처리

**테스트 통과 목표:**
- ✅ should create a new menu
- ✅ should return 400 if required fields are missing
- ✅ should update menu information
- ✅ should return 404 for non-existent menu

#### 5.3 대시보드

**구현 항목:**
- [ ] 통계 데이터 조회
- [ ] 피크 시간 분석
- [ ] 날짜 범위 필터링

**테스트 통과 목표:**
- ✅ should return dashboard data
- ✅ should return peak hours data
- ✅ should support date range filtering

---

## 구현 체크리스트

### 공통 사항

- [ ] Prisma Client import 및 사용
- [ ] 입력 검증 (Zod 스키마)
- [ ] 에러 처리 (AppError 사용)
- [ ] 적절한 HTTP 상태 코드
- [ ] 응답 형식 테스트와 일치

### 각 기능별

#### 인증
- [ ] 비밀번호 해싱 (bcrypt)
- [ ] JWT 토큰 생성/검증
- [ ] 전화번호 중복 확인

#### 매장
- [ ] 위치 기반 조회
- [ ] 거리 계산
- [ ] 품절 메뉴 필터링

#### 주문
- [ ] 트랜잭션 처리
- [ ] 시간대별 주문 제한
- [ ] 권한 검증

#### 관리자
- [ ] 관리자 권한 확인
- [ ] 페이지네이션
- [ ] 통계 계산

---

## 코드 예시

### 예시 1: 사용자 등록

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
        // password는 스키마에 없으므로 별도 처리 필요
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

### 예시 2: 로그인

```typescript
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
    const token = jwt.sign(
      { userId: user.user_id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
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
```

---

## 진행 방법

### 1. 단계별 진행

```bash
# Step 1 완료 후 테스트
cd backend
npm test -- auth.test.ts

# Step 2 완료 후 테스트
npm test -- stores.test.ts

# 모든 테스트 실행
npm test
```

### 2. 점진적 통과

- 한 번에 하나의 테스트만 통과시켜도 OK
- 작은 단위로 커밋
- 각 단계마다 테스트 실행

### 3. 문제 해결

- 테스트 실패 시 에러 메시지 확인
- 예상 응답과 실제 응답 비교
- 단계별로 디버깅

---

## 예상 소요 시간

- **Step 1 (기반 구축)**: 1-2시간
- **Step 2 (인증)**: 2-3시간
- **Step 3 (매장)**: 1-2시간
- **Step 4 (주문)**: 3-4시간
- **Step 5 (관리자)**: 2-3시간

**총 예상 시간**: 9-14시간

---

## 다음 단계

Green 단계 완료 후:
1. 모든 테스트 통과 확인
2. Refactor 단계 진행
3. 코드 품질 개선
4. 성능 최적화

---

**작성일**: 2025-12-15  
**상태**: Green 단계 진행 중

