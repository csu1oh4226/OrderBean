# 사용자 흐름 및 데이터 스키마 가이드

## Document Info

- **작성자**: OrderBean Team
- **작성일**: 2025-12-18
- **버전**: 1.0
- **참조 문서**: [BACKEND_PRD.md](./BACKEND_PRD.md)

---

## 개요

이 문서는 OrderBean 애플리케이션의 사용자 흐름과 데이터 스키마의 상호작용을 설명합니다. 각 단계에서 어떤 데이터가 어떻게 처리되는지 상세히 기술합니다.

---

## 사용자 흐름

### 흐름 1: 메뉴 조회 및 표시

#### 1.1 고객 화면 - 메뉴 목록 표시

**시나리오**: 사용자가 주문 화면에 접속하여 메뉴 목록을 확인합니다.

**API 호출**:
```
GET /api/v1/stores/{storeId}/menus
```

**요청**:
- `storeId`: 매장 ID

**응답** (재고수량 제외):
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
        "status": "AVAILABLE",  // 재고수량은 제외, 상태만 표시
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

**데이터베이스 쿼리**:
```prisma
// Menus 테이블에서 조회
prisma.menu.findMany({
  where: {
    store_id: storeId,
    status: 'AVAILABLE'
  },
  include: {
    menu_options: {
      where: {
        is_active: true
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
    // stock은 제외 (고객 화면에 표시하지 않음)
    menu_options: {
      select: {
        option_id: true,
        name: true,
        price: true
      }
    }
  }
})
```

**화면 표시**:
- 메뉴 이름
- 설명
- 가격
- 이미지
- 옵션 목록
- **재고수량은 표시하지 않음**

#### 1.2 관리자 화면 - 메뉴 목록 표시 (재고수량 포함)

**시나리오**: 관리자가 메뉴 관리 화면에서 메뉴 목록과 재고수량을 확인합니다.

**API 호출**:
```
GET /api/v1/admin/menus?store_id={storeId}
```

**요청**:
- `storeId`: 매장 ID (선택)

**응답** (재고수량 포함):
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

**데이터베이스 쿼리**:
```prisma
// Menus 테이블에서 조회 (stock 포함)
prisma.menu.findMany({
  where: {
    store_id: storeId
  },
  include: {
    menu_options: true
  }
  // stock 필드 포함
})
```

**화면 표시**:
- 메뉴 이름
- 설명
- 가격
- 이미지
- **재고수량** ✅
- 상태
- 옵션 목록

---

### 흐름 2: 메뉴 선택 및 장바구니 추가

#### 2.1 메뉴 선택

**시나리오**: 사용자가 메뉴를 선택하고 옵션을 설정한 후 장바구니에 추가합니다.

**사용자 액션**:
1. 메뉴 카드에서 메뉴 선택
2. 옵션 선택 (예: "샷 추가", "시럽 추가")
3. 수량 선택
4. "담기" 버튼 클릭

**프론트엔드 처리**:
```typescript
// 장바구니에 추가 (로컬 상태)
const cartItem = {
  menu_id: "uuid",
  menu_name: "에스프레소",
  base_price: 3500,
  quantity: 2,
  options: {
    shot: true,  // 옵션 ID 대신 옵션 이름으로 관리
    syrup: false
  }
}
addToCart(cartItem)
```

**데이터 저장 위치**:
- **프론트엔드**: Zustand store (로컬 상태)
- **localStorage**: 브라우저 로컬 스토리지 (선택적)
- **백엔드**: 아직 저장하지 않음 (주문하기 전까지)

**장바구니 표시**:
```json
{
  "items": [
    {
      "menu_id": "uuid",
      "menu_name": "에스프레소",
      "base_price": 3500,
      "quantity": 2,
      "options": {
        "shot": true,
        "syrup": false
      },
      "unit_price": 4000,  // base_price + 옵션 가격
      "total_price": 8000  // unit_price × quantity
    }
  ],
  "total": 8000
}
```

---

### 흐름 3: 주문하기 - Orders에 저장

#### 3.1 주문하기 버튼 클릭

**시나리오**: 사용자가 장바구니에서 "주문하기" 버튼을 클릭합니다.

**API 호출**:
```
POST /api/v1/orders
```

**요청 Body**:
```json
{
  "store_id": "uuid",
  "pickup_time": "2025-12-18T14:00:00Z",
  "items": [
    {
      "menu_id": "uuid",
      "quantity": 2,
      "option_ids": ["option-uuid-1", "option-uuid-2"]  // 선택된 옵션 ID 배열
    }
  ]
}
```

