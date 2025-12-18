# 코드 스멜 및 SOLID 위반 분석

## 개요
현재 코드베이스에서 발견된 코드 스멜과 SOLID 원칙 위반 가능성을 분석하고, 각각에 대한 리팩토링 기법과 우선순위를 제시합니다.

---

## 코드 스멜 분석

| # | 코드 스멜 유형 | 위치 | 문제점 | 리팩토링 기법 | 우선순위 |
|---|--------------|------|--------|--------------|---------|
| 1 | **긴 함수** | `backend/src/controllers/orderController.ts:createOrder` (128줄) | 검증, 비즈니스 로직, 트랜잭션 처리가 한 함수에 집중 | Extract Method, Service Layer 도입 | **High** |
| 2 | **긴 함수** | `backend/src/controllers/adminController.ts:getDashboard` (68줄) | 통계 계산, 피크 시간 분석이 한 함수에 집중 | Extract Method, Strategy Pattern | **High** |
| 3 | **긴 함수** | `frontend/src/components/MenuCard.tsx:getCoffeeImageUrl` (23줄) | 긴 if-else 체인으로 이미지 URL 결정 | Strategy Pattern, Map/Object Lookup | **Med** |
| 4 | **중복 코드** | 가격 계산 로직 (3곳) | `MenuCard.calculatePrice`, `ShoppingCart.calculateItemPrice`, `cartStore.getTotal`에서 중복 | Extract Function, Single Source of Truth | **High** |
| 5 | **중복 코드** | 샷 가격 500 (4곳) | `MenuCard`, `ShoppingCart`, `cartStore`에 하드코딩 | Extract Constant | **High** |
| 6 | **중복 코드** | localStorage 저장 로직 (3곳) | `cartStore`의 `addItem`, `removeItem`, `updateQuantity`에서 중복 | Extract Method, Side Effect 분리 | **Med** |
| 7 | **중복 코드** | 타입 정의 중복 | `Menu`, `CartItem`, `Order` 등이 여러 파일에 중복 정의 | Extract Type, Centralize Types | **High** |
| 8 | **중복 코드** | 에러 처리 패턴 (모든 컨트롤러) | 모든 컨트롤러에서 동일한 try-catch 패턴 | Extract Method, AOP 적용 | **Med** |
| 9 | **중복 코드** | 옵션 비교 로직 (3곳) | `JSON.stringify`로 옵션 비교하는 로직 중복 | Extract Function, Value Object | **Med** |
| 10 | **매직 넘버** | `500` (샷 가격) | 여러 곳에 하드코딩 | Extract Constant | **High** |
| 11 | **매직 넘버** | `500` (setTimeout) | `OrderPage`, `AdminDashboard`에서 사용 | Extract Constant | **Low** |
| 12 | **매직 넘버** | `60 * 60 * 1000` (1시간) | `orderController.ts:60` | Extract Constant | **Med** |
| 13 | **매직 넘버** | `1, 10, 20` (페이지네이션) | 여러 컨트롤러에 하드코딩 | Extract Constant | **Med** |
| 14 | **매직 넘버** | `400, 404, 403` (HTTP 상태 코드) | 여러 곳에 하드코딩 | Extract Constant | **Low** |
| 15 | **매직 넘버** | `'store-001'` (임시 매장 ID) | `OrderPage:21` | Extract Constant 또는 환경 변수 | **Low** |
| 16 | **의미없는 이름** | `id`, `delta`, `item`, `prev` | 여러 곳에서 사용되는 제네릭한 변수명 | Rename Variable | **Med** |
| 17 | **의미없는 이름** | `tx` (트랜잭션) | `orderController.ts:82` | Rename Variable | **Low** |
| 18 | **의미없는 이름** | `lat`, `lng` | `storeController.ts:18-19` | Rename Variable | **Low** |
| 19 | **의미없는 이름** | `any` 타입 사용 (11곳) | 타입 안정성 저하 | Replace with Specific Types | **High** |
| 20 | **예외 처리** | `alert()` 사용 | `OrderPage:100` - 사용자 경험 저하 | Replace with Toast/Modal | **Med** |
| 21 | **예외 처리** | 에러 처리 불일치 | 프론트엔드와 백엔드 에러 처리 방식 불일치 | Standardize Error Handling | **High** |
| 22 | **예외 처리** | 네트워크 에러 처리 부재 | API 호출 실패 시 처리 없음 | Add Error Boundary, Retry Logic | **High** |
| 23 | **예외 처리** | 이미지 로드 실패 처리 미흡 | `MenuCard:86-89` - 기본 이미지만 설정 | Improve Error Handling | **Low** |
| 24 | **예외 처리** | Prisma 에러 처리 불완전 | 일부 Prisma 에러만 처리 | Comprehensive Error Handling | **Med** |
| 25 | **의존성** | 컨트롤러가 Prisma에 직접 의존 | 모든 컨트롤러가 `prisma` 직접 import | Dependency Injection, Repository Pattern | **High** |
| 26 | **의존성** | 컴포넌트가 하드코딩된 데이터에 의존 | `OrderPage`, `AdminDashboard`에 임시 데이터 | Extract Data Fetching, Custom Hooks | **High** |
| 27 | **의존성** | API 클라이언트가 localStorage에 직접 의존 | `api.ts:13` - 테스트 어려움 | Dependency Injection | **Med** |
| 28 | **의존성** | 컴포넌트가 전역 상태에 직접 의존 | `OrderPage`가 `useCartStore` 직접 사용 | Props Drilling 또는 Context | **Low** |
| 29 | **의존성** | 거리 계산 로직이 컨트롤러에 포함 | `storeController.ts:36-47` | Extract Service, Strategy Pattern | **Med** |

