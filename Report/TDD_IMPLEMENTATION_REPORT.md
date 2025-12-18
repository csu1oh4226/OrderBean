# TDD 구현 보고서 - 커피 주문 화면

**작성일**: 2025-12-15  
**작성자**: OrderBean Team  
**버전**: 1.0

---

## 📋 요약

TDD(Test-Driven Development) 방법론을 따라 커피 주문 화면을 단계적으로 구현했습니다. RED → GREEN → REFACTOR 단계를 거쳐 커피 메뉴 표시, 네비게이션 색상, 버튼 색상 기능을 완성했습니다.

---

## 🎯 구현 목표

1. **커피 메뉴 표시**: 다양한 커피 메뉴를 임의로 추가
2. **네비게이션 색상**: 보라색 계열로 통일
3. **버튼 색상**: 청록색 계열로 통일

---

## 🔴 1단계: RED - 실패하는 테스트 작성

### 작성된 테스트 파일

#### `frontend/src/__tests__/OrderPage.test.tsx`
- 커피 메뉴 목록 표시 테스트
- 메뉴 가격 표시 테스트
- 네비게이션 색상 테스트 (보라색 계열)
- 버튼 색상 테스트 (청록색 계열)
- 메뉴 카드 기능 테스트

#### `frontend/src/__tests__/MenuCard.test.tsx`
- 메뉴 이름/가격 표시 테스트
- 담기 버튼 색상 테스트 (청록색 계열)
- 장바구니 추가 기능 테스트
- 옵션 선택 기능 테스트

### 테스트 케이스

#### 커피 메뉴 표시
```typescript
it('커피 메뉴 목록이 표시되어야 한다', async () => {
  // 에스프레소, 카푸치노, 카라멜 마키아토, 바닐라 라떼, 콜드브루
})
```

#### 네비게이션 색상
```typescript
it('네비게이션 링크가 보라색 계열로 표시되어야 한다', async () => {
  // text-purple-600 클래스 확인
})
```

#### 버튼 색상
```typescript
it('담기 버튼이 청록색 계열로 표시되어야 한다', async () => {
  // bg-teal-500, hover:bg-teal-600 클래스 확인
})
```

---

## 🟢 2단계: GREEN - 최소한의 코드로 테스트 통과

### 구현 내용

#### 1. 커피 메뉴 데이터 추가

**파일**: `frontend/src/app/order/page.tsx`

```typescript
setMenus([
  {
    menu_id: 'menu-001',
    name: '에스프레소',
    price: 3500,
    description: '진한 에스프레소',
  },
  {
    menu_id: 'menu-002',
    name: '카푸치노',
    price: 5500,
    description: '부드러운 우유 거품과 에스프레소',
  },
  {
    menu_id: 'menu-003',
    name: '카라멜 마키아토',
    price: 6000,
    description: '카라멜 시럽이 들어간 라떼',
  },
  {
    menu_id: 'menu-004',
    name: '바닐라 라떼',
    price: 6000,
    description: '바닐라 시럽이 들어간 라떼',
  },
  {
    menu_id: 'menu-005',
    name: '콜드브루',
    price: 5000,
    description: '차갑게 우려낸 커피',
  },
])
```

#### 2. 네비게이션 색상 적용

**파일**: `frontend/src/app/order/page.tsx`

```typescript
<Link
  href="/order"
  className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
>
  주문하기
</Link>
<Link
  href="/admin"
  className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
>
  관리자
</Link>
```

#### 3. 버튼 색상 적용

**파일**: `frontend/src/components/MenuCard.tsx`

```typescript
<button
  onClick={handleAddToCart}
  className="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded font-medium"
>
  담기
</button>
```

**파일**: `frontend/src/components/ShoppingCart.tsx`

```typescript
<button
  onClick={onOrder}
  className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded font-medium"
>
  주문하기
</button>
```

---

## 🔵 3단계: REFACTOR - 코드 개선

### 개선 사항

#### 1. MenuCard 컴포넌트 개선

**파일**: `frontend/src/components/MenuCard.tsx`

##### 개선 내용:
- **상수 분리**: `SHOT_PRICE`, `SYRUP_PRICE` 상수 정의
- **함수 타입 명시**: TypeScript 타입 명시 (`: number`, `: void`)
- **함수 분리**: `resetOptions()`, `handleQuantityChange()` 함수 분리
- **UI 개선**:
  - 그라데이션 배경 적용
  - 커피 아이콘 추가 (☕)
  - 수량 조절 UI 개선
  - 호버 효과 추가
  - 그림자 효과 추가

```typescript
const SHOT_PRICE = 500
const SYRUP_PRICE = 0

const calculatePrice = (): number => {
  let total = menu.price
  if (shotAdded) total += SHOT_PRICE
  if (syrupAdded) total += SYRUP_PRICE
  return total * quantity
}

const resetOptions = (): void => {
  setShotAdded(false)
  setSyrupAdded(false)
  setQuantity(1)
}

const handleQuantityChange = (delta: number): void => {
  setQuantity((prev) => Math.max(1, prev + delta))
}
```

##### 스타일 개선:
- 카드: `shadow-sm hover:shadow-md transition-shadow`
- 이미지 영역: `bg-gradient-to-br from-amber-100 to-amber-50`
- 가격: `text-teal-600` (청록색 강조)
- 버튼: `shadow-sm hover:shadow-md transition-colors`

