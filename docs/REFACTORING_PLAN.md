# 리팩토링 작업 계획

## 개요
리팩토링 브랜치에서 진행할 작업을 PR 단위로 분리하고, 각 PR 내에서 작은 커밋 단위로 작업합니다.

---

## PR 1: 타입 정의 및 상수 통합

### 목표
- 중복된 타입 정의를 `frontend/src/types`로 통합
- 하드코딩된 상수 값들을 `frontend/src/constants`로 분리
- 타입 안정성 향상

### 커밋 계획

#### 커밋 1-1: 공통 타입 정의 통합
**제목**: `refactor(types): 통합 타입 정의 파일 생성`

- `frontend/src/types/index.ts`에 공통 타입 추가
  - `Menu`, `CartItem`, `Order`, `InventoryItem` 등
- 컴포넌트 내부 타입 정의 제거 및 import로 변경

#### 커밋 1-2: 상수 값 분리
**제목**: `refactor(constants): 상수 값 분리 및 중앙 관리`

- `frontend/src/constants/index.ts` 생성
  - `SHOT_PRICE`, `SYRUP_PRICE` 등 가격 상수
  - `ORDER_STATUS`, `MENU_STATUS` 등 상태 상수
  - 기본 설정 값들

#### 커밋 1-3: 타입 정의 적용
**제목**: `refactor(types): 컴포넌트에 통합 타입 적용`

- `MenuCard`, `ShoppingCart`, `OrderPage`, `AdminDashboard`에 통합 타입 적용
- 타입 중복 제거

---

## PR 2: API 통신 레이어 구현

### 목표
- TODO로 남아있는 API 호출 구현
- API 클라이언트 구조화 및 재사용성 향상
- 에러 처리 표준화

### 커밋 계획

#### 커밋 2-1: API 클라이언트 유틸리티 개선
**제목**: `feat(api): API 클라이언트 에러 처리 및 인터셉터 개선`

- `frontend/src/lib/api.ts` 개선
  - 재시도 로직 추가
  - 에러 타입 정의
  - 타임아웃 설정

#### 커밋 2-2: 메뉴 API 함수 구현
**제목**: `feat(api): 메뉴 조회 API 함수 구현`

- `frontend/src/lib/menu-api.ts` 생성
  - `getStoreMenus(storeId)` 함수 구현
  - 타입 정의 포함

#### 커밋 2-3: 주문 API 함수 구현
**제목**: `feat(api): 주문 관련 API 함수 구현`

- `frontend/src/lib/order-api.ts` 개선
  - `createOrder`, `getOrder`, `getUserOrders` 구현
  - 타입 정의 포함

#### 커밋 2-4: 관리자 API 함수 구현
**제목**: `feat(api): 관리자 API 함수 구현`

- `frontend/src/lib/admin-api.ts` 개선
  - `getOrders`, `updateOrderStatus`, `getDashboard` 구현
  - `createMenu`, `updateMenu`, `deleteMenu` 구현

#### 커밋 2-5: API 훅 생성
**제목**: `feat(hooks): React Query를 활용한 API 훅 생성`

- `frontend/src/hooks/useMenus.ts` 생성
- `frontend/src/hooks/useOrders.ts` 생성
- `frontend/src/hooks/useAdmin.ts` 생성
- 로딩, 에러 상태 관리 포함

---

## PR 3: 컴포넌트 리팩토링

### 목표
- 컴포넌트 책임 분리
- 재사용성 향상
- 로직과 UI 분리

### 커밋 계획

#### 커밋 3-1: MenuCard 컴포넌트 리팩토링
**제목**: `refactor(components): MenuCard 컴포넌트 로직 분리`

- 이미지 URL 로직을 `frontend/src/utils/imageUtils.ts`로 분리
- 가격 계산 로직을 유틸 함수로 분리
- 옵션 상태 관리를 커스텀 훅으로 분리 (`useMenuOptions`)