#### 3.2 백엔드 처리 로직

**1단계: 입력 검증**
```typescript
// Zod 스키마 검증
const orderSchema = z.object({
  store_id: z.string().uuid(),
  pickup_time: z.string().datetime(),
  items: z.array(z.object({
    menu_id: z.string().uuid(),
    quantity: z.number().int().positive(),
    option_ids: z.array(z.string().uuid()).optional()
  }))
})
```

**2단계: 메뉴 및 옵션 확인**
```typescript
// 메뉴 존재 확인
const menus = await prisma.menu.findMany({
  where: {
    menu_id: { in: menuIds },
    store_id: storeId
  },
  include: {
    menu_options: true
  }
})

// 재고 확인
for (const item of items) {
  const menu = menus.find(m => m.menu_id === item.menu_id)
  if (menu.stock < item.quantity) {
    throw new Error('재고가 부족합니다')
  }
}

// 옵션 유효성 확인
for (const item of items) {
  if (item.option_ids) {
    const menu = menus.find(m => m.menu_id === item.menu_id)
    const validOptions = menu.menu_options
      .filter(opt => opt.is_active)
      .map(opt => opt.option_id)
    
    for (const optionId of item.option_ids) {
      if (!validOptions.includes(optionId)) {
        throw new Error('유효하지 않은 옵션입니다')
      }
    }
  }
}
```

**3단계: 가격 계산**
```typescript
let orderTotal = 0

for (const item of items) {
  const menu = menus.find(m => m.menu_id === item.menu_id)
  
  // 단가 계산: 메뉴 가격 + 옵션 가격 합계
  let unitPrice = Number(menu.price)
  
  if (item.option_ids && item.option_ids.length > 0) {
    const selectedOptions = menu.menu_options.filter(
      opt => item.option_ids.includes(opt.option_id)
    )
    const optionsPrice = selectedOptions.reduce(
      (sum, opt) => sum + Number(opt.price),
      0
    )
    unitPrice += optionsPrice
  }
  
  // 항목 총 가격: 단가 × 수량
  const itemTotal = unitPrice * item.quantity
  orderTotal += itemTotal
}
```

**4단계: 주문 생성 (트랜잭션)**
```typescript
const order = await prisma.$transaction(async (tx) => {
  // 1. Order 생성 (주문시간 = created_at)
  const newOrder = await tx.order.create({
    data: {
      user_id: userId,
      store_id: storeId,
      pickup_time: new Date(pickupTime),
      status: 'PENDING',  // 기본 상태
      total_price: orderTotal,
      // created_at은 자동으로 현재 시간으로 설정됨
    }
  })
  
  // 2. OrderItem 생성 (주문내용: 메뉴, 수량, 옵션, 금액)
  for (const item of items) {
    const menu = menus.find(m => m.menu_id === item.menu_id)
    
    // 단가 계산
    let unitPrice = Number(menu.price)
    if (item.option_ids && item.option_ids.length > 0) {
      const selectedOptions = menu.menu_options.filter(
        opt => item.option_ids.includes(opt.option_id)
      )
      unitPrice += selectedOptions.reduce(
        (sum, opt) => sum + Number(opt.price),
        0
      )
    }
    
    const totalPrice = unitPrice * item.quantity
    
    // OrderItem 생성
    const orderItem = await tx.orderItem.create({
      data: {
        order_id: newOrder.order_id,
        menu_id: item.menu_id,
        quantity: item.quantity,  // 수량
        unit_price: unitPrice,
        total_price: totalPrice,  // 금액
      }
    })
    
    // 3. OrderItemOption 생성 (옵션)
    if (item.option_ids && item.option_ids.length > 0) {
      for (const optionId of item.option_ids) {
        await tx.orderItemOption.create({
          data: {
            order_item_id: orderItem.order_item_id,
            option_id: optionId,  // 옵션
          }
        })
      }
    }
    
    // 4. 재고 감소
    await tx.menu.update({
      where: { menu_id: item.menu_id },
      data: {
        stock: {
          decrement: item.quantity
        }
      }
    })
    
    // 5. 재고가 0 이하가 되면 상태 변경
    const updatedMenu = await tx.menu.findUnique({
      where: { menu_id: item.menu_id }
    })
    
    if (updatedMenu.stock <= 0) {
      await tx.menu.update({
        where: { menu_id: item.menu_id },
        data: { status: 'SOLD_OUT' }
      })
    }
  }
  
  // 6. Payment 생성
  await tx.payment.create({
    data: {
      order_id: newOrder.order_id,
      method: 'CARD',
      status: 'PENDING',
      amount: orderTotal
    }
  })
  
  return newOrder
})
```