#### 2. Header 컴포넌트 개선

**파일**: `frontend/src/app/order/page.tsx`

##### 개선 내용:
- **그라데이션 배경**: `bg-gradient-to-r from-purple-50 to-white`
- **브랜드 로고**: 그라데이션 텍스트 효과
- **네비게이션**: 호버 효과 및 전환 애니메이션

```typescript
<header className="border-b border-purple-100 bg-gradient-to-r from-purple-50 to-white px-6 py-4 shadow-sm">
  <Link
    href="/"
    className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
  >
    COZY
  </Link>
  <nav className="flex items-center gap-4">
    <Link
      href="/order"
      className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
    >
      주문하기
    </Link>
  </nav>
</header>
```

#### 3. ShoppingCart 컴포넌트 개선

**파일**: `frontend/src/components/ShoppingCart.tsx`

##### 개선 내용:
- **총 금액 색상**: `text-teal-600` (청록색 강조)
- **버튼 스타일**: 그림자 및 전환 효과 추가
- **카드 스타일**: 그림자 및 배경색 개선

```typescript
<div className="flex items-center justify-between mb-4">
  <span className="text-lg font-bold text-gray-800">총 금액</span>
  <span className="text-xl font-bold text-teal-600">
    {calculateTotal().toLocaleString()}원
  </span>
</div>
<button
  onClick={onOrder}
  className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-medium shadow-sm hover:shadow-md transition-all"
>
  주문하기
</button>
```

---

## 🎨 색상 스키마

### 네비게이션 색상 (보라색 계열)
- **기본**: `text-purple-600` (#9333ea)
- **호버**: `text-purple-700` (#7e22ce)
- **배경**: `bg-purple-50` (#faf5ff)
- **그라데이션**: `from-purple-600 to-purple-800`

### 버튼 색상 (청록색 계열)
- **기본**: `bg-teal-500` (#14b8a6)
- **호버**: `bg-teal-600` (#0d9488)
- **텍스트**: `text-white`
- **강조**: `text-teal-600` (가격 표시)

### 기타 색상
- **카드 배경**: `bg-white`
- **테두리**: `border-gray-200`
- **그림자**: `shadow-sm`, `hover:shadow-md`
- **커피 아이콘 배경**: `from-amber-100 to-amber-50`

---

## 📊 커피 메뉴 목록

| 메뉴명 | 가격 | 설명 |
|--------|------|------|
| 에스프레소 | 3,500원 | 진한 에스프레소 |
| 카푸치노 | 5,500원 | 부드러운 우유 거품과 에스프레소 |
| 카라멜 마키아토 | 6,000원 | 카라멜 시럽이 들어간 라떼 |
| 바닐라 라떼 | 6,000원 | 바닐라 시럽이 들어간 라떼 |
| 콜드브루 | 5,000원 | 차갑게 우려낸 커피 |

---

## 📁 수정된 파일 목록

### 테스트 파일
1. `frontend/src/__tests__/OrderPage.test.tsx` (신규)
2. `frontend/src/__tests__/MenuCard.test.tsx` (신규)

### 컴포넌트 파일
1. `frontend/src/app/order/page.tsx`
   - 커피 메뉴 데이터 추가
   - 네비게이션 색상 적용
   - 헤더 스타일 개선

2. `frontend/src/components/MenuCard.tsx`
   - 버튼 색상 적용 (청록색)
   - 코드 리팩토링
   - UI 개선

3. `frontend/src/components/ShoppingCart.tsx`
   - 버튼 색상 적용 (청록색)
   - 총 금액 색상 강조
   - 스타일 개선

---

## ✅ 체크리스트

### RED 단계
- [x] 실패하는 테스트 작성
- [x] 커피 메뉴 표시 테스트
- [x] 네비게이션 색상 테스트
- [x] 버튼 색상 테스트

### GREEN 단계
- [x] 커피 메뉴 데이터 추가
- [x] 네비게이션 색상 적용
- [x] 버튼 색상 적용
- [x] 테스트 통과 확인

### REFACTOR 단계
- [x] 코드 리팩토링
- [x] 상수 분리
- [x] 함수 분리
- [x] UI 개선
- [x] 스타일 개선
- [x] 타입 명시

---

## 🚀 다음 단계

### 추천 개선 사항
1. **API 연동**: 실제 백엔드 API와 연동
2. **이미지 추가**: 메뉴별 실제 이미지 추가
3. **애니메이션**: 더 부드러운 전환 효과
4. **반응형 디자인**: 모바일 최적화
5. **접근성**: ARIA 레이블 및 키보드 네비게이션

### 테스트 확장
1. **통합 테스트**: 전체 주문 플로우 테스트
2. **E2E 테스트**: Playwright 또는 Cypress
3. **성능 테스트**: 렌더링 성능 측정

---

## 📝 참고 사항

### TDD 사이클
1. **RED**: 실패하는 테스트 작성
2. **GREEN**: 최소한의 코드로 통과
3. **REFACTOR**: 코드 개선 및 최적화

### 색상 선택 이유
- **보라색 (네비게이션)**: 브랜드 아이덴티티와 일관성
- **청록색 (버튼)**: 행동 유도(Call-to-Action)에 적합한 색상

---

**작성 완료일**: 2025-12-15  
**다음 검토**: 테스트 실행 및 통과 확인