---

## SOLID 원칙 위반 분석

| # | SOLID 원칙 | 위반 위치 | 문제점 | 리팩토링 기법 | 우선순위 |
|---|-----------|---------|--------|--------------|---------|
| 30 | **SRP (Single Responsibility)** | `orderController.ts:createOrder` | 검증, 비즈니스 로직, 트랜잭션, 응답 생성 모두 담당 | Extract Service Layer | **High** |
| 31 | **SRP** | `adminController.ts:getDashboard` | 통계 계산, 피크 시간 분석, 응답 생성 모두 담당 | Extract Service Layer | **High** |
| 32 | **SRP** | `MenuCard` 컴포넌트 | UI 렌더링, 상태 관리, 가격 계산, 이미지 URL 결정 모두 담당 | Extract Custom Hooks, Extract Utilities | **Med** |
| 33 | **SRP** | `ShoppingCart` 컴포넌트 | UI 렌더링, 가격 계산, 아이템 표시 로직 모두 담당 | Extract Utilities, Extract Sub-components | **Med** |
| 34 | **SRP** | `cartStore` | 상태 관리, localStorage 동기화, 가격 계산 모두 담당 | Separate Concerns, Extract Utilities | **Med** |
| 35 | **OCP (Open/Closed)** | `getCoffeeImageUrl` | 새로운 메뉴 추가 시 함수 수정 필요 | Strategy Pattern, Configuration Object | **Med** |
| 36 | **OCP** | 에러 핸들러 | 새로운 에러 타입 추가 시 수정 필요 | Strategy Pattern, Chain of Responsibility | **Low** |
| 37 | **LSP (Liskov Substitution)** | 없음 | 현재 위반 사항 없음 | - | - |
| 38 | **ISP (Interface Segregation)** | `MenuCardProps.onAddToCart` | `any` 타입 사용으로 인터페이스 불명확 | Define Specific Types | **High** |
| 39 | **ISP** | `ShoppingCartProps` | `options: any` 타입 사용 | Define Specific Types | **High** |
| 40 | **DIP (Dependency Inversion)** | 모든 컨트롤러 | Prisma 클라이언트에 직접 의존 | Repository Pattern, Dependency Injection | **High** |
| 41 | **DIP** | `api.ts` | localStorage에 직접 의존 | Dependency Injection | **Med** |
| 42 | **DIP** | `OrderPage`, `AdminDashboard` | 데이터 소스에 직접 의존 | Custom Hooks, Dependency Injection | **High** |