#### 커밋 3-2: ShoppingCart 컴포넌트 리팩토링
**제목**: `refactor(components): ShoppingCart 컴포넌트 개선`

- 가격 계산 로직을 유틸 함수로 분리
- 아이템 표시 로직 개선
- 접근성 개선 (ARIA 라벨 추가)

#### 커밋 3-3: 공통 UI 컴포넌트 생성
**제목**: `feat(components): 공통 UI 컴포넌트 생성`

- `Button`, `LoadingSpinner`, `ErrorMessage` 컴포넌트 생성
- `frontend/src/components/ui/` 디렉토리 생성

#### 커밋 3-4: 컴포넌트에 공통 UI 적용
**제목**: `refactor(components): 공통 UI 컴포넌트 적용`

- 기존 컴포넌트에 새로 만든 공통 UI 컴포넌트 적용
- 일관된 스타일 및 동작 보장

---

## PR 4: 페이지 리팩토링

### 목표
- 페이지 컴포넌트에서 비즈니스 로직 분리
- API 통신을 훅으로 대체
- 상태 관리 개선

### 커밋 계획

#### 커밋 4-1: OrderPage 리팩토링
**제목**: `refactor(pages): OrderPage API 통신 및 상태 관리 개선`

- `useMenus` 훅으로 메뉴 데이터 가져오기
- 로딩 및 에러 상태 처리 개선
- 하드코딩된 데이터 제거

#### 커밋 4-2: AdminDashboard 리팩토링
**제목**: `refactor(pages): AdminDashboard API 통신 및 상태 관리 개선`

- `useAdmin` 훅으로 데이터 가져오기
- 재고 관리 API 연동
- 주문 상태 업데이트 API 연동

#### 커밋 4-3: AdminMenusPage 리팩토링
**제목**: `refactor(pages): AdminMenusPage API 통신 개선`

- 메뉴 CRUD API 연동
- 폼 검증 개선
- 에러 처리 개선

#### 커밋 4-4: AdminOrdersPage 리팩토링
**제목**: `refactor(pages): AdminOrdersPage API 통신 개선`

- 주문 목록 API 연동
- 필터링 및 페이지네이션 개선
- 주문 상태 업데이트 API 연동

---

## PR 5: 에러 처리 및 로딩 상태 개선

### 목표
- 일관된 에러 처리 패턴 적용
- 로딩 상태 UI 개선
- 사용자 경험 향상

### 커밋 계획

#### 커밋 5-1: 에러 바운더리 구현
**제목**: `feat(error): React Error Boundary 구현`

- `frontend/src/components/ErrorBoundary.tsx` 생성
- 페이지별 에러 처리 개선

#### 커밋 5-2: 로딩 상태 컴포넌트 개선
**제목**: `feat(ui): 로딩 상태 컴포넌트 개선`

- 스켈레톤 UI 추가
- 페이지별 로딩 상태 개선

#### 커밋 5-3: 에러 메시지 표시 개선
**제목**: `feat(ui): 에러 메시지 표시 개선`

- 토스트 알림 시스템 추가 (선택사항)
- 에러 메시지 표시 개선

#### 커밋 5-4: 네트워크 에러 처리
**제목**: `feat(api): 네트워크 에러 처리 개선`

- 오프라인 상태 감지
- 재시도 로직 개선
- 사용자 친화적 에러 메시지

---

## PR 6: 이미지 및 리소스 관리 개선

### 목표
- 이미지 URL 관리 개선
- 이미지 최적화
- 리소스 로딩 성능 개선

### 커밋 계획

#### 커밋 6-1: 이미지 URL 관리 개선
**제목**: `refactor(images): 이미지 URL 관리 개선`

- `frontend/src/constants/images.ts` 생성
- 메뉴별 이미지 URL 매핑 개선
- 환경 변수 지원 (선택사항)

#### 커밋 6-2: 이미지 로딩 최적화
**제목**: `perf(images): 이미지 로딩 최적화`

