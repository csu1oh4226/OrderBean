# API 설계 문서: OrderBean

## Document Info

- **작성자**: OrderBean Backend Team
- **작성일**: 2025-12-18
- **최종 수정일**: 2025-12-18
- **버전**: 1.0
- **참조 문서**: 
  - [BACKEND_PRD.md](./BACKEND_PRD.md)
  - [USER_FLOW.md](./USER_FLOW.md)

---

## Table of Contents

1. [API 개요](#1-api-개요)
2. [주문하기 메뉴 목록 조회](#2-주문하기-메뉴-목록-조회)
3. [주문 생성](#3-주문-생성)
4. [주문 조회](#4-주문-조회)
5. [에러 처리](#5-에러-처리)
6. [데이터 흐름](#6-데이터-흐름)

---

## 1. API 개요

### 1.1 기본 정보

- **Base URL**: `/api/v1`
- **인증 방식**: JWT Bearer Token (주문 생성/조회 시)
- **Content-Type**: `application/json`
- **응답 형식**: JSON

### 1.2 공통 응답 형식

#### 성공 응답
```json
{
  "status": "success",
  "data": { ... }
}
```

#### 에러 응답
```json
{
  "status": "error",
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

---

## 2. 주문하기 메뉴 목록 조회

### 2.1 시나리오

**사용자 액션**: 사용자가 '주문하기' 메뉴를 클릭합니다.

**시스템 동작**: 데이터베이스에서 커피 메뉴 목록을 불러와서 브라우저 화면에 표시합니다.

### 2.2 API 명세

#### GET `/api/v1/stores/{storeId}/menus`

**설명**: 특정 매장의 커피 메뉴 목록을 조회합니다.

**인증**: 불필요 (공개 API)

**Path Parameters**:
- `storeId` (string, required): 매장 ID

**Query Parameters**:
- `status` (string, optional): 메뉴 상태 필터
  - `AVAILABLE`: 판매 가능한 메뉴만 (default)
  - `SOLD_OUT`: 품절된 메뉴만
  - `ALL`: 모든 메뉴

**Request Example**:
```http
GET /api/v1/stores/store-001/menus?status=AVAILABLE
Authorization: (불필요)
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "store": {
      "store_id": "store-001",
      "name": "OrderBean 강남점"
    },
    "menus": [
      {
        "menu_id": "menu-001",
        "name": "에스프레소",
        "description": "진한 에스프레소",
        "price": "3500.00",
        "image_url": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04",
        "status": "AVAILABLE",
        "options": [
          {
            "option_id": "opt-001",
            "name": "샷 추가",
            "price": "500.00"
          },
          {
            "option_id": "opt-002",
            "name": "시럽 추가",
            "price": "0.00"
          }
        ]
      },
      {
        "menu_id": "menu-002",
        "name": "아메리카노(ICE)",
        "description": "시원한 아메리카노",
        "price": "4000.00",
        "image_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
        "status": "AVAILABLE",
        "options": [
          {
            "option_id": "opt-001",
            "name": "샷 추가",
            "price": "500.00"
          }
        ]
      }
    ]
  }
}
```

**주의사항**:
- `stock` (재고수량) 필드는 응답에 포함하지 않음 (고객 화면에 표시하지 않음)
- `status` 필드로 재고 부족 여부를 간접적으로 알 수 있음 (`SOLD_OUT` = 품절)

### 2.3 백엔드 구현 로직

```typescript
// Prisma 쿼리
const menus = await prisma.menu.findMany({
  where: {
    store_id: storeId,
    ...(status && status !== 'ALL' ? { status } : {})
  },
  include: {
    menu_options: {
      where: {
        is_active: true
      },
      select: {
        option_id: true,
        name: true,
        price: true
      }
    }
  },
  select: {
    menu_id: true,
    name: true,
    description: true,
    price: true,
    image_url: true,
    status: true,
    // stock 필드는 제외
    menu_options: true
  },
  orderBy: {
    name: 'asc'
  }
})
```

### 2.4 에러 케이스

| HTTP Status | 에러 코드 | 설명 |
|-------------|----------|------|
| 404 | `STORE_NOT_FOUND` | 매장이 존재하지 않음 |
| 500 | `INTERNAL_SERVER_ERROR` | 서버 내부 오류 |

---

## 3. 주문 생성

### 3.1 시나리오

**사용자 액션**: 사용자가 커피를 선택하고 '주문하기' 버튼을 클릭합니다.

**시스템 동작**:
1. 주문 정보를 데이터베이스에 저장
2. 주문 정보에 따라 메뉴 목록의 재고도 수정

### 3.2 API 명세

#### POST `/api/v1/orders`

**설명**: 새로운 주문을 생성하고 재고를 업데이트합니다.

**인증**: 필요 (JWT Token)

**Request Headers**:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "store_id": "store-001",
  "pickup_time": "2025-12-18T14:00:00Z",
  "items": [
    {
      "menu_id": "menu-001",
      "quantity": 2,
      "option_ids": ["opt-001", "opt-002"]
    },
    {
      "menu_id": "menu-002",
      "quantity": 1,
      "option_ids": ["opt-001"]
    }
  ]
}
```

**Request Body 스키마**:
```typescript
{
  store_id: string (UUID, required)
  pickup_time: string (ISO 8601 datetime, required)
  items: Array<{
    menu_id: string (UUID, required)
    quantity: number (integer, positive, required)
    option_ids?: string[] (UUID array, optional)
  }> (required, min 1 item)
}
```

**Response** (201 Created):
```json
{
  "status": "success",
  "data": {
    "order": {
      "order_id": "order-12345",
      "user_id": "user-001",
      "store_id": "store-001",
      "pickup_time": "2025-12-18T14:00:00Z",
      "status": "PENDING",
      "total_price": "12000.00",
      "created_at": "2025-12-18T12:00:00Z",
      "items": [
        {
          "order_item_id": "item-001",
          "menu": {
            "menu_id": "menu-001",
            "name": "에스프레소",
            "price": "3500.00"
          },
          "quantity": 2,
          "options": [
            {
              "option_id": "opt-001",
              "name": "샷 추가",
              "price": "500.00"
            },
            {
              "option_id": "opt-002",
              "name": "시럽 추가",
              "price": "0.00"
            }
          ],
          "unit_price": "4000.00",
          "total_price": "8000.00"
        },
        {
          "order_item_id": "item-002",
          "menu": {
            "menu_id": "menu-002",
            "name": "아메리카노(ICE)",
            "price": "4000.00"
          },
          "quantity": 1,
          "options": [
            {
              "option_id": "opt-001",
              "name": "샷 추가",
              "price": "500.00"
            }
          ],
          "unit_price": "4500.00",
          "total_price": "4500.00"
        }
      ]
    }
  }
}
```

### 3.3 백엔드 구현 로직

#### 3.3.1 전체 프로세스

```typescript
export const createOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. 입력 검증
    const validated = createOrderSchema.parse(req.body)
    const userId = req.user!.userId

    // 2. 픽업 시간 검증
    const pickupTime = new Date(validated.pickup_time)
    const now = new Date()
    if (pickupTime <= now) {
      throw new AppError('Pickup time must be in the future', 400)
    }

    // 3. 매장 존재 확인
    const store = await prisma.store.findUnique({
      where: { store_id: validated.store_id }
    })
    if (!store) {
      throw new AppError('Store not found', 404)
    }

    // 4. 메뉴 및 옵션 확인
    const menuIds = validated.items.map(item => item.menu_id)
    const menus = await prisma.menu.findMany({
      where: {
        menu_id: { in: menuIds },
        store_id: validated.store_id
      },
      include: {
        menu_options: {
          where: { is_active: true }
        }
      }
    })

    if (menus.length !== menuIds.length) {
      throw new AppError('Some menus not found', 404)
    }

    // 5. 재고 확인
    for (const item of validated.items) {
      const menu = menus.find(m => m.menu_id === item.menu_id)
      if (!menu) {
        throw new AppError(`Menu ${item.menu_id} not found`, 404)
      }
      if (menu.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for ${menu.name}. Available: ${menu.stock}, Requested: ${item.quantity}`,
          409
        )
      }
    }

    // 6. 옵션 유효성 확인
    for (const item of validated.items) {
      if (item.option_ids && item.option_ids.length > 0) {
        const menu = menus.find(m => m.menu_id === item.menu_id)!
        const validOptionIds = menu.menu_options.map(opt => opt.option_id)
        const invalidOptions = item.option_ids.filter(
          id => !validOptionIds.includes(id)
        )
        if (invalidOptions.length > 0) {
          throw new AppError(
            `Invalid options for menu ${menu.name}: ${invalidOptions.join(', ')}`,
            400
          )
        }
      }
    }

    // 7. 가격 계산
    let orderTotal = 0
    const itemCalculations = []

    for (const item of validated.items) {
      const menu = menus.find(m => m.menu_id === item.menu_id)!
      
      // 단가 계산: 메뉴 가격 + 옵션 가격 합계
      let unitPrice = Number(menu.price)
      const selectedOptions = []

      if (item.option_ids && item.option_ids.length > 0) {
        for (const optionId of item.option_ids) {
          const option = menu.menu_options.find(opt => opt.option_id === optionId)
          if (option) {
            unitPrice += Number(option.price)
            selectedOptions.push(option)
          }
        }
      }

      // 항목 총 가격
      const itemTotal = unitPrice * item.quantity
      orderTotal += itemTotal

      itemCalculations.push({
        item,
        menu,
        selectedOptions,
        unitPrice,
        itemTotal
      })
    }

    // 8. 주문 생성 (트랜잭션)
    const order = await prisma.$transaction(async (tx) => {
      // 8-1. Order 생성
      const newOrder = await tx.order.create({
        data: {
          user_id: userId,
          store_id: validated.store_id,
          pickup_time: pickupTime,
          status: 'PENDING',
          total_price: orderTotal
        }
      })

      // 8-2. OrderItem 생성 및 재고 수정
      const orderItems = []
      
      for (const calc of itemCalculations) {
        // OrderItem 생성
        const orderItem = await tx.orderItem.create({
          data: {
            order_id: newOrder.order_id,
            menu_id: calc.item.menu_id,
            quantity: calc.item.quantity,
            unit_price: calc.unitPrice,
            total_price: calc.itemTotal
          }
        })

        // OrderItemOption 생성
        if (calc.selectedOptions.length > 0) {
          for (const option of calc.selectedOptions) {
            await tx.orderItemOption.create({
              data: {
                order_item_id: orderItem.order_item_id,
                option_id: option.option_id
              }
            })
          }
        }

        // 재고 수정 (감소)
        const updatedMenu = await tx.menu.update({
          where: { menu_id: calc.item.menu_id },
          data: {
            stock: {
              decrement: calc.item.quantity
            }
          }
        })

        // 재고가 0 이하가 되면 상태를 SOLD_OUT으로 변경
        if (updatedMenu.stock <= 0) {
          await tx.menu.update({
            where: { menu_id: calc.item.menu_id },
            data: { status: 'SOLD_OUT' }
          })
        }

        orderItems.push(orderItem)
      }

      // 8-3. Payment 생성
      await tx.payment.create({
        data: {
          order_id: newOrder.order_id,
          method: 'CARD',
          status: 'PENDING',
          amount: orderTotal
        }
      })

      // 8-4. 주문 정보 반환 (관계 포함)
      return await tx.order.findUnique({
        where: { order_id: newOrder.order_id },
        include: {
          items: {
            include: {
              menu: {
                select: {
                  menu_id: true,
                  name: true,
                  price: true
                }
              },
              selected_options: {
                include: {
                  option: {
                    select: {
                      option_id: true,
                      name: true,
                      price: true
                    }
                  }
                }
              }
            }
          }
        }
      })
    })

    res.status(201).json({
      status: 'success',
      data: { order }
    })
  } catch (error) {
    next(error)
  }
}
```

#### 3.3.2 재고 수정 로직

```typescript
// 주문 항목별로 재고 감소
for (const item of validated.items) {
  // 1. 재고 감소
  await prisma.menu.update({
    where: { menu_id: item.menu_id },
    data: {
      stock: {
        decrement: item.quantity
      }
    }
  })

  // 2. 재고 확인 및 상태 업데이트
  const updatedMenu = await prisma.menu.findUnique({
    where: { menu_id: item.menu_id }
  })

  if (updatedMenu!.stock <= 0) {
    await prisma.menu.update({
      where: { menu_id: item.menu_id },
      data: { status: 'SOLD_OUT' }
    })
  }
}
```

### 3.4 에러 케이스

| HTTP Status | 에러 코드 | 설명 | 예시 |
|-------------|----------|------|------|
| 400 | `INVALID_INPUT` | 입력 검증 실패 | 필수 필드 누락 |
| 400 | `INVALID_PICKUP_TIME` | 픽업 시간이 과거 | `pickup_time`이 현재보다 이전 |
| 404 | `STORE_NOT_FOUND` | 매장이 존재하지 않음 | `store_id`가 유효하지 않음 |
| 404 | `MENU_NOT_FOUND` | 메뉴가 존재하지 않음 | `menu_id`가 유효하지 않음 |
| 400 | `INVALID_OPTION` | 옵션이 유효하지 않음 | 메뉴에 연결되지 않은 옵션 |
| 409 | `INSUFFICIENT_STOCK` | 재고 부족 | 요청 수량 > 현재 재고 |
| 401 | `UNAUTHORIZED` | 인증 실패 | 토큰 없음/만료 |
| 500 | `INTERNAL_SERVER_ERROR` | 서버 내부 오류 | 트랜잭션 실패 |

**에러 응답 예시**:
```json
{
  "status": "error",
  "message": "재고가 부족합니다",
  "code": "INSUFFICIENT_STOCK",
  "details": {
    "menu_id": "menu-001",
    "menu_name": "에스프레소",
    "available_stock": 5,
    "requested_quantity": 10
  }
}
```

---

## 4. 주문 조회

### 4.1 시나리오

**사용자 액션**: 주문 ID를 전달합니다.

**시스템 동작**: 해당 주문 정보를 보여줍니다.

### 4.2 API 명세

#### GET `/api/v1/orders/{orderId}`

**설명**: 주문 ID로 주문 정보를 조회합니다.

**인증**: 필요 (JWT Token)

**Path Parameters**:
- `orderId` (string, required): 주문 ID

**Request Headers**:
```
Authorization: Bearer <jwt_token>
```

**Request Example**:
```http
GET /api/v1/orders/order-12345
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response** (200 OK):
```json
{
  "status": "success",
  "data": {
    "order": {
      "order_id": "order-12345",
      "user_id": "user-001",
      "store_id": "store-001",
      "store": {
        "store_id": "store-001",
        "name": "OrderBean 강남점"
      },
      "pickup_time": "2025-12-18T14:00:00Z",
      "status": "PENDING",
      "total_price": "12000.00",
      "created_at": "2025-12-18T12:00:00Z",
      "items": [
        {
          "order_item_id": "item-001",
          "menu": {
            "menu_id": "menu-001",
            "name": "에스프레소",
            "description": "진한 에스프레소",
            "price": "3500.00",
            "image_url": "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04"
          },
          "quantity": 2,
          "options": [
            {
              "option_id": "opt-001",
              "name": "샷 추가",
              "price": "500.00"
            },
            {
              "option_id": "opt-002",
              "name": "시럽 추가",
              "price": "0.00"
            }
          ],
          "unit_price": "4000.00",
          "total_price": "8000.00"
        },
        {
          "order_item_id": "item-002",
          "menu": {
            "menu_id": "menu-002",
            "name": "아메리카노(ICE)",
            "description": "시원한 아메리카노",
            "price": "4000.00",
            "image_url": "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
          },
          "quantity": 1,
          "options": [
            {
              "option_id": "opt-001",
              "name": "샷 추가",
              "price": "500.00"
            }
          ],
          "unit_price": "4500.00",
          "total_price": "4500.00"
        }
      ],
      "payment": {
        "payment_id": "payment-001",
        "method": "CARD",
        "status": "PENDING",
        "amount": "12000.00"
      }
    }
  }
}
```