---

## 우선순위별 정리

### High 우선순위 (즉시 해결 필요)

1. **긴 함수 분리** - `createOrder`, `getDashboard`
2. **중복 코드 제거** - 가격 계산 로직, 샷 가격 상수
3. **타입 정의 통합** - 중복 타입 정의 제거
4. **`any` 타입 제거** - 타입 안정성 향상
5. **에러 처리 표준화** - 프론트엔드/백엔드 일관성
6. **네트워크 에러 처리** - 사용자 경험 개선
7. **의존성 역전** - Repository Pattern 도입
8. **SRP 위반** - Service Layer 분리
9. **ISP 위반** - 명확한 인터페이스 정의

### Medium 우선순위 (단기간 내 해결)

1. **긴 함수 분리** - `getCoffeeImageUrl`
2. **중복 코드 제거** - localStorage 저장 로직, 옵션 비교 로직
3. **매직 넘버** - 시간 관련 상수, 페이지네이션 기본값
4. **의미없는 이름** - 제네릭한 변수명 개선
5. **예외 처리 개선** - Prisma 에러 처리, `alert()` 대체
6. **의존성 개선** - API 클라이언트, 거리 계산 로직
7. **SRP 위반** - 컴포넌트 책임 분리
8. **OCP 위반** - 확장 가능한 구조로 변경

### Low 우선순위 (여유 있을 때 개선)

1. **매직 넘버** - HTTP 상태 코드, 임시 ID
2. **의미없는 이름** - `tx`, `lat`, `lng`
3. **예외 처리** - 이미지 로드 실패 처리
4. **의존성** - 전역 상태 의존성
5. **OCP 위반** - 에러 핸들러 확장성

---

## 리팩토링 기법 설명

### Extract Method
- 긴 함수를 작은 함수로 분리
- 적용: `createOrder`, `getDashboard`

### Extract Constant
- 매직 넘버를 의미있는 상수로 추출
- 적용: 샷 가격, 페이지네이션 기본값

### Extract Function
- 중복된 로직을 재사용 가능한 함수로 추출
- 적용: 가격 계산, 옵션 비교

### Extract Type
- 중복된 타입 정의를 중앙화
- 적용: `Menu`, `CartItem`, `Order`

### Service Layer 도입
- 비즈니스 로직을 컨트롤러에서 분리
- 적용: 모든 컨트롤러

### Repository Pattern
- 데이터 접근 로직을 추상화
- 적용: Prisma 의존성 제거

### Dependency Injection
- 의존성을 외부에서 주입
- 적용: API 클라이언트, localStorage

### Strategy Pattern
- 알고리즘을 객체로 캡슐화
- 적용: 이미지 URL 결정, 거리 계산

### Extract Custom Hooks
- 컴포넌트 로직을 재사용 가능한 훅으로 분리
- 적용: `MenuCard`, `ShoppingCart`

### Replace with Specific Types
- `any` 타입을 구체적인 타입으로 대체
- 적용: 모든 `any` 사용 위치

---

## 참고사항

- 우선순위는 **코드 품질 영향도**, **유지보수성**, **테스트 가능성**을 고려하여 결정
- High 우선순위 항목은 리팩토링 계획의 PR 1-4에 포함 권장
- Medium 우선순위 항목은 PR 5-7에 포함 권장
- Low 우선순위 항목은 PR 8 이후 또는 추가 개선 작업으로 진행

