# API 문서

## 인증

### POST /api/auth/register
회원가입

### POST /api/auth/login
로그인

### POST /api/auth/logout
로그아웃

## 고객 API

### GET /api/stores/nearby
근처 매장 조회

### GET /api/stores/:id/menus
매장 메뉴 조회

### POST /api/orders
주문 생성

### GET /api/orders/:id
주문 상세 조회

### GET /api/users/me/orders
내 주문 목록

## 관리자 API

### GET /api/admin/orders
주문 목록 조회

### PATCH /api/admin/orders/:id/status
주문 상태 변경

### POST /api/admin/menus
메뉴 생성

### PATCH /api/admin/menus/:id
메뉴 수정

### GET /api/admin/dashboard
대시보드 데이터