### 4.3 백엔드 구현 로직

```typescript
export const getOrder = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { orderId } = req.params
    const userId = req.user!.userId
    const userRole = req.user!.role

    // 주문 조회
    const order = await prisma.order.findUnique({
      where: { order_id: orderId },
      include: {
        store: {
          select: {
            store_id: true,
            name: true
          }
        },
        items: {
          include: {
            menu: {
              select: {
                menu_id: true,
                name: true,
                description: true,
                price: true,
                image_url: true
              }
            },
            selected_options: {
              include: {
                option: {
                  select: {
                    option_id: true,
                    name: true,
                    price: true
                  }
                }
              }
            }
          }
        },
        payment: {
          select: {
            payment_id: true,
            method: true,
            status: true,
            amount: true
          }
        }
      }
    })

    if (!order) {
      throw new AppError('Order not found', 404)
    }

    // 권한 확인: 본인 주문이거나 관리자만 조회 가능
    if (order.user_id !== userId && userRole !== 'ADMIN') {
      throw new AppError('Access denied', 403)
    }

    res.json({
      status: 'success',
      data: { order }
    })
  } catch (error) {
    next(error)
  }
}
```

### 4.4 에러 케이스

| HTTP Status | 에러 코드 | 설명 |
|-------------|----------|------|
| 404 | `ORDER_NOT_FOUND` | 주문이 존재하지 않음 |
| 401 | `UNAUTHORIZED` | 인증 실패 |
| 403 | `ACCESS_DENIED` | 본인 주문이 아니거나 관리자 권한 없음 |
| 500 | `INTERNAL_SERVER_ERROR` | 서버 내부 오류 |

