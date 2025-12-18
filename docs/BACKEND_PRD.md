# 백엔드 개발 PRD: OrderBean

## Document Info

- **작성자**: OrderBean Backend Team
- **작성일**: 2025-12-18
- **최종 수정일**: 2025-12-18
- **버전**: 1.0
- **상태**: Draft
- **참조 문서**: [PRD_Up1.md](./PRD_Up1.md)

---

## Table of Contents

1. [개요](#1-개요)
2. [기술 스택](#2-기술-스택)
3. [데이터 모델](#3-데이터-모델)
4. [API 명세](#4-api-명세)
5. [비즈니스 로직](#5-비즈니스-로직)
6. [인증 및 보안](#6-인증-및-보안)
7. [에러 처리](#7-에러-처리)
8. [성능 요구사항](#8-성능-요구사항)
9. [테스트 전략](#9-테스트-전략)
10. [배포 및 운영](#10-배포-및-운영)

---

## 1. 개요

### 1.1 목적

이 문서는 OrderBean 백엔드 시스템의 개발을 위한 상세 명세서입니다. 프론트엔드와의 API 통신, 데이터 관리, 비즈니스 로직 구현에 필요한 모든 요구사항을 정의합니다.

### 1.2 범위

- RESTful API 설계 및 구현
- 데이터베이스 스키마 설계 및 관리
- 인증 및 권한 관리
- 주문 처리 및 상태 관리
- 메뉴 및 옵션 관리
- 관리자 기능

### 1.3 핵심 요구사항

- **메뉴 관리**: 커피 이름, 설명, 가격, 이미지, 재고수량 관리
- **옵션 관리**: 옵션 이름, 옵션 가격, 메뉴 연결
- **주문 관리**: 주문일시, 주문내용(메뉴, 수량, 옵션, 금액)

### 1.4 사용자 흐름 개요

자세한 사용자 흐름은 [USER_FLOW.md](./USER_FLOW.md) 문서를 참조하세요.

**주요 흐름**:
1. **메뉴 조회**: Menus에서 메뉴 정보 조회 (고객 화면: 재고수량 제외, 관리자 화면: 재고수량 포함)
2. **장바구니**: 사용자가 메뉴 선택 후 장바구니에 추가 (로컬 상태)
3. **주문 생성**: "주문하기" 클릭 시 Orders에 저장 (주문시간, 주문내용: 메뉴, 수량, 옵션, 금액)
4. **주문 현황**: 관리자 화면에서 Orders 정보 표시
5. **상태 변경**: 주문 상태 변경 (기본: "주문접수" → "제조중" → "완료")

---

## 2. 기술 스택

### 2.1 현재 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| Runtime | Node.js | 18+ |
| Framework | Express.js | 4.x |
| Language | TypeScript | 5.x |
| ORM | Prisma | 5.x |
| Database | PostgreSQL | 14+ |
| Authentication | JWT (jsonwebtoken) | 9.x |
| Validation | Zod | 3.x |
| Testing | Jest | 29.x |

### 2.2 프로젝트 구조

```
backend/
├── src/
│   ├── controllers/      # 요청 처리 컨트롤러
│   ├── services/         # 비즈니스 로직 (향후 추가)
│   ├── models/           # Prisma 모델 (prisma/schema.prisma)
│   ├── routes/           # API 라우트
│   ├── middleware/       # 미들웨어 (인증, 에러 처리)
│   ├── utils/            # 유틸리티 함수
│   ├── types/            # TypeScript 타입 정의
│   └── index.ts          # 애플리케이션 진입점
├── prisma/
│   └── schema.prisma     # 데이터베이스 스키마
├── __tests__/            # 테스트 파일
├── package.json
└── tsconfig.json
```

---

## 3. 데이터 모델

### 3.1 엔터티 개요

백엔드 시스템은 다음 주요 엔터티를 관리합니다:

1. **User**: 사용자 정보
2. **Store**: 매장 정보
3. **Menu**: 메뉴 정보 (커피 이름, 설명, 가격, 이미지, 재고수량)
4. **MenuOption**: 메뉴 옵션 (옵션 이름, 옵션 가격, 연결할 메뉴)
5. **Order**: 주문 정보 (주문일시, 주문내용)
6. **OrderItem**: 주문 항목 (메뉴, 수량, 옵션, 금액)
7. **Payment**: 결제 정보

### 3.2 상세 데이터 모델

#### 3.2.1 User (사용자)

```prisma
model User {
  user_id    String   @id @default(uuid())
  name       String
  phone      String   @unique
  email      String?  @unique
  password   String   // bcrypt 해시
  role       UserRole @default(CUSTOMER)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  orders Order[]

  @@map("users")
}
```

**필드 설명**:
- `user_id`: 사용자 고유 ID (UUID)
- `name`: 사용자 이름
- `phone`: 전화번호 (고유)
- `email`: 이메일 (선택, 고유)
- `password`: 비밀번호 (bcrypt 해시)
- `role`: 사용자 역할 (CUSTOMER, ADMIN)
- `created_at`: 생성일시
- `updated_at`: 수정일시

#### 3.2.2 Store (매장)

```prisma
model Store {
  store_id          String   @id @default(uuid())
  name              String
  location          String   // "latitude,longitude" 형식
  opening_hours     String   // 영업시간 정보
  max_orders_per_slot Int    @default(10)
  created_at        DateTime @default(now())
  updated_at        DateTime @updatedAt

  menus  Menu[]
  orders Order[]

  @@map("stores")
}
```

**필드 설명**:
- `store_id`: 매장 고유 ID (UUID)
- `name`: 매장 이름
- `location`: 위치 정보 (위도,경도)
- `opening_hours`: 영업시간
- `max_orders_per_slot`: 시간대별 최대 주문 수
- `created_at`: 생성일시
- `updated_at`: 수정일시

#### 3.2.3 Menu (메뉴) ⭐ 핵심

```prisma
model Menu {
  menu_id     String     @id @default(uuid())
  store_id   String
  name       String     // 커피 이름
  description String?   // 설명
  price      Decimal    @db.Decimal(10, 2) // 가격
  image_url  String?   // 이미지 URL
  stock      Int        @default(0) // 재고수량
  status     MenuStatus @default(AVAILABLE)
  created_at DateTime   @default(now())
  updated_at DateTime   @updatedAt

  store        Store        @relation(fields: [store_id], references: [store_id], onDelete: Cascade)
  order_items  OrderItem[]
  menu_options MenuOption[] // 메뉴에 연결된 옵션들

  @@map("menus")
  @@index([store_id])
  @@index([status])
}
```

**필드 설명**:
- `menu_id`: 메뉴 고유 ID (UUID)
- `store_id`: 매장 ID (FK)
- `name`: 커피 이름 ✅
- `description`: 설명 ✅
- `price`: 가격 ✅
- `image_url`: 이미지 URL ✅
- `stock`: 재고수량 ✅
- `status`: 메뉴 상태 (AVAILABLE, SOLD_OUT)
- `created_at`: 생성일시
- `updated_at`: 수정일시

**비즈니스 규칙**:
- `stock`이 0 이하일 때 `status`는 자동으로 `SOLD_OUT`으로 변경
- 주문 시 `stock`이 자동으로 감소
- 재고 복구 시 `stock` 증가 및 `status` 자동 업데이트

#### 3.2.4 MenuOption (메뉴 옵션) ⭐ 핵심

```prisma
model MenuOption {
  option_id  String   @id @default(uuid())
  menu_id    String   // 연결할 메뉴
  name       String   // 옵션 이름
  price      Decimal  @db.Decimal(10, 2) // 옵션 가격
  is_active  Boolean  @default(true)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  menu Menu @relation(fields: [menu_id], references: [menu_id], onDelete: Cascade)
  order_items OrderItem[] // 이 옵션을 사용한 주문 항목들

  @@map("menu_options")
  @@index([menu_id])
}
```

**필드 설명**:
- `option_id`: 옵션 고유 ID (UUID)
- `menu_id`: 연결할 메뉴 ID (FK) ✅
- `name`: 옵션 이름 ✅
- `price`: 옵션 가격 ✅
- `is_active`: 활성화 여부
- `created_at`: 생성일시
- `updated_at`: 수정일시

**비즈니스 규칙**:
- 하나의 메뉴는 여러 옵션을 가질 수 있음
- 옵션은 특정 메뉴에만 연결됨
- 비활성화된 옵션은 주문 시 선택 불가

**예시 옵션**:
- "샷 추가" (+500원)
- "시럽 추가" (+0원)
- "얼음 적게" (+0원)
- "당도 조절" (+0원)

#### 3.2.5 Order (주문) ⭐ 핵심

```prisma
model Order {
  order_id    String      @id @default(uuid())
  user_id     String
  store_id    String
  pickup_time DateTime    // 픽업 예정 시간
  status      OrderStatus @default(PENDING)
  total_price Decimal     @db.Decimal(10, 2)
  created_at  DateTime    @default(now()) // 주문일시 ✅
  updated_at  DateTime    @updatedAt

  user     User        @relation(fields: [user_id], references: [user_id], onDelete: Cascade)
  store    Store       @relation(fields: [store_id], references: [store_id], onDelete: Cascade)
  items    OrderItem[] // 주문내용 ✅
  payment  Payment?

  @@map("orders")
  @@index([user_id])
  @@index([store_id])
  @@index([status])
  @@index([created_at])
}
```

**필드 설명**:
- `order_id`: 주문 고유 ID (UUID)
- `user_id`: 사용자 ID (FK)
- `store_id`: 매장 ID (FK)
- `pickup_time`: 픽업 예정 시간
- `status`: 주문 상태 (PENDING, RECEIVED, PREPARING, READY, COMPLETED, CANCELLED)
- `total_price`: 총 주문 금액
- `created_at`: 주문일시 ✅
- `updated_at`: 수정일시

**비즈니스 규칙**:
- 주문 생성 시 `status`는 `PENDING` (기본 상태: "주문접수")
- 관리자가 "주문접수" 버튼 클릭 시 `RECEIVED` ("주문접수 완료")
- 관리자가 "제조 시작" 버튼 클릭 시 `PREPARING` ("제조중")
- 관리자가 "제조 완료" 버튼 클릭 시 `READY` ("준비완료")
- 관리자가 "픽업 완료" 버튼 클릭 시 `COMPLETED` ("완료")
- 취소 시 `CANCELLED`

**상태 변경 흐름**:
```
PENDING (주문접수) 
  → RECEIVED (주문접수 완료) 
    → PREPARING (제조중) 
      → READY (준비완료) 
        → COMPLETED (완료)
```

#### 3.2.6 OrderItem (주문 항목) ⭐ 핵심

```prisma
model OrderItem {
  order_item_id String   @id @default(uuid())
  order_id      String
  menu_id       String   // 메뉴 ✅
  quantity      Int      @default(1) // 수량 ✅
  unit_price    Decimal  @db.Decimal(10, 2) // 단가 (메뉴 가격 + 옵션 가격)
  total_price   Decimal  @db.Decimal(10, 2) // 금액 (단가 × 수량) ✅
  created_at    DateTime @default(now())

  order        Order        @relation(fields: [order_id], references: [order_id], onDelete: Cascade)
  menu         Menu         @relation(fields: [menu_id], references: [menu_id], onDelete: Cascade)
  selected_options OrderItemOption[] // 선택된 옵션들 ✅

  @@map("order_items")
  @@index([order_id])
  @@index([menu_id])
}
```

**필드 설명**:
- `order_item_id`: 주문 항목 고유 ID (UUID)
- `order_id`: 주문 ID (FK)
- `menu_id`: 메뉴 ID (FK) ✅
- `quantity`: 수량 ✅
- `unit_price`: 단가 (메뉴 가격 + 선택된 옵션 가격 합계)
- `total_price`: 금액 (단가 × 수량) ✅
- `created_at`: 생성일시

**비즈니스 규칙**:
- `unit_price` = `Menu.price` + `선택된 MenuOption.price` 합계
- `total_price` = `unit_price` × `quantity`
- 주문 생성 시 메뉴의 `stock`이 자동으로 감소

#### 3.2.7 OrderItemOption (주문 항목 옵션) ⭐ 핵심

```prisma
model OrderItemOption {
  order_item_option_id String   @id @default(uuid())
  order_item_id        String
  option_id            String   // 옵션 ✅
  created_at           DateTime @default(now())

  order_item OrderItem   @relation(fields: [order_item_id], references: [order_item_id], onDelete: Cascade)
  option     MenuOption  @relation(fields: [option_id], references: [option_id], onDelete: Cascade)

  @@map("order_item_options")
  @@index([order_item_id])
  @@index([option_id])
  @@unique([order_item_id, option_id]) // 같은 주문 항목에 동일 옵션 중복 방지
}
```

**필드 설명**:
- `order_item_option_id`: 주문 항목 옵션 고유 ID (UUID)
- `order_item_id`: 주문 항목 ID (FK)
- `option_id`: 옵션 ID (FK) ✅
- `created_at`: 생성일시

**비즈니스 규칙**:
- 하나의 주문 항목은 여러 옵션을 가질 수 있음
- 같은 주문 항목에 동일 옵션은 중복 불가

#### 3.2.8 Payment (결제)

```prisma
model Payment {
  payment_id    String        @id @default(uuid())
  order_id      String        @unique
  method        PaymentMethod
  status        PaymentStatus @default(PENDING)
  amount        Decimal       @db.Decimal(10, 2)
  transaction_id String?
  created_at    DateTime      @default(now())
  updated_at    DateTime      @updatedAt

  order Order @relation(fields: [order_id], references: [order_id], onDelete: Cascade)

  @@map("payments")
}
```

### 3.3 Enum 타입

```prisma
enum UserRole {
  CUSTOMER
  ADMIN
}

enum MenuStatus {
  AVAILABLE
  SOLD_OUT
}

enum OrderStatus {
  PENDING
  RECEIVED
  PREPARING
  READY
  COMPLETED
  CANCELLED
}

enum PaymentMethod {
  CARD
  ACCOUNT
  MOBILE
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}
```

### 3.4 관계도

```
User 1──N Order
Store 1──N Menu
Store 1──N Order
Menu 1──N MenuOption
Menu 1──N OrderItem
Order 1──N OrderItem
OrderItem N──M OrderItemOption (through OrderItemOption)
OrderItemOption N──1 MenuOption
Order 1──1 Payment
```

---

## 4. API 명세

### 4.1 API 기본 정보

- **Base URL**: `/api/v1`
- **인증 방식**: JWT Bearer Token
- **Content-Type**: `application/json`
- **응답 형식**: JSON

### 4.2 공통 응답 형식

#### 성공 응답

```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional message"
}
```

#### 에러 응답

```json
{
  "status": "error",
  "message": "Error message",
  "errors": [ // Validation errors (optional)
    {
      "field": "field_name",
      "message": "Error message"
    }
  ]
}
```

### 4.3 인증 API

#### POST `/api/v1/auth/register` - 회원가입

**Request Body**:
```json
{
  "name": "홍길동",
  "phone": "01012345678",
  "email": "hong@example.com", // optional
  "password": "password123"
}
```

**Response** (201):
```json
{
  "status": "success",
  "data": {
    "user_id": "uuid",
    "name": "홍길동",
    "phone": "01012345678",
    "role": "CUSTOMER"
  }
}
```

#### POST `/api/v1/auth/login` - 로그인

**Request Body**:
```json
{
  "phone": "01012345678",
  "password": "password123"
}
```

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "token": "jwt_token",
    "user": {
      "user_id": "uuid",
      "name": "홍길동",
      "role": "CUSTOMER"
    }
  }
}
```

### 4.4 메뉴 API

#### GET `/api/v1/stores/{storeId}/menus` - 메뉴 목록 조회 (고객용)

**설명**: 고객 화면에 메뉴 목록을 표시합니다. **재고수량은 제외**하고 표시합니다.

**Query Parameters**:
- `status`: `AVAILABLE` | `SOLD_OUT` | `ALL` (optional, default: `AVAILABLE`)

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "menus": [
      {
        "menu_id": "uuid",
        "name": "에스프레소",
        "description": "진한 에스프레소",
        "price": "3500.00",
        "image_url": "https://...",
        "status": "AVAILABLE",
        // stock 필드는 제외 (고객 화면에 표시하지 않음)
        "options": [
          {
            "option_id": "uuid",
            "name": "샷 추가",
            "price": "500.00"
          }
        ]
      }
    ]
  }
}
```

**비즈니스 로직**:
- 재고수량(`stock`) 필드는 응답에서 제외
- 상태(`status`)만 표시하여 재고 부족 여부를 간접적으로 알 수 있음
- `status`가 `SOLD_OUT`이면 주문 불가

#### GET `/api/v1/admin/menus` - 메뉴 목록 조회 (관리자용)

**설명**: 관리자 화면에 메뉴 목록을 표시합니다. **재고수량을 포함**하여 표시합니다.

**Query Parameters**:
- `store_id`: 매장 ID (optional)
- `status`: `AVAILABLE` | `SOLD_OUT` | `ALL` (optional)

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "menus": [
      {
        "menu_id": "uuid",
        "name": "에스프레소",
        "description": "진한 에스프레소",
        "price": "3500.00",
        "image_url": "https://...",
        "stock": 10,  // 재고수량 포함
        "status": "AVAILABLE",
        "options": [...]
      }
    ]
  }
}
```

**비즈니스 로직**:
- 재고수량(`stock`) 필드를 포함하여 응답
- 관리자가 재고를 직접 확인하고 관리할 수 있음

#### GET `/api/v1/menus/{menuId}` - 메뉴 상세 조회

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "menu": {
      "menu_id": "uuid",
      "name": "에스프레소",
      "description": "진한 에스프레소",
      "price": "3500.00",
      "image_url": "https://...",
      "stock": 10,
      "status": "AVAILABLE",
      "options": [...]
    }
  }
}
```

### 4.5 옵션 API

#### GET `/api/v1/menus/{menuId}/options` - 메뉴 옵션 조회

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "options": [
      {
        "option_id": "uuid",
        "name": "샷 추가",
        "price": "500.00",
        "is_active": true
      }
    ]
  }
}
```

#### POST `/api/v1/admin/menus/{menuId}/options` - 옵션 생성 (관리자)

**Request Body**:
```json
{
  "name": "샷 추가",
  "price": "500.00"
}
```

**Response** (201):
```json
{
  "status": "success",
  "data": {
    "option": {
      "option_id": "uuid",
      "menu_id": "uuid",
      "name": "샷 추가",
      "price": "500.00",
      "is_active": true
    }
  }
}
```

### 4.6 주문 API

#### POST `/api/v1/orders` - 주문 생성

**Request Body**:
```json
{
  "store_id": "uuid",
  "pickup_time": "2025-12-18T14:00:00Z",
  "items": [
    {
      "menu_id": "uuid",
      "quantity": 2,
      "option_ids": ["option-uuid-1", "option-uuid-2"] // 선택된 옵션 ID 배열
    }
  ]
}
```

**Response** (201):
```json
{
  "status": "success",
  "data": {
    "order": {
      "order_id": "uuid",
      "user_id": "uuid",
      "store_id": "uuid",
      "pickup_time": "2025-12-18T14:00:00Z",
      "status": "PENDING",
      "total_price": "8000.00",
      "created_at": "2025-12-18T12:00:00Z",
      "items": [
        {
          "order_item_id": "uuid",
          "menu": {
            "menu_id": "uuid",
            "name": "에스프레소",
            "price": "3500.00"
          },
          "quantity": 2,
          "options": [
            {
              "option_id": "uuid",
              "name": "샷 추가",
              "price": "500.00"
            }
          ],
          "unit_price": "4000.00",
          "total_price": "8000.00"
        }
      ]
    }
  }
}
```

**비즈니스 로직**:
1. 메뉴 존재 확인
2. 재고 확인 (`stock >= quantity`)
3. 옵션 유효성 확인
4. 가격 계산 (메뉴 가격 + 옵션 가격 합계) × 수량
5. 주문 생성 (트랜잭션)
6. 재고 감소
7. 결제 정보 생성

#### GET `/api/v1/orders/{orderId}` - 주문 상세 조회

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "order": {
      "order_id": "uuid",
      "created_at": "2025-12-18T12:00:00Z",
      "status": "PENDING",
      "total_price": "8000.00",
      "items": [...]
    }
  }
}
```

#### GET `/api/v1/users/me/orders` - 내 주문 목록

**Query Parameters**:
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 항목 수 (default: 10)
- `status`: 주문 상태 필터 (optional)

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "orders": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
}
```

### 4.7 관리자 API

#### GET `/api/v1/admin/orders` - 주문 목록 조회 (관리자)

**설명**: 관리자 화면의 "주문 현황" 섹션에 주문 목록을 표시합니다.

**Query Parameters**:
- `status`: 주문 상태 필터 (`PENDING`, `RECEIVED`, `PREPARING`, `READY`, `COMPLETED`, `CANCELLED`)
- `page`: 페이지 번호 (default: 1)
- `limit`: 페이지당 항목 수 (default: 20)

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "order_id": "uuid",
        "created_at": "2025-12-18T12:00:00Z",  // 주문시간
        "status": "PENDING",  // 기본 상태: "주문접수"
        "total_price": "8000.00",
        "user": {
          "name": "홍길동",
          "phone": "01012345678"
        },
        "items": [
          {
            "order_item_id": "uuid",
            "menu": {
              "menu_id": "uuid",
              "name": "에스프레소"  // 메뉴
            },
            "quantity": 2,  // 수량
            "options": [
              {
                "option_id": "uuid",
                "name": "샷 추가",
                "price": "500.00"
              }
            ],  // 옵션
            "unit_price": "4000.00",
            "total_price": "8000.00"  // 금액
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

**화면 표시 정보**:
- 주문번호 (`order_id`)
- 주문시간 (`created_at`)
- 주문 상태 (`status`)
- 고객 정보
- 주문내용:
  - 메뉴 (`menu.name`)
  - 수량 (`quantity`)
  - 옵션 (`options`)
  - 금액 (`total_price`)
- "주문접수" 버튼 (상태가 `PENDING`일 때만 표시)

#### PATCH `/api/v1/admin/orders/{orderId}/status` - 주문 상태 변경 (관리자)

**설명**: 관리자가 "주문접수" 버튼을 클릭하여 주문 상태를 변경합니다.

**상태 변경 흐름**:
- `PENDING` (주문접수) → `RECEIVED` (주문접수 완료) → `PREPARING` (제조중) → `READY` (준비완료) → `COMPLETED` (완료)

**Request Body**:
```json
{
  "status": "RECEIVED"  // 다음 상태로 변경
}
```

**유효한 상태 전환**:
- `PENDING` → `RECEIVED` (주문접수 클릭)
- `RECEIVED` → `PREPARING` (제조 시작 클릭)
- `PREPARING` → `READY` (제조 완료 클릭)
- `READY` → `COMPLETED` (픽업 완료 클릭)
- 모든 상태 → `CANCELLED` (취소)

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "order": {
      "order_id": "uuid",
      "status": "RECEIVED",
      "updated_at": "2025-12-18T12:05:00Z"
    }
  }
}
```

**에러 케이스**:
- 잘못된 상태 전환 시: `400 INVALID_STATUS_TRANSITION`

#### POST `/api/v1/admin/menus` - 메뉴 생성 (관리자)

**Request Body**:
```json
{
  "store_id": "uuid",
  "name": "에스프레소",
  "description": "진한 에스프레소",
  "price": "3500.00",
  "image_url": "https://...",
  "stock": 10
}
```

#### PATCH `/api/v1/admin/menus/{menuId}` - 메뉴 수정 (관리자)

**Request Body**:
```json
{
  "name": "에스프레소",
  "description": "진한 에스프레소",
  "price": "4000.00",
  "image_url": "https://...",
  "stock": 20
}
```

**비즈니스 로직**:
- `stock`이 0 이하로 변경되면 `status`를 `SOLD_OUT`으로 자동 변경
- `stock`이 1 이상으로 변경되면 `status`를 `AVAILABLE`로 자동 변경

#### GET `/api/v1/admin/dashboard` - 대시보드 데이터 (관리자)

**Response** (200):
```json
{
  "status": "success",
  "data": {
    "stats": {
      "totalOrders": 100,
      "totalRevenue": "500000.00",
      "todayOrders": 10
    },
    "peakHours": [
      { "hour": 9, "count": 20 },
      { "hour": 12, "count": 30 }
    ]
  }
}
```

---

## 5. 비즈니스 로직

### 5.1 주문 생성 로직

1. **입력 검증**
   - 필수 필드 확인
   - 픽업 시간이 미래인지 확인
   - 메뉴 ID 유효성 확인
   - 옵션 ID 유효성 확인

2. **재고 확인**
   - 각 메뉴의 `stock`이 `quantity` 이상인지 확인
   - 재고 부족 시 에러 반환

3. **가격 계산**
   ```
   unit_price = menu.price + sum(selected_options.price)
   total_price = unit_price × quantity
   order_total = sum(all_items.total_price)
   ```

4. **주문 생성 (트랜잭션)**
   - Order 생성
   - OrderItem 생성 (각 항목)
   - OrderItemOption 생성 (각 항목의 선택된 옵션)
   - Menu.stock 감소
   - Payment 생성

5. **에러 처리**
   - 트랜잭션 실패 시 롤백
   - 재고 부족 시 에러 반환
   - 메뉴/옵션 없음 시 에러 반환

### 5.2 재고 관리 로직

1. **주문 시 재고 감소**
   - 주문 생성 시 각 메뉴의 `stock`에서 `quantity`만큼 감소
   - `stock`이 0 이하가 되면 `status`를 `SOLD_OUT`으로 변경

2. **재고 복구**
   - 관리자가 `stock`을 증가시키면
   - `stock > 0`이고 `status`가 `SOLD_OUT`이면 `AVAILABLE`로 변경

3. **주문 취소 시 재고 복구**
   - 주문 취소 시 각 메뉴의 `stock`에 `quantity`만큼 복구
   - `stock`이 0보다 크면 `status`를 `AVAILABLE`로 변경

### 5.3 옵션 관리 로직

1. **옵션 연결**
   - 옵션은 특정 메뉴에만 연결됨 (`MenuOption.menu_id`)
   - 하나의 메뉴는 여러 옵션을 가질 수 있음

2. **옵션 활성화/비활성화**
   - `is_active = false`인 옵션은 주문 시 선택 불가
   - 기존 주문에는 영향 없음

3. **옵션 가격 계산**
   - 주문 항목의 단가는 메뉴 가격 + 선택된 옵션 가격 합계
   - 주문 시 선택된 옵션은 `OrderItemOption`에 저장됨

### 5.4 주문 상태 변경 로직

**사용자 흐름**: 관리자가 "주문접수" 버튼을 클릭하여 상태를 변경합니다.

1. **상태 전환 검증**
   - 유효한 상태 전환인지 확인
   - 잘못된 전환 시 에러 반환

2. **상태 업데이트**
   - `Order.status` 필드 업데이트
   - `Order.updated_at` 자동 업데이트

3. **상태별 동작**
   - `PENDING` → `RECEIVED`: 주문 접수 완료
   - `RECEIVED` → `PREPARING`: 제조 시작
   - `PREPARING` → `READY`: 제조 완료
   - `READY` → `COMPLETED`: 픽업 완료

**기본 상태**: 주문 생성 시 `PENDING` (주문접수)

---

## 6. 인증 및 보안

### 6.1 인증 방식

- **JWT (JSON Web Token)** 기반 인증
- 토큰은 HTTP Header에 포함: `Authorization: Bearer <token>`

### 6.2 보안 요구사항

1. **비밀번호**
   - bcrypt 해시 (salt rounds: 10)
   - 평문 저장 금지

2. **JWT 토큰**
   - 만료 시간: 24시간
   - Refresh Token: 향후 구현 (Phase 2)

3. **CORS**
   - 프론트엔드 도메인만 허용
   - 개발 환경: `http://localhost:3001`

4. **Rate Limiting**
   - API 요청 제한 (향후 구현)
   - 로그인 시도 제한

5. **입력 검증**
   - Zod를 사용한 스키마 검증
   - SQL Injection 방지 (Prisma 사용)

---

## 7. 에러 처리

### 7.1 에러 코드

| HTTP Status | 의미 | 예시 |
|-------------|------|------|
| 200 | 성공 | 조회 성공 |
| 201 | 생성 성공 | 주문 생성 성공 |
| 400 | 잘못된 요청 | 입력 검증 실패 |
| 401 | 인증 실패 | 토큰 없음/만료 |
| 403 | 권한 없음 | 관리자 권한 필요 |
| 404 | 리소스 없음 | 메뉴/주문 없음 |
| 409 | 충돌 | 재고 부족 |
| 500 | 서버 오류 | 내부 오류 |

### 7.2 에러 응답 형식

```json
{
  "status": "error",
  "message": "재고가 부족합니다",
  "code": "INSUFFICIENT_STOCK",
  "errors": [
    {
      "field": "items[0].quantity",
      "message": "재고가 부족합니다"
    }
  ]
}
```

### 7.3 주요 에러 케이스

1. **주문 생성 시**
   - 재고 부족: `409 INSUFFICIENT_STOCK`
   - 메뉴 없음: `404 MENU_NOT_FOUND`
   - 옵션 없음: `404 OPTION_NOT_FOUND`
   - 과거 픽업 시간: `400 INVALID_PICKUP_TIME`

2. **인증 시**
   - 토큰 없음: `401 UNAUTHORIZED`
   - 토큰 만료: `401 TOKEN_EXPIRED`
   - 잘못된 토큰: `401 INVALID_TOKEN`

---

## 8. 성능 요구사항

### 8.1 응답 시간

| API | 목표 응답 시간 |
|-----|---------------|
| 메뉴 목록 조회 | < 200ms |
| 주문 생성 | < 500ms |
| 주문 조회 | < 200ms |
| 대시보드 데이터 | < 1000ms |

### 8.2 데이터베이스 최적화

1. **인덱스**
   - `Menu.store_id`, `Menu.status`
   - `Order.user_id`, `Order.store_id`, `Order.status`, `Order.created_at`
   - `MenuOption.menu_id`
   - `OrderItem.order_id`, `OrderItem.menu_id`

2. **쿼리 최적화**
   - N+1 쿼리 방지 (Prisma `include` 활용)
   - 페이지네이션 적용
   - 필요한 필드만 선택

3. **연결 풀링**
   - Prisma Connection Pool 설정
   - 최대 연결 수 관리

---

## 9. 테스트 전략

### 9.1 테스트 유형

1. **단위 테스트**
   - 비즈니스 로직 함수
   - 유틸리티 함수
   - 검증 함수

2. **통합 테스트**
   - API 엔드포인트
   - 데이터베이스 연동
   - 인증/권한

3. **E2E 테스트** (향후)
   - 전체 주문 플로우
   - 관리자 기능

### 9.2 테스트 커버리지 목표

- 전체 커버리지: 80% 이상
- 핵심 비즈니스 로직: 90% 이상

### 9.3 주요 테스트 케이스

1. **주문 생성**
   - 정상 주문 생성
   - 재고 부족 시 에러
   - 메뉴 없음 시 에러
   - 옵션 없음 시 에러
   - 가격 계산 정확성

2. **재고 관리**
   - 주문 시 재고 감소
   - 재고 0 시 상태 변경
   - 재고 복구 시 상태 변경

3. **인증**
   - 회원가입
   - 로그인
   - 토큰 검증
   - 권한 확인

---

## 10. 배포 및 운영

### 10.1 환경 변수

```env
# 데이터베이스
DATABASE_URL=postgresql://user:password@localhost:5432/orderbean

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# 서버
PORT=3002
NODE_ENV=production

# CORS
CORS_ORIGIN=http://localhost:3001
```

### 10.2 데이터베이스 마이그레이션

```bash
# 마이그레이션 생성
npx prisma migrate dev --name add_menu_options

# 프로덕션 마이그레이션
npx prisma migrate deploy
```

### 10.3 배포 체크리스트

- [ ] 환경 변수 설정
- [ ] 데이터베이스 마이그레이션
- [ ] Prisma Client 생성
- [ ] 테스트 실행
- [ ] 로그 설정
- [ ] 모니터링 설정

---

## 11. 마이그레이션 계획

### 11.1 기존 스키마 변경 사항

현재 Prisma 스키마에 다음 변경이 필요합니다:

1. **Menu 모델 수정**
   - `description` 필드 추가
   - `image_url` 필드 추가
   - `stock` 필드 추가

2. **MenuOption 모델 추가** (새로운 모델)
   - 메뉴 옵션을 별도 테이블로 분리

3. **OrderItem 모델 수정**
   - `unit_price` 필드 추가
   - `total_price` 필드 추가
   - `options` JSON 필드 제거 (OrderItemOption으로 대체)

4. **OrderItemOption 모델 추가** (새로운 모델)
   - 주문 항목과 옵션의 관계 테이블

### 11.2 마이그레이션 순서

1. Menu 모델에 필드 추가 (description, image_url, stock)
2. MenuOption 모델 생성
3. OrderItemOption 모델 생성
4. OrderItem 모델 수정 (options 제거, unit_price, total_price 추가)
5. 기존 데이터 마이그레이션 (JSON options → OrderItemOption)

---

## 12. 참고 자료

### 12.1 기술 문서

- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Express.js 공식 문서](https://expressjs.com/)
- [TypeScript 공식 문서](https://www.typescriptlang.org/)
- [Zod 공식 문서](https://zod.dev/)

### 12.2 프로젝트 문서

- [PRD_Up1.md](./PRD_Up1.md) - 전체 제품 요구사항
- [API.md](./API.md) - API 상세 명세 (향후 작성)
- [ARCHITECTURE.md](./ARCHITECTURE.md) - 아키텍처 문서 (향후 작성)

---

**작성 완료일**: 2025-12-18  
**다음 검토**: 데이터 모델 확정 후