**5단계: 응답 반환**
```json
{
  "status": "success",
  "data": {
    "order": {
      "order_id": "uuid",
      "created_at": "2025-12-18T12:00:00Z",  // 주문시간
      "status": "PENDING",
      "total_price": "8000.00",
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
  }
}
```

**데이터베이스 저장 결과**:

**Orders 테이블**:
```
order_id: uuid
user_id: uuid
store_id: uuid
pickup_time: 2025-12-18T14:00:00Z
status: PENDING
total_price: 8000.00
created_at: 2025-12-18T12:00:00Z  ← 주문시간
```

**OrderItems 테이블** (주문내용):
```
order_item_id: uuid
order_id: uuid
menu_id: uuid  ← 메뉴
quantity: 2  ← 수량
unit_price: 4000.00
total_price: 8000.00  ← 금액
```

**OrderItemOptions 테이블**:
```
order_item_option_id: uuid
order_item_id: uuid
option_id: uuid  ← 옵션
```

---

### 흐름 4: 관리자 화면 - 주문 현황 표시

#### 4.1 주문 목록 조회

**시나리오**: 관리자가 관리자 화면의 "주문 현황" 섹션에서 주문 목록을 확인합니다.

**API 호출**:
```
GET /api/v1/admin/orders?status=PENDING
```

**요청**:
- `status`: 주문 상태 필터 (선택)
- `page`: 페이지 번호 (선택)
- `limit`: 페이지당 항목 수 (선택)

