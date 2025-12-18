# Green 단계 구현 체크리스트

이 문서는 Green 단계 구현을 단계별로 추적하기 위한 체크리스트입니다.

## 📊 전체 진행 상황

- [ ] Step 1: 기반 구축
- [ ] Step 2: 인증 기능
- [ ] Step 3: 매장 기능
- [ ] Step 4: 주문 기능
- [ ] Step 5: 관리자 기능

**현재 진행률**: 0% (0/5 단계 완료)

---

## Step 1: 기반 구축

### 1.1 Prisma Client 설정
- [ ] `backend/src/lib/prisma.ts` 파일 생성
- [ ] Prisma Client 인스턴스 생성
- [ ] export 설정

### 1.2 입력 검증 유틸리티
- [ ] `backend/src/utils/validation.ts` 파일 생성
- [ ] registerSchema 정의
- [ ] loginSchema 정의
- [ ] orderSchema 정의
- [ ] menuSchema 정의

### 1.3 인증 미들웨어 완성
- [ ] JWT 토큰 검증 로직 구현
- [ ] 사용자 정보 추출
- [ ] 에러 처리

**테스트**: 미들웨어는 다른 기능 테스트에서 간접적으로 검증됨

---

## Step 2: 인증 기능

### 2.1 사용자 등록 (register)
- [ ] 입력 검증 추가
- [ ] 전화번호 중복 확인
- [ ] 비밀번호 해싱
- [ ] 사용자 생성
- [ ] 응답 형식 맞추기

**테스트 통과 목표:**
- [ ] should register a new user with valid data
- [ ] should return 400 if phone is missing
- [ ] should return 400 if phone already exists

### 2.2 로그인 (login)
- [ ] 입력 검증 추가
- [ ] 사용자 조회
- [ ] 비밀번호 검증
- [ ] JWT 토큰 생성
- [ ] 응답 형식 맞추기

**테스트 통과 목표:**
- [ ] should login with valid credentials
- [ ] should return 401 with invalid credentials
- [ ] should return 400 if phone is missing

### 2.3 로그아웃 (logout)
- [ ] 성공 응답 구현

**테스트 통과 목표:**
- [ ] should logout successfully

**Step 2 완료 기준**: auth.test.ts의 모든 테스트 통과 (6개)

---

## Step 3: 매장 기능

### 3.1 근처 매장 조회 (getNearbyStores)
- [ ] 위치 파라미터 검증
- [ ] 매장 목록 조회
- [ ] 거리 계산
- [ ] 정렬
- [ ] 응답 형식 맞추기

**테스트 통과 목표:**
- [ ] should return nearby stores with location
- [ ] should return stores sorted by distance
- [ ] should return 400 if location is missing

### 3.2 매장 메뉴 조회 (getStoreMenus)
- [ ] 매장 존재 확인
- [ ] 메뉴 조회 (AVAILABLE만)
- [ ] 404 에러 처리
- [ ] 응답 형식 맞추기

**테스트 통과 목표:**
- [ ] should return menus for a valid store
- [ ] should only return available menus
- [ ] should return 404 for non-existent store

**Step 3 완료 기준**: stores.test.ts의 모든 테스트 통과 (5개)

---

## Step 4: 주문 기능

### 4.1 주문 생성 (createOrder)
- [ ] 입력 검증
- [ ] 픽업 시간 검증 (과거 시간 체크)
- [ ] 메뉴 존재 및 품절 확인
- [ ] 시간대별 주문 제한 확인
- [ ] 주문 생성 (트랜잭션)
- [ ] 결제 정보 생성
- [ ] 응답 형식 맞추기

**테스트 통과 목표:**
- [ ] should create an order with valid data
- [ ] should return 400 if store_id is missing
- [ ] should return 400 if items array is empty
- [ ] should return 400 if pickup_time is in the past
- [ ] should return 400 if menu is sold out
- [ ] should return 400 if time slot is full

### 4.2 주문 조회 (getOrder)
- [ ] 주문 존재 확인
- [ ] 권한 확인 (본인 주문만)
- [ ] 주문 정보 조회 (items, payment 포함)
- [ ] 404/403 에러 처리

**테스트 통과 목표:**
- [ ] should return order details for valid order
- [ ] should return 404 for non-existent order
- [ ] should return 403 if user tries to access another user's order

### 4.3 사용자 주문 목록 (getUserOrders)
- [ ] 라우트 경로 확인/수정
- [ ] 사용자 주문 조회
- [ ] 정렬 (created_at DESC)
- [ ] 페이지네이션

**테스트 통과 목표:**
- [ ] should return user's orders
- [ ] should return orders sorted by created_at descending
- [ ] should support pagination

**Step 4 완료 기준**: orders.test.ts의 모든 테스트 통과 (12개)

---

## Step 5: 관리자 기능

### 5.1 주문 관리

#### getOrders
- [ ] 주문 목록 조회
- [ ] 상태별 필터링
- [ ] 페이지네이션

**테스트 통과 목표:**
- [ ] should return all orders for admin
- [ ] should support filtering by status
- [ ] should support pagination

#### updateOrderStatus
- [ ] 주문 존재 확인
- [ ] 상태 값 검증
- [ ] 주문 상태 업데이트
- [ ] 404/400 에러 처리

**테스트 통과 목표:**
- [ ] should update order status
- [ ] should return 400 for invalid status
- [ ] should return 404 for non-existent order

### 5.2 메뉴 관리

#### createMenu
- [ ] 입력 검증
- [ ] 메뉴 생성
- [ ] 400 에러 처리

**테스트 통과 목표:**
- [ ] should create a new menu
- [ ] should return 400 if required fields are missing

#### updateMenu
- [ ] 메뉴 존재 확인
- [ ] 메뉴 수정
- [ ] 404 에러 처리

**테스트 통과 목표:**
- [ ] should update menu information
- [ ] should return 404 for non-existent menu

### 5.3 대시보드 (getDashboard)
- [ ] 통계 데이터 조회
- [ ] 피크 시간 분석
- [ ] 날짜 범위 필터링

**테스트 통과 목표:**
- [ ] should return dashboard data
- [ ] should return peak hours data
- [ ] should support date range filtering

**Step 5 완료 기준**: admin.test.ts의 모든 테스트 통과 (12개)

---

## 최종 확인

### 통합 테스트
- [ ] integration.test.ts 통과
  - [ ] should complete full order flow: register -> login -> browse stores -> create order

### 전체 테스트 실행
- [ ] 모든 테스트 통과 (39개)
- [ ] 테스트 실행 시간 확인
- [ ] 커버리지 확인

---

## 진행 상황 업데이트

각 단계 완료 시 체크리스트를 업데이트하고, 테스트 결과를 기록하세요.

**마지막 업데이트**: 2025-12-15