---

## 5. 에러 처리

### 5.1 공통 에러 응답 형식

```json
{
  "status": "error",
  "message": "Error message",
  "code": "ERROR_CODE",
  "details": {
    // 추가 정보 (선택적)
  }
}
```

### 5.2 주요 에러 코드

| 에러 코드 | HTTP Status | 설명 |
|-----------|-------------|------|
| `INVALID_INPUT` | 400 | 입력 검증 실패 |
| `INVALID_PICKUP_TIME` | 400 | 픽업 시간이 과거 |
| `STORE_NOT_FOUND` | 404 | 매장 없음 |
| `MENU_NOT_FOUND` | 404 | 메뉴 없음 |
| `INVALID_OPTION` | 400 | 유효하지 않은 옵션 |
| `INSUFFICIENT_STOCK` | 409 | 재고 부족 |
| `ORDER_NOT_FOUND` | 404 | 주문 없음 |
| `UNAUTHORIZED` | 401 | 인증 실패 |
| `ACCESS_DENIED` | 403 | 권한 없음 |
| `INTERNAL_SERVER_ERROR` | 500 | 서버 오류 |

---

## 6. 데이터 흐름

### 6.1 전체 흐름 다이어그램

```
┌─────────────┐
│   사용자     │
└──────┬──────┘
       │
       │ 1. '주문하기' 메뉴 클릭
       ▼
┌─────────────┐
│  프론트엔드  │
└──────┬──────┘
       │
       │ GET /api/v1/stores/{id}/menus
       ▼
┌─────────────┐
│   백엔드     │
└──────┬──────┘
       │
       │ SELECT * FROM menus WHERE store_id = ?
       ▼
┌─────────────┐
│  데이터베이스 │
│    Menus    │
└──────┬──────┘
       │
       │ 메뉴 목록 반환
       ▼
┌─────────────┐
│  프론트엔드  │
│  메뉴 표시   │
└──────┬──────┘
       │
       │ 2. 커피 선택 및 주문하기 클릭
       ▼
┌─────────────┐
│  프론트엔드  │
│  장바구니    │
└──────┬──────┘
       │
       │ POST /api/v1/orders
       │ { store_id, pickup_time, items }
       ▼
┌─────────────┐
│   백엔드     │
└──────┬──────┘
       │
       │ 트랜잭션 시작
       │ ├─ INSERT INTO orders
       │ ├─ INSERT INTO order_items
       │ ├─ INSERT INTO order_item_options
       │ └─ UPDATE menus SET stock = stock - quantity
       ▼
┌─────────────┐
│  데이터베이스 │
│ Orders,     │
│ OrderItems, │
│ Menus       │
└──────┬──────┘
       │
       │ 주문 정보 반환
       ▼
┌─────────────┐
│  프론트엔드  │
│  주문 완료   │
└─────────────┘

       │ 3. 주문 ID로 조회
       │
       │ GET /api/v1/orders/{orderId}
       ▼
┌─────────────┐
│   백엔드     │
└──────┬──────┘
       │
       │ SELECT * FROM orders WHERE order_id = ?
       │ JOIN order_items, menus, options
       ▼
┌─────────────┐
│  데이터베이스 │
│    Orders   │
└──────┬──────┘
       │
       │ 주문 정보 반환
       ▼
┌─────────────┐
│  프론트엔드  │
│  주문 상세   │
└─────────────┘
```