- Next.js Image 컴포넌트 사용
- 이미지 프리로딩
- 레이지 로딩 적용

#### 커밋 6-3: 이미지 폴백 처리 개선
**제목**: `feat(images): 이미지 폴백 처리 개선`

- 이미지 로드 실패 시 기본 이미지 표시
- 이미지 로딩 상태 표시

---

## PR 7: 백엔드 서비스 레이어 분리

### 목표
- 컨트롤러에서 비즈니스 로직 분리
- 서비스 레이어 도입
- 코드 재사용성 향상

### 커밋 계획

#### 커밋 7-1: 서비스 레이어 구조 생성
**제목**: `refactor(backend): 서비스 레이어 구조 생성`

- `backend/src/services/` 디렉토리 생성
- 기본 서비스 인터페이스 정의

#### 커밋 7-2: 주문 서비스 구현
**제목**: `refactor(backend): 주문 서비스 로직 분리`

- `backend/src/services/orderService.ts` 생성
- `orderController`에서 비즈니스 로직 이동

#### 커밋 7-3: 매장 서비스 구현
**제목**: `refactor(backend): 매장 서비스 로직 분리`

- `backend/src/services/storeService.ts` 생성
- `storeController`에서 비즈니스 로직 이동

#### 커밋 7-4: 관리자 서비스 구현
**제목**: `refactor(backend): 관리자 서비스 로직 분리`

- `backend/src/services/adminService.ts` 생성
- `adminController`에서 비즈니스 로직 이동

#### 커밋 7-5: 컨트롤러 리팩토링
**제목**: `refactor(backend): 컨트롤러를 서비스 레이어 사용하도록 변경`

- 모든 컨트롤러가 서비스 레이어 사용하도록 변경
- 컨트롤러는 요청/응답 처리만 담당

---

## PR 8: 테스트 개선

### 목표
- 테스트 커버리지 향상
- 통합 테스트 추가
- E2E 테스트 추가 (선택사항)

### 커밋 계획

#### 커밋 8-1: 프론트엔드 컴포넌트 테스트 개선
**제목**: `test(frontend): 컴포넌트 테스트 개선`

- `MenuCard`, `ShoppingCart` 테스트 개선
- API 모킹 개선

#### 커밋 8-2: 프론트엔드 훅 테스트 추가
**제목**: `test(frontend): 커스텀 훅 테스트 추가`

- `useMenus`, `useOrders`, `useAdmin` 훅 테스트
- React Query 테스트 유틸리티 사용

#### 커밋 8-3: 백엔드 서비스 테스트 추가
**제목**: `test(backend): 서비스 레이어 테스트 추가`

- 각 서비스에 대한 단위 테스트 추가
- 모킹 전략 개선

#### 커밋 8-4: 통합 테스트 개선
**제목**: `test(integration): 통합 테스트 개선`

- API 엔드포인트 통합 테스트 개선
- 테스트 데이터 관리 개선

---

## 작업 순서

1. **PR 1** (타입 및 상수 통합) - 기반 작업
2. **PR 2** (API 레이어) - PR 1 의존
3. **PR 3** (컴포넌트 리팩토링) - PR 1, 2 의존
4. **PR 4** (페이지 리팩토링) - PR 1, 2, 3 의존
5. **PR 5** (에러 처리) - PR 4 의존
6. **PR 6** (이미지 관리) - 독립적
7. **PR 7** (백엔드 서비스) - 독립적
8. **PR 8** (테스트) - 모든 PR 의존

---

## 커밋 메시지 컨벤션

- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `perf`: 성능 개선
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `chore`: 빌드/설정 변경

형식: `type(scope): 제목`

---

## 참고사항

- 각 PR은 독립적으로 리뷰 가능하도록 구성
- 작은 커밋 단위로 작업하여 히스토리 추적 용이
- 각 커밋은 테스트 통과 상태 유지
- 리팩토링 중 기능 변경 없음 (기능 보존)

