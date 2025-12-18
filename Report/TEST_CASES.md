# 테스트 케이스 문서

이 문서는 OrderBean 프로젝트의 모든 테스트 케이스를 정리한 것입니다.

**작성일**: 2025-12-15  
**총 테스트 수**: 39개  
**테스트 스위트**: 5개

---

## 목차

1. [인증 API 테스트](#1-인증-api-테스트)
2. [매장 API 테스트](#2-매장-api-테스트)
3. [주문 API 테스트](#3-주문-api-테스트)
4. [관리자 API 테스트](#4-관리자-api-테스트)
5. [통합 테스트](#5-통합-테스트)

---

## 1. 인증 API 테스트

**파일**: `backend/src/__tests__/auth.test.ts`  
**엔드포인트**: `/api/auth/*`  
**총 테스트 수**: 6개

### 1.1 POST /api/auth/register

#### TC-AUTH-001: 유효한 데이터로 사용자 등록
- **목적**: 정상적인 회원가입이 성공하는지 확인
- **전제조건**: 없음
- **입력 데이터**:
  ```json
  {
    "name": "Test User",
    "phone": "01012345678",
    "password": "password123"
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 201 Created
  - 응답 본문에 `user` 객체 포함
  - `user` 객체에 `user_id`, `name`, `phone` 포함
  - `user` 객체에 `password` 필드 없음
- **검증 항목**:
  - ✅ `response.body.user` 존재
  - ✅ `response.body.user.user_id` 존재
  - ✅ `response.body.user.name === "Test User"`
  - ✅ `response.body.user.phone === "01012345678"`
  - ✅ `response.body.user.password` 없음

#### TC-AUTH-002: 전화번호 누락 시 400 에러
- **목적**: 필수 필드 검증 확인
- **전제조건**: 없음
- **입력 데이터**:
  ```json
  {
    "name": "Test User",
    "password": "password123"
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 400 Bad Request
  - 응답 본문에 `message` 포함
- **검증 항목**:
  - ✅ HTTP 상태 코드 400
  - ✅ `response.body.message` 존재

#### TC-AUTH-003: 중복 전화번호 시 400 에러
- **목적**: 중복 가입 방지 확인
- **전제조건**: 동일한 전화번호로 이미 등록된 사용자 존재
- **입력 데이터**:
  ```json
  {
    "name": "Test User",
    "phone": "01012345678",
    "password": "password123"
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 400 Bad Request
  - 응답 본문에 `message` 포함
- **검증 항목**:
  - ✅ HTTP 상태 코드 400
  - ✅ `response.body.message` 존재

### 1.2 POST /api/auth/login

#### TC-AUTH-004: 유효한 자격증명으로 로그인
- **목적**: 정상적인 로그인이 성공하는지 확인
- **전제조건**: 등록된 사용자 존재
- **입력 데이터**:
  ```json
  {
    "phone": "01012345678",
    "password": "password123"
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `token` 및 `user` 객체 포함
- **검증 항목**:
  - ✅ `response.body.token` 존재
  - ✅ `response.body.user` 존재
  - ✅ `response.body.user.phone === "01012345678"`

#### TC-AUTH-005: 잘못된 자격증명 시 401 에러
- **목적**: 인증 실패 처리 확인
- **전제조건**: 등록된 사용자 존재
- **입력 데이터**:
  ```json
  {
    "phone": "01012345678",
    "password": "wrongpassword"
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 401 Unauthorized
  - 응답 본문에 `message` 포함
- **검증 항목**:
  - ✅ HTTP 상태 코드 401
  - ✅ `response.body.message` 존재

#### TC-AUTH-006: 전화번호 누락 시 400 에러
- **목적**: 필수 필드 검증 확인
- **전제조건**: 없음
- **입력 데이터**:
  ```json
  {
    "password": "password123"
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 400 Bad Request
  - 응답 본문에 `message` 포함
- **검증 항목**:
  - ✅ HTTP 상태 코드 400
  - ✅ `response.body.message` 존재

### 1.3 POST /api/auth/logout

#### TC-AUTH-007: 로그아웃 성공
- **목적**: 로그아웃 기능 확인
- **전제조건**: 없음
- **입력 데이터**: 없음
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `message` 포함
- **검증 항목**:
  - ✅ HTTP 상태 코드 200
  - ✅ `response.body.message` 존재

---

## 2. 매장 API 테스트

**파일**: `backend/src/__tests__/stores.test.ts`  
**엔드포인트**: `/api/stores/*`  
**총 테스트 수**: 5개

### 2.1 GET /api/stores/nearby

#### TC-STORE-001: 위치 정보로 근처 매장 조회
- **목적**: 위치 기반 매장 조회 기능 확인
- **전제조건**: 인증된 사용자
- **입력 데이터**: Query Parameters
  ```
  latitude=37.5665&longitude=126.9780
  ```
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `stores` 배열 포함
- **검증 항목**:
  - ✅ `response.body.stores` 존재
  - ✅ `Array.isArray(response.body.stores) === true`

#### TC-STORE-002: 거리순 정렬 확인
- **목적**: 매장이 거리순으로 정렬되는지 확인
- **전제조건**: 인증된 사용자, 2개 이상의 매장 존재
- **입력 데이터**: Query Parameters
  ```
  latitude=37.5665&longitude=126.9780
  ```
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - `stores` 배열이 거리순으로 정렬됨
- **검증 항목**:
  - ✅ `stores[0].distance <= stores[1].distance` (2개 이상일 때)

#### TC-STORE-003: 위치 정보 누락 시 400 에러
- **목적**: 필수 파라미터 검증 확인
- **전제조건**: 인증된 사용자
- **입력 데이터**: Query Parameters 없음
- **예상 결과**:
  - HTTP 상태 코드: 400 Bad Request
  - 응답 본문에 `message` 포함
- **검증 항목**:
  - ✅ HTTP 상태 코드 400
  - ✅ `response.body.message` 존재

### 2.2 GET /api/stores/:id/menus

#### TC-STORE-004: 유효한 매장의 메뉴 조회
- **목적**: 매장 메뉴 조회 기능 확인
- **전제조건**: 인증된 사용자, 유효한 매장 ID
- **입력 데이터**: Path Parameter
  ```
  id: "test-store-id"
  ```
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `menus` 배열 포함
- **검증 항목**:
  - ✅ `response.body.menus` 존재
  - ✅ `Array.isArray(response.body.menus) === true`

#### TC-STORE-005: 품절 메뉴 제외 확인
- **목적**: AVAILABLE 상태 메뉴만 반환되는지 확인
- **전제조건**: 인증된 사용자, 유효한 매장 ID
- **입력 데이터**: Path Parameter
  ```
  id: "test-store-id"
  ```
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 모든 메뉴의 `status`가 `AVAILABLE`
- **검증 항목**:
  - ✅ 모든 `menu.status === "AVAILABLE"`

#### TC-STORE-006: 존재하지 않는 매장 시 404 에러
- **목적**: 존재하지 않는 리소스 처리 확인
- **전제조건**: 인증된 사용자
- **입력 데이터**: Path Parameter
  ```
  id: "non-existent-store-id"
  ```
- **예상 결과**:
  - HTTP 상태 코드: 404 Not Found
  - 응답 본문에 `message` 포함
- **검증 항목**:
  - ✅ HTTP 상태 코드 404
  - ✅ `response.body.message` 존재

---

## 3. 주문 API 테스트

**파일**: `backend/src/__tests__/orders.test.ts`  
**엔드포인트**: `/api/orders/*`  
**총 테스트 수**: 12개

### 3.1 POST /api/orders

#### TC-ORDER-001: 유효한 데이터로 주문 생성
- **목적**: 정상적인 주문 생성 확인
- **전제조건**: 인증된 사용자
- **입력 데이터**:
  ```json
  {
    "store_id": "test-store-id",
    "pickup_time": "2025-12-15T12:00:00Z",
    "items": [
      {
        "menu_id": "test-menu-id",
        "quantity": 2,
        "options": {
          "sugar": "normal",
          "ice": "normal",
          "shots": 1
        }
      }
    ]
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 201 Created
  - 응답 본문에 `order` 객체 포함
- **검증 항목**:
  - ✅ `response.body.order` 존재
  - ✅ `response.body.order.order_id` 존재
  - ✅ `response.body.order.store_id === "test-store-id"`
  - ✅ `response.body.order.status === "PENDING"`

#### TC-ORDER-002: store_id 누락 시 400 에러
- **목적**: 필수 필드 검증 확인
- **전제조건**: 인증된 사용자
- **입력 데이터**:
  ```json
  {
    "pickup_time": "2025-12-15T12:00:00Z",
    "items": []
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 400 Bad Request
- **검증 항목**:
  - ✅ HTTP 상태 코드 400

#### TC-ORDER-003: 빈 items 배열 시 400 에러
- **목적**: 장바구니 검증 확인
- **전제조건**: 인증된 사용자
- **입력 데이터**:
  ```json
  {
    "store_id": "test-store-id",
    "pickup_time": "2025-12-15T12:00:00Z",
    "items": []
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 400 Bad Request
- **검증 항목**:
  - ✅ HTTP 상태 코드 400

#### TC-ORDER-004: 과거 픽업 시간 시 400 에러
- **목적**: 시간 검증 확인
- **전제조건**: 인증된 사용자
- **입력 데이터**:
  ```json
  {
    "store_id": "test-store-id",
    "pickup_time": "2020-01-01T12:00:00Z",
    "items": [
      {
        "menu_id": "test-menu-id",
        "quantity": 1
      }
    ]
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 400 Bad Request
- **검증 항목**:
  - ✅ HTTP 상태 코드 400

#### TC-ORDER-005: 품절 메뉴 포함 시 400 에러
- **목적**: 품절 메뉴 검증 확인
- **전제조건**: 인증된 사용자, 품절된 메뉴 존재
- **입력 데이터**:
  ```json
  {
    "store_id": "test-store-id",
    "pickup_time": "2025-12-15T12:00:00Z",
    "items": [
      {
        "menu_id": "sold-out-menu-id",
        "quantity": 1
      }
    ]
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 400 Bad Request
  - 응답 메시지에 "sold out" 포함
- **검증 항목**:
  - ✅ HTTP 상태 코드 400
  - ✅ `response.body.message`에 "sold out" 포함

#### TC-ORDER-006: 시간대 주문 한도 초과 시 400 에러
- **목적**: 시간대별 주문 제한 확인
- **전제조건**: 인증된 사용자, 해당 시간대 주문 한도 초과
- **입력 데이터**:
  ```json
  {
    "store_id": "test-store-id",
    "pickup_time": "2025-12-15T12:00:00Z",
    "items": [
      {
        "menu_id": "test-menu-id",
        "quantity": 1
      }
    ]
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 400 Bad Request
  - 응답 메시지에 "full" 포함
- **검증 항목**:
  - ✅ HTTP 상태 코드 400
  - ✅ `response.body.message`에 "full" 포함

### 3.2 GET /api/orders/:id

#### TC-ORDER-007: 유효한 주문 조회
- **목적**: 주문 상세 조회 기능 확인
- **전제조건**: 인증된 사용자, 본인의 주문
- **입력 데이터**: Path Parameter
  ```
  id: "test-order-id"
  ```
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `order` 객체 포함
  - `order`에 `items`, `payment` 포함
- **검증 항목**:
  - ✅ `response.body.order` 존재
  - ✅ `response.body.order.order_id === "test-order-id"`
  - ✅ `response.body.order.items` 존재
  - ✅ `response.body.order.payment` 존재

#### TC-ORDER-008: 존재하지 않는 주문 시 404 에러
- **목적**: 존재하지 않는 리소스 처리 확인
- **전제조건**: 인증된 사용자
- **입력 데이터**: Path Parameter
  ```
  id: "non-existent-order-id"
  ```
- **예상 결과**:
  - HTTP 상태 코드: 404 Not Found
- **검증 항목**:
  - ✅ HTTP 상태 코드 404

#### TC-ORDER-009: 다른 사용자의 주문 조회 시 403 에러
- **목적**: 권한 검증 확인
- **전제조건**: 인증된 사용자, 다른 사용자의 주문
- **입력 데이터**: Path Parameter
  ```
  id: "other-user-order-id"
  ```
- **예상 결과**:
  - HTTP 상태 코드: 403 Forbidden
- **검증 항목**:
  - ✅ HTTP 상태 코드 403

### 3.3 GET /api/orders/users/me/orders

#### TC-ORDER-010: 사용자 주문 목록 조회
- **목적**: 사용자 주문 목록 조회 기능 확인
- **전제조건**: 인증된 사용자
- **입력 데이터**: 없음
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `orders` 배열 포함
- **검증 항목**:
  - ✅ `response.body.orders` 존재
  - ✅ `Array.isArray(response.body.orders) === true`

#### TC-ORDER-011: 주문 목록 최신순 정렬 확인
- **목적**: 주문이 최신순으로 정렬되는지 확인
- **전제조건**: 인증된 사용자, 2개 이상의 주문 존재
- **입력 데이터**: 없음
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - `orders` 배열이 `created_at` 기준 내림차순 정렬
- **검증 항목**:
  - ✅ `orders[0].created_at >= orders[1].created_at` (2개 이상일 때)

#### TC-ORDER-012: 페이지네이션 지원 확인
- **목적**: 페이지네이션 기능 확인
- **전제조건**: 인증된 사용자
- **입력 데이터**: Query Parameters
  ```
  page=1&limit=10
  ```
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `pagination` 객체 포함
- **검증 항목**:
  - ✅ `response.body.pagination` 존재
  - ✅ `response.body.pagination.page` 존재
  - ✅ `response.body.pagination.limit` 존재
  - ✅ `response.body.pagination.total` 존재

---

## 4. 관리자 API 테스트

**파일**: `backend/src/__tests__/admin.test.ts`  
**엔드포인트**: `/api/admin/*`  
**총 테스트 수**: 12개

### 4.1 GET /api/admin/orders

#### TC-ADMIN-001: 관리자 주문 목록 조회
- **목적**: 관리자가 모든 주문을 조회할 수 있는지 확인
- **전제조건**: 관리자 권한
- **입력 데이터**: 없음
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `orders` 배열 포함
- **검증 항목**:
  - ✅ `response.body.orders` 존재
  - ✅ `Array.isArray(response.body.orders) === true`

#### TC-ADMIN-002: 상태별 필터링 지원 확인
- **목적**: 주문 상태별 필터링 기능 확인
- **전제조건**: 관리자 권한
- **입력 데이터**: Query Parameters
  ```
  status=PENDING
  ```
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 모든 주문의 `status`가 `PENDING`
- **검증 항목**:
  - ✅ 모든 `order.status === "PENDING"`

#### TC-ADMIN-003: 페이지네이션 지원 확인
- **목적**: 페이지네이션 기능 확인
- **전제조건**: 관리자 권한
- **입력 데이터**: Query Parameters
  ```
  page=1&limit=20
  ```
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `pagination` 객체 포함
- **검증 항목**:
  - ✅ `response.body.pagination` 존재

### 4.2 PATCH /api/admin/orders/:id/status

#### TC-ADMIN-004: 주문 상태 업데이트
- **목적**: 관리자가 주문 상태를 변경할 수 있는지 확인
- **전제조건**: 관리자 권한, 유효한 주문 ID
- **입력 데이터**: Path Parameter + Request Body
  ```
  id: "test-order-id"
  {
    "status": "PREPARING"
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `order` 객체 포함
  - `order.status === "PREPARING"`
- **검증 항목**:
  - ✅ `response.body.order` 존재
  - ✅ `response.body.order.status === "PREPARING"`

#### TC-ADMIN-005: 잘못된 상태 값 시 400 에러
- **목적**: 상태 값 검증 확인
- **전제조건**: 관리자 권한
- **입력 데이터**: Path Parameter + Request Body
  ```
  id: "test-order-id"
  {
    "status": "INVALID_STATUS"
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 400 Bad Request
- **검증 항목**:
  - ✅ HTTP 상태 코드 400

#### TC-ADMIN-006: 존재하지 않는 주문 시 404 에러
- **목적**: 존재하지 않는 리소스 처리 확인
- **전제조건**: 관리자 권한
- **입력 데이터**: Path Parameter + Request Body
  ```
  id: "non-existent-order-id"
  {
    "status": "PREPARING"
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 404 Not Found
- **검증 항목**:
  - ✅ HTTP 상태 코드 404

### 4.3 POST /api/admin/menus

#### TC-ADMIN-007: 새 메뉴 생성
- **목적**: 관리자가 메뉴를 생성할 수 있는지 확인
- **전제조건**: 관리자 권한
- **입력 데이터**:
  ```json
  {
    "store_id": "test-store-id",
    "name": "Americano",
    "price": 4500,
    "status": "AVAILABLE"
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 201 Created
  - 응답 본문에 `menu` 객체 포함
- **검증 항목**:
  - ✅ `response.body.menu` 존재
  - ✅ `response.body.menu.name === "Americano"`
  - ✅ `response.body.menu.price === 4500`

#### TC-ADMIN-008: 필수 필드 누락 시 400 에러
- **목적**: 필수 필드 검증 확인
- **전제조건**: 관리자 권한
- **입력 데이터**:
  ```json
  {
    "name": "Americano"
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 400 Bad Request
- **검증 항목**:
  - ✅ HTTP 상태 코드 400

### 4.4 PATCH /api/admin/menus/:id

#### TC-ADMIN-009: 메뉴 정보 업데이트
- **목적**: 관리자가 메뉴를 수정할 수 있는지 확인
- **전제조건**: 관리자 권한, 유효한 메뉴 ID
- **입력 데이터**: Path Parameter + Request Body
  ```
  id: "test-menu-id"
  {
    "price": 5000,
    "status": "SOLD_OUT"
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `menu` 객체 포함
- **검증 항목**:
  - ✅ `response.body.menu.price === 5000`
  - ✅ `response.body.menu.status === "SOLD_OUT"`

#### TC-ADMIN-010: 존재하지 않는 메뉴 시 404 에러
- **목적**: 존재하지 않는 리소스 처리 확인
- **전제조건**: 관리자 권한
- **입력 데이터**: Path Parameter + Request Body
  ```
  id: "non-existent-menu-id"
  {
    "price": 5000
  }
  ```
- **예상 결과**:
  - HTTP 상태 코드: 404 Not Found
- **검증 항목**:
  - ✅ HTTP 상태 코드 404

### 4.5 GET /api/admin/dashboard

#### TC-ADMIN-011: 대시보드 데이터 조회
- **목적**: 대시보드 통계 데이터 조회 기능 확인
- **전제조건**: 관리자 권한
- **입력 데이터**: 없음
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `stats` 객체 포함
- **검증 항목**:
  - ✅ `response.body.stats` 존재
  - ✅ `response.body.stats.totalOrders` 존재
  - ✅ `response.body.stats.totalRevenue` 존재
  - ✅ `response.body.stats.todayOrders` 존재

#### TC-ADMIN-012: 피크 시간 데이터 조회
- **목적**: 피크 시간 분석 데이터 조회 기능 확인
- **전제조건**: 관리자 권한
- **입력 데이터**: 없음
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `peakHours` 배열 포함
- **검증 항목**:
  - ✅ `response.body.peakHours` 존재
  - ✅ `Array.isArray(response.body.peakHours) === true`

#### TC-ADMIN-013: 날짜 범위 필터링 지원 확인
- **목적**: 날짜 범위별 통계 조회 기능 확인
- **전제조건**: 관리자 권한
- **입력 데이터**: Query Parameters
  ```
  startDate=2025-12-01&endDate=2025-12-31
  ```
- **예상 결과**:
  - HTTP 상태 코드: 200 OK
  - 응답 본문에 `stats` 객체 포함
- **검증 항목**:
  - ✅ `response.body.stats` 존재

---

## 5. 통합 테스트

**파일**: `backend/src/__tests__/integration.test.ts`  
**총 테스트 수**: 1개

### 5.1 Complete Order Flow

#### TC-INTEGRATION-001: 전체 주문 플로우
- **목적**: 회원가입부터 주문 생성까지 전체 플로우 확인
- **전제조건**: 없음
- **테스트 시나리오**:
  1. **회원가입**
     - 입력: `{ name, phone, password }`
     - 예상: 201 Created, `user` 객체 반환
     - 저장: `userId`
  
  2. **로그인**
     - 입력: `{ phone, password }`
     - 예상: 200 OK, `token` 및 `user` 객체 반환
     - 저장: `authToken`
  
  3. **근처 매장 조회**
     - 입력: `latitude`, `longitude` (Query)
     - 예상: 200 OK, `stores` 배열 반환
     - 저장: `storeId` (첫 번째 매장)
  
  4. **매장 메뉴 조회**
     - 입력: `storeId` (Path)
     - 예상: 200 OK, `menus` 배열 반환
     - 저장: `menuId` (첫 번째 메뉴)
  
  5. **주문 생성**
     - 입력: `{ store_id, pickup_time, items }`
     - 예상: 201 Created, `order` 객체 반환
     - 검증: `order.user_id === userId`, `order.store_id === storeId`
- **검증 항목**:
  - ✅ 모든 단계가 순차적으로 성공
  - ✅ 주문이 올바른 사용자와 매장에 연결됨
  - ✅ 주문 ID가 생성됨

---

## 테스트 실행 방법

### 전체 테스트 실행

```bash
cd backend
npm test
```

### 특정 테스트 스위트 실행

```bash
# 인증 테스트만
npm test -- auth.test.ts

# 매장 테스트만
npm test -- stores.test.ts

# 주문 테스트만
npm test -- orders.test.ts

# 관리자 테스트만
npm test -- admin.test.ts

# 통합 테스트만
npm test -- integration.test.ts
```

### Watch 모드

```bash
npm run test:watch
```

### 커버리지 확인

```bash
npm run test:coverage
```

---

## 테스트 통계

| 카테고리 | 테스트 수 | 통과 | 실패 | 비고 |
|---------|----------|------|------|------|
| 인증 API | 6 | - | - | - |
| 매장 API | 5 | - | - | - |
| 주문 API | 12 | - | - | - |
| 관리자 API | 12 | - | - | - |
| 통합 테스트 | 1 | - | - | - |
| **총계** | **39** | **-** | **-** | **-** |

---

## 테스트 케이스 ID 체계

- **TC-AUTH-XXX**: 인증 API 테스트
- **TC-STORE-XXX**: 매장 API 테스트
- **TC-ORDER-XXX**: 주문 API 테스트
- **TC-ADMIN-XXX**: 관리자 API 테스트
- **TC-INTEGRATION-XXX**: 통합 테스트

---

## 업데이트 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2025-12-15 | 1.0 | 초기 테스트 케이스 문서 작성 |

---

**작성자**: OrderBean Team  
**검토자**: -  
**승인자**: -