### 6.2 데이터베이스 변경 사항

#### 주문 생성 시

**Orders 테이블**:
```sql
INSERT INTO orders (order_id, user_id, store_id, pickup_time, status, total_price, created_at)
VALUES ('order-12345', 'user-001', 'store-001', '2025-12-18T14:00:00Z', 'PENDING', 12000.00, NOW())
```

**OrderItems 테이블**:
```sql
INSERT INTO order_items (order_item_id, order_id, menu_id, quantity, unit_price, total_price)
VALUES 
  ('item-001', 'order-12345', 'menu-001', 2, 4000.00, 8000.00),
  ('item-002', 'order-12345', 'menu-002', 1, 4500.00, 4500.00)
```

**OrderItemOptions 테이블**:
```sql
INSERT INTO order_item_options (order_item_option_id, order_item_id, option_id)
VALUES 
  ('opt-item-001', 'item-001', 'opt-001'),
  ('opt-item-002', 'item-001', 'opt-002'),
  ('opt-item-003', 'item-002', 'opt-001')
```

**Menus 테이블 (재고 수정)**:
```sql
UPDATE menus 
SET stock = stock - 2 
WHERE menu_id = 'menu-001'

UPDATE menus 
SET stock = stock - 1 
WHERE menu_id = 'menu-002'

-- 재고가 0 이하가 되면 상태 변경
UPDATE menus 
SET status = 'SOLD_OUT' 
WHERE menu_id = 'menu-001' AND stock <= 0
```