**응답**:
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "order_id": "uuid",
        "created_at": "2025-12-18T12:00:00Z",  // 주문시간
        "status": "PENDING",  // 기본 상태: '주문접수' (PENDING)
        "total_price": "8000.00",
        "user": {
          "name": "홍길동",
          "phone": "01012345678"
        },
        "items": [
          {
            "menu": {
              "name": "에스프레소"  // 메뉴
            },
            "quantity": 2,  // 수량
            "options": [
              {
                "name": "샷 추가"
              }
            ],  // 옵션
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

**데이터베이스 쿼리**:
```prisma
prisma.order.findMany({
  where: {
    status: statusFilter || undefined
  },
  include: {
    user: {
      select: {
        name: true,
        phone: true
      }
    },
    items: {
      include: {
        menu: {
          select: {
            name: true
          }
        },
        selected_options: {
          include: {
            option: {
              select: {
                name: true
              }
            }
          }
        }
      }
    }
  },
  orderBy: {
    created_at: 'desc'  // 최신 주문 먼저
  },
  skip: (page - 1) * limit,
  take: limit
})
```

**화면 표시**:
- 주문번호
- 주문시간 (`created_at`)
- 고객 정보
- 주문내용:
  - 메뉴 이름
  - 수량
  - 옵션
  - 금액
- 주문 상태 (기본: "주문접수" = PENDING)
- "주문접수" 버튼 (상태가 PENDING일 때만 표시)

#### 4.2 주문 상태 변경

**시나리오**: 관리자가 "주문접수" 버튼을 클릭하여 주문 상태를 변경합니다.

**상태 흐름**:
```
PENDING (주문접수) 
  → RECEIVED (주문접수 완료) 
    → PREPARING (제조중) 
      → READY (준비완료) 
        → COMPLETED (완료)
```

**API 호출**:
```
PATCH /api/v1/admin/orders/{orderId}/status
```

**요청 Body**:
```json
{
  "status": "RECEIVED"  // "주문접수" 클릭 시
}
```

**백엔드 처리**:
```typescript
// 주문 상태 변경
const updatedOrder = await prisma.order.update({
  where: { order_id: orderId },
  data: { status: newStatus },
  include: {
    items: {
      include: {
        menu: true,
        selected_options: {
          include: {
            option: true
          }
        }
      }
    }
  }
})
```

**상태 변경 시나리오**:

1. **"주문접수" 클릭** (PENDING → RECEIVED)
   ```
   상태: "주문접수" → "주문접수 완료"
   버튼: "주문접수" → "제조 시작"
   ```

2. **"제조 시작" 클릭** (RECEIVED → PREPARING)
   ```
   상태: "주문접수 완료" → "제조중"
   버튼: "제조 시작" → "제조 완료"
   ```

3. **"제조 완료" 클릭** (PREPARING → READY)
   ```
   상태: "제조중" → "준비완료"
   버튼: "제조 완료" → "픽업 완료"
   ```

4. **"픽업 완료" 클릭** (READY → COMPLETED)
   ```
   상태: "준비완료" → "완료"
   버튼: 숨김
   ```

**응답**:
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

**화면 업데이트**:
- 주문 상태가 실시간으로 업데이트됨
- 버튼 텍스트가 상태에 따라 변경됨
- 주문 목록이 자동으로 새로고침됨 (또는 WebSocket으로 실시간 업데이트)

---

## 데이터 흐름 다이어그램

```
┌─────────────┐
│   Menus     │
│  (재고수량)  │
└──────┬──────┘
       │
       │ GET /api/v1/stores/{id}/menus
       │ (재고수량 제외)
       ▼
┌─────────────┐
│  고객 화면   │
│  메뉴 표시   │
└──────┬──────┘
       │
       │ 사용자 선택
       │ (메뉴 + 옵션 + 수량)
       ▼
┌─────────────┐
│  장바구니    │
│ (로컬 상태)  │
└──────┬──────┘
       │
       │ POST /api/v1/orders
       │ (주문하기 클릭)
       ▼
┌─────────────┐
│   Orders    │
│ (주문시간)   │
└──────┬──────┘
       │
       │ ┌──────────────┐
       ├─│ OrderItems   │ (메뉴, 수량, 금액)
       │ └──────────────┘
       │
       │ ┌──────────────┐
       └─│OrderItemOpts │ (옵션)
         └──────────────┘
       │
       │ GET /api/v1/admin/orders
       ▼
┌─────────────┐
│ 관리자 화면  │
│ 주문 현황    │
└──────┬──────┘
       │
       │ PATCH /api/v1/admin/orders/{id}/status
       │ (주문접수 → 제조중 → 완료)
       ▼
┌─────────────┐
│   Orders    │
│ (상태 업데이트)│
└─────────────┘
```

---

## 데이터베이스 스키마 요약

### Orders 테이블
- `order_id`: 주문 고유 ID
- `created_at`: **주문시간** ✅
- `status`: 주문 상태 (기본: PENDING = "주문접수")
- `total_price`: 총 주문 금액

### OrderItems 테이블 (주문내용)
- `menu_id`: **메뉴** ✅
- `quantity`: **수량** ✅
- `total_price`: **금액** ✅

### OrderItemOptions 테이블
- `option_id`: **옵션** ✅

### Menus 테이블
- `stock`: **재고수량** (관리자 화면에만 표시) ✅

---

## API 엔드포인트 요약

| 엔드포인트 | 메서드 | 설명 | 재고수량 포함 |
|-----------|--------|------|--------------|
| `/api/v1/stores/{id}/menus` | GET | 고객용 메뉴 목록 | ❌ |
| `/api/v1/admin/menus` | GET | 관리자용 메뉴 목록 | ✅ |
| `/api/v1/orders` | POST | 주문 생성 | - |
| `/api/v1/admin/orders` | GET | 관리자용 주문 목록 | - |
| `/api/v1/admin/orders/{id}/status` | PATCH | 주문 상태 변경 | - |

---

## 상태 머신

```
[PENDING] ──주문접수──> [RECEIVED] ──제조시작──> [PREPARING] 
                                                         │
                                                         │ 제조완료
                                                         ▼
[COMPLETED] <──픽업완료── [READY] <──제조완료────────────┘
```

**기본 상태**: `PENDING` (주문접수)

---

## 참고 사항

1. **재고수량 표시**
   - 고객 화면: 재고수량 표시하지 않음
   - 관리자 화면: 재고수량 표시

2. **주문 상태**
   - 기본 상태: `PENDING` (주문접수)
   - 상태 변경: 관리자가 수동으로 변경

3. **주문내용 저장**
   - 메뉴: `OrderItem.menu_id`
   - 수량: `OrderItem.quantity`
   - 옵션: `OrderItemOption.option_id`
   - 금액: `OrderItem.total_price`

4. **주문시간**
   - `Order.created_at`에 자동 저장
   - 주문 생성 시점의 시간

---

**작성 완료일**: 2025-12-18