---

## 7. 검증 스키마

### 7.1 주문 생성 검증 스키마 (Zod)

```typescript
import { z } from 'zod'

export const createOrderSchema = z.object({
  store_id: z.string().uuid('Invalid store ID'),
  pickup_time: z.string().datetime('Invalid pickup time format'),
  items: z.array(
    z.object({
      menu_id: z.string().uuid('Invalid menu ID'),
      quantity: z.number().int('Quantity must be an integer').positive('Quantity must be positive'),
      option_ids: z.array(z.string().uuid('Invalid option ID')).optional()
    })
  ).min(1, 'At least one item is required')
})
```

### 7.2 주문 조회 검증

```typescript
// Path parameter 검증
const orderIdSchema = z.string().uuid('Invalid order ID')
```

---

## 8. 테스트 케이스

### 8.1 메뉴 목록 조회 테스트

```typescript
describe('GET /api/v1/stores/{storeId}/menus', () => {
  it('should return menu list without stock', async () => {
    const response = await request(app)
      .get('/api/v1/stores/store-001/menus')
      .expect(200)

    expect(response.body.status).toBe('success')
    expect(response.body.data.menus).toBeInstanceOf(Array)
    expect(response.body.data.menus[0]).not.toHaveProperty('stock')
    expect(response.body.data.menus[0]).toHaveProperty('status')
  })

  it('should return 404 if store not found', async () => {
    await request(app)
      .get('/api/v1/stores/invalid-store/menus')
      .expect(404)
  })
})
```

### 8.2 주문 생성 테스트

```typescript
describe('POST /api/v1/orders', () => {
  it('should create order and update stock', async () => {
    const initialStock = await getMenuStock('menu-001')

    const response = await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        store_id: 'store-001',
        pickup_time: '2025-12-18T14:00:00Z',
        items: [
          {
            menu_id: 'menu-001',
            quantity: 2,
            option_ids: ['opt-001']
          }
        ]
      })
      .expect(201)

    expect(response.body.status).toBe('success')
    expect(response.body.data.order.order_id).toBeDefined()

    // 재고 확인
    const updatedStock = await getMenuStock('menu-001')
    expect(updatedStock).toBe(initialStock - 2)
  })

  it('should return 409 if insufficient stock', async () => {
    await request(app)
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({
        store_id: 'store-001',
        pickup_time: '2025-12-18T14:00:00Z',
        items: [
          {
            menu_id: 'menu-001',
            quantity: 1000, // 재고보다 많은 수량
            option_ids: []
          }
        ]
      })
      .expect(409)
  })
})
```

### 8.3 주문 조회 테스트

```typescript
describe('GET /api/v1/orders/{orderId}', () => {
  it('should return order details', async () => {
    const response = await request(app)
      .get('/api/v1/orders/order-12345')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body.status).toBe('success')
    expect(response.body.data.order.order_id).toBe('order-12345')
    expect(response.body.data.order.items).toBeInstanceOf(Array)
    expect(response.body.data.order.items[0]).toHaveProperty('menu')
    expect(response.body.data.order.items[0]).toHaveProperty('quantity')
    expect(response.body.data.order.items[0]).toHaveProperty('options')
    expect(response.body.data.order.items[0]).toHaveProperty('total_price')
  })

  it('should return 404 if order not found', async () => {
    await request(app)
      .get('/api/v1/orders/invalid-order')
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })
})
```

---

## 9. 성능 고려사항

### 9.1 최적화 전략

1. **인덱스**
   - `menus.store_id`, `menus.status`
   - `orders.user_id`, `orders.store_id`, `orders.created_at`
   - `order_items.order_id`, `order_items.menu_id`

2. **쿼리 최적화**
   - N+1 쿼리 방지 (Prisma `include` 활용)
   - 필요한 필드만 선택 (`select` 사용)

3. **트랜잭션**
   - 주문 생성 시 모든 작업을 하나의 트랜잭션으로 처리
   - 롤백 시 데이터 일관성 보장

---

## 10. 보안 고려사항

### 10.1 인증 및 권한

- 주문 생성/조회: JWT 토큰 필수
- 주문 조회: 본인 주문이거나 관리자만 가능

### 10.2 입력 검증

- 모든 입력은 Zod 스키마로 검증
- UUID 형식 검증
- 수량은 양수만 허용

### 10.3 SQL Injection 방지

- Prisma ORM 사용으로 자동 방지
- 파라미터화된 쿼리 사용

---

## 11. 참고 자료

- [BACKEND_PRD.md](./BACKEND_PRD.md) - 백엔드 전체 명세
- [USER_FLOW.md](./USER_FLOW.md) - 사용자 흐름 상세
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [Express.js 공식 문서](https://expressjs.com/)

---

**작성 완료일**: 2025-12-18

