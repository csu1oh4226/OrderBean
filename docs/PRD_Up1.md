# PRD: OrderBean v1.0 (Python 기반)

## Document Info

- **작성자**: OrderBean Team
- **작성일**: 2025-12-15
- **최종 수정일**: 2025-12-15
- **버전**: 1.1
- **상태**: Draft
- **승인자**: PM / Tech Lead / Design Lead

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [목표 및 성공 지표](#2-목표-및-성공-지표)
3. [사용자 & 페르소나](#3-사용자--페르소나)
4. [사용자 스토리](#4-사용자-스토리)
5. [기능 명세](#5-기능-명세)
6. [UX/UI 설계](#6-uxui-설계)
7. [기술 사양](#7-기술-사양)
8. [API 개요](#8-api-개요)
9. [데이터 모델](#9-데이터-모델)
10. [비기능 요구사항](#10-비기능-요구사항)
11. [일정 및 마일스톤](#11-일정-및-마일스톤)
12. [리스크 & 의존성](#12-리스크--의존성)

---

## 1. Executive Summary

### 1.1 제품 개요

OrderBean은 바쁜 직장인을 위한 커피 주문 웹 서비스로, 카페 방문 시 발생하는 대기 시간·줄 서기·헛걸음 문제를 **사전 주문 + 픽업 시간 예약 + 실시간 준비 상태 제공** 방식으로 해결한다.

### 1.2 배경 및 필요성

#### 시장 기회

- 직장인 테이크아웃 커피 이용 빈도 증가
- 점심·회의 전후 시간 압박 심화

#### 사용자 문제 (Pain Point)

- 인기 카페 대기 시간 예측 불가
- 주문 후 언제 받을 수 있는지 알 수 없음

#### 기존 솔루션의 한계

- 카페 앱은 매장별로 분절
- 실시간 혼잡·제조 상황 반영 부족

### 1.3 핵심 가치

- **시간 절약**: 주문~픽업까지 소요 시간 최소화
- **예측 가능성**: 언제 받을 수 있는지 명확한 안내
- **운영 안정성**: 매장 제조 병목 방지

### 1.4 범위 (Scope)

#### In Scope

- ✅ 웹 기반 주문/픽업 시스템
- ✅ 실시간 주문 상태 관리
- ✅ 관리자 주문·메뉴 관리

#### Out of Scope

- ❌ 배달 서비스
- ❌ 멤버십/포인트
- ❌ 모바일 네이티브 앱 (Phase 2)

---

## 2. 목표 및 성공 지표

### 2.1 비즈니스 목표

- 런칭 3개월 내 MAU 5,000명
- 주문 완료율 85% 이상
- 재주문 사용자 비율 40% 이상

### 2.2 제품 목표

- 평균 대기 체감 시간 30% 감소
- 주문 완료까지 평균 클릭 수 3회 이하
- 피크 시간 주문 실패율 1% 이하

### 2.3 핵심 지표 (Key Metrics)

| 지표 | 목표 | 측정 방법 |
|------|------|-----------|
| MAU | 5,000 | GA |
| 주문 완료율 | ≥85% | 주문 로그 |
| 재주문율 | ≥40% | Cohort |
| 평균 픽업 지연 | <3분 | 주문/픽업 로그 |

---

## 3. 사용자 & 페르소나

### 3.1 타깃 사용자

#### Primary

- 25~45세 직장인
- 점심시간·회의 전후 테이크아웃 빈번

#### Secondary

- 팀 단위 주문 담당자
- 카페 매장 관리자 (점주)

### 3.2 Primary Persona

**이름**: 김현우 (34세)

**직업**: IT 회사 대리

**목표**: 점심시간 30분 내 커피 픽업

**고충**

- 줄 서는 시간 낭비
- 주문 후 대기 예측 불가

**구매 결정 요인**

- 빠른 주문
- 정확한 픽업 시간
- 사용 편의성

---

## 4. 사용자 스토리

### Epic E001: 빠른 주문

**As a** 바쁜 직장인  
**I want to** 최근 주문을 한 번에 다시 주문하고  
**So that** 주문 시간을 최소화할 수 있다

### Epic E002: 픽업 시간 관리

**As a** 사용자  
**I want to** 픽업 시간을 미리 선택하고  
**So that** 줄 서지 않고 바로 받을 수 있다

---

## 5. 기능 명세

### Feature F001: 빠른 주문 & 재주문

- **우선순위**: Must Have
- **설명**: 최근 주문/즐겨찾기 기반 1-클릭 주문
- **세부 기능**:
  - 최근 주문 내역 조회
  - 즐겨찾기 메뉴 관리
  - 옵션(당도/얼음/샷) 자동 기억
  - 1-클릭 재주문

### Feature F002: 픽업 시간 예약

- **우선순위**: Must Have
- **설명**: 결제 전 픽업 시간 선택 및 시간대별 주문 제한
- **세부 기능**:
  - 픽업 희망 시간 선택
  - 실시간 예상 준비 시간 표시
  - 시간대별 주문 상한 설정
  - 주문 상한 초과 시 예약 불가 처리

### Feature F003: 주문 상태 알림

- **우선순위**: Must Have
- **설명**: 접수→제조중→픽업가능 실시간 알림
- **세부 기능**:
  - 주문 상태 실시간 확인
  - 웹 푸시 알림 지원
  - SMS 알림 (선택)
  - 주문 상태 화면 제공

### Feature F004: 매장·메뉴 관리 (관리자)

- **우선순위**: Must Have
- **설명**: 메뉴, 품절, 영업시간, 주문 상한 관리
- **세부 기능**:
  - 메뉴/옵션/가격 관리
  - 품절 처리
  - 영업시간 설정
  - 제조 처리 용량 설정
  - 시간대별 주문 상한 설정

### Feature F005: 결제 & 이력 관리

- **우선순위**: Must Have
- **설명**: 간편결제 및 주문/환불 이력 관리
- **세부 기능**:
  - 간편결제 지원
  - 주문/결제/픽업 이력 조회
  - 환불 처리
  - 결제 정보 비저장 (보안)

---

## 6. UX/UI 설계

### 6.1 디자인 원칙

- **모바일 우선**: 모바일 환경 최적화
- **3-step 주문**: 주문 완료까지 최대 3단계
- **즉각적 피드백**: 모든 액션에 즉각적인 피드백 제공
- **불안 최소화**: 상태 가시성으로 사용자 불안 감소

### 6.2 주요 화면

1. **홈 화면**
   - 근처 매장 목록
   - 예상 준비 시간 표시
   - 혼잡도 인지

2. **메뉴/재주문 화면**
   - 메뉴 목록
   - 최근 주문 빠른 재주문
   - 즐겨찾기 메뉴

3. **장바구니 & 픽업 시간 화면**
   - 장바구니 내역
   - 픽업 시간 선택
   - 결제 진행

4. **주문 상태 화면**
   - 실시간 주문 상태
   - 예상 픽업 시간
   - 알림 설정

5. **관리자 대시보드**
   - 일별 주문 수/매출
   - 피크 시간대 분석
   - 주문 관리
   - 메뉴 관리

---

## 7. 기술 사양

### 7.1 기술 스택

#### 계층별 기술 스택

| 계층 | 사용 기술 | 설명 |
|------|----------|------|
| 프론트엔드 (UI) | React | 빠른 프로토타입 또는 완성형 웹 인터페이스 |
| 백엔드 (API) | FastAPI | 비동기 고성능 Python 웹 프레임워크 |
| 데이터베이스 | PostgreSQL | 안정적이고 ORM 기반의 DB 설계 |
| 인증/세션 | FastAPI Users, OAuth2 | 로그인, JWT 인증 |
| 테스트 | pytest | 단위/통합 테스트 |
| 문서화 | Swagger / ReDoc (FastAPI 자동 문서) | API 자동 문서 생성 |
| 배포/환경 | Render | 백엔드, DB, 프론트 통합 실행 환경 구성 |

### 7.2 프론트엔드 기술 스택

#### Core
- **Framework**: React
- **Language**: TypeScript (선택적)
- **Build Tool**: Vite 또는 Create React App
- **Package Manager**: npm 또는 yarn

#### UI/UX
- **Styling**: Tailwind CSS
- **Component Library**: React 컴포넌트 직접 구현 또는 Material-UI
- **Icons**: React Icons 또는 Heroicons

#### 상태 관리 & 데이터 페칭
- **State Management**: Zustand 또는 Redux Toolkit
- **Data Fetching**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios

#### 실시간 통신
- **WebSocket**: Socket.io-client

#### 폼 관리
- **Form Library**: React Hook Form
- **Validation**: Zod

#### 기타
- **Date Handling**: date-fns
- **Routing**: React Router (Vite 사용 시) 또는 Next.js Router

### 7.3 백엔드 기술 스택

#### Core
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **ASGI Server**: Uvicorn
- **Package Manager**: pip 또는 Poetry

#### 데이터베이스 & ORM
- **Database**: PostgreSQL 14+
- **ORM**: SQLAlchemy
- **Migration**: Alembic
- **Connection Pooling**: SQLAlchemy connection pool

#### 인증 & 보안
- **Authentication**: FastAPI Users
- **OAuth2**: OAuth2 with Password (and hashing), Bearer with JWT tokens
- **Password Hashing**: passlib[bcrypt]
- **JWT**: python-jose[cryptography]
- **CORS**: fastapi-cors 또는 Starlette CORS

#### 데이터 검증
- **Validation**: Pydantic
- **Serialization**: Pydantic models

#### 실시간 통신
- **WebSocket**: FastAPI WebSocket support

#### 기타 라이브러리
- **Environment Variables**: python-dotenv
- **Date/Time**: python-dateutil
- **HTTP Client**: httpx (테스트용)

### 7.4 데이터베이스

#### 주 데이터베이스
- **Database**: PostgreSQL 14+
- **ORM**: SQLAlchemy
- **Migration Tool**: Alembic
- **Connection**: SQLAlchemy connection pool

#### 데이터베이스 설계 원칙
- **안정성**: ACID 트랜잭션 보장
- **ORM 기반**: SQLAlchemy를 통한 타입 안전한 쿼리
- **마이그레이션**: Alembic을 통한 버전 관리
- **인덱싱**: 성능 최적화를 위한 적절한 인덱스

### 7.5 인증/세션

#### 인증 시스템
- **Framework**: FastAPI Users
- **Protocol**: OAuth2
- **Token**: JWT (JSON Web Token)
- **Password Hashing**: bcrypt (passlib)

#### 기능
- 사용자 등록/로그인
- JWT 토큰 기반 인증
- OAuth2 표준 준수
- 토큰 갱신 (Refresh Token)
- 비밀번호 재설정

### 7.6 테스트

#### 테스트 프레임워크
- **Framework**: pytest
- **Test Types**: 
  - 단위 테스트 (Unit Tests)
  - 통합 테스트 (Integration Tests)
  - API 테스트

#### 테스트 도구
- **HTTP Client**: httpx (FastAPI 테스트용)
- **Fixtures**: pytest fixtures
- **Coverage**: pytest-cov
- **Mocking**: unittest.mock 또는 pytest-mock

### 7.7 문서화

#### API 문서
- **Swagger UI**: FastAPI 자동 생성 (`/docs`)
- **ReDoc**: FastAPI 자동 생성 (`/redoc`)
- **OpenAPI Schema**: 자동 생성 (`/openapi.json`)

#### 코드 문서
- **Docstrings**: Google style 또는 NumPy style
- **Type Hints**: Python type hints 활용

### 7.8 배포/환경

#### 배포 플랫폼
- **Platform**: Render
- **Services**:
  - Web Service (백엔드)
  - PostgreSQL Database
  - Static Site (프론트엔드)

#### Render 구성
- **백엔드**: FastAPI Web Service
- **데이터베이스**: Render PostgreSQL
- **프론트엔드**: Render Static Site
- **환경 변수**: Render 환경 변수 관리
- **자동 배포**: GitHub 연동

#### CI/CD
- **GitHub Actions**: 자동 테스트 및 배포 (선택적)
- **Render Auto-Deploy**: GitHub push 시 자동 배포

---

## 8. API 개요

### 8.1 고객 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/stores/nearby` | 근처 매장 조회 |
| GET | `/api/v1/stores/{id}/menus` | 매장 메뉴 조회 |
| POST | `/api/v1/orders` | 주문 생성 |
| GET | `/api/v1/orders/{id}` | 주문 상세 조회 |
| GET | `/api/v1/users/me/orders` | 내 주문 목록 |

### 8.2 관리자 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/orders` | 주문 목록 조회 |
| PATCH | `/api/v1/admin/orders/{id}/status` | 주문 상태 변경 |
| POST | `/api/v1/admin/menus` | 메뉴 생성 |
| PATCH | `/api/v1/admin/menus/{id}` | 메뉴 수정 |
| GET | `/api/v1/admin/dashboard` | 대시보드 데이터 |

### 8.3 인증 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | 회원가입 |
| POST | `/api/v1/auth/login` | 로그인 |
| POST | `/api/v1/auth/logout` | 로그아웃 |
| POST | `/api/v1/auth/refresh` | 토큰 갱신 |

### 8.4 API 문서

- **Swagger UI**: `https://your-domain.com/docs`
- **ReDoc**: `https://your-domain.com/redoc`
- **OpenAPI Schema**: `https://your-domain.com/openapi.json`

---

## 9. 데이터 모델

### 9.1 주요 엔터티

#### User
- `user_id` (PK, UUID)
- `name` (String)
- `phone` (String, Unique)
- `email` (String, Unique, Optional)
- `password` (String, Hashed)
- `role` (Enum: CUSTOMER, ADMIN)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### Store
- `store_id` (PK, UUID)
- `name` (String)
- `location` (String, Format: "latitude,longitude")
- `opening_hours` (String)
- `max_orders_per_slot` (Integer)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### Menu
- `menu_id` (PK, UUID)
- `store_id` (FK)
- `name` (String)
- `price` (Decimal)
- `status` (Enum: AVAILABLE, SOLD_OUT)
- `description` (String, Optional)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### Order
- `order_id` (PK, UUID)
- `user_id` (FK)
- `store_id` (FK)
- `pickup_time` (DateTime)
- `status` (Enum: PENDING, RECEIVED, PREPARING, READY, COMPLETED, CANCELLED)
- `total_price` (Decimal)
- `created_at` (DateTime)
- `updated_at` (DateTime)

#### OrderItem
- `order_item_id` (PK, UUID)
- `order_id` (FK)
- `menu_id` (FK)
- `quantity` (Integer)
- `options` (JSON)
- `price` (Decimal)
- `created_at` (DateTime)

#### Payment
- `payment_id` (PK, UUID)
- `order_id` (FK)
- `method` (Enum: CARD, ACCOUNT, MOBILE)
- `status` (Enum: PENDING, COMPLETED, FAILED, REFUNDED)
- `amount` (Decimal)
- `transaction_id` (String, Optional)
- `created_at` (DateTime)
- `updated_at` (DateTime)

### 9.2 관계

- User 1:N Order
- Store 1:N Menu
- Store 1:N Order
- Order 1:N OrderItem
- Order 1:1 Payment
- Menu 1:N OrderItem

### 9.3 데이터베이스 설계 원칙

- **UUID 사용**: 모든 Primary Key는 UUID 사용
- **타임스탬프**: created_at, updated_at 자동 관리
- **Soft Delete**: 삭제 시 deleted_at 사용 (선택적)
- **인덱싱**: 자주 조회되는 필드에 인덱스 생성
- **제약 조건**: Foreign Key, Unique 제약 조건 활용

---

## 10. 비기능 요구사항

### 10.1 성능

- **주문 API**: P95 < 700ms
- **페이지 로딩**: 초기 로딩 < 2초
- **실시간 알림**: 지연 < 1초
- **데이터베이스 쿼리**: 최적화된 쿼리 및 인덱싱

### 10.2 보안

- **HTTPS**: 모든 통신 암호화
- **결제정보**: 비저장 (PG 연동)
- **관리자**: MFA (Multi-Factor Authentication, Phase 2)
- **인증**: JWT 기반 인증 (FastAPI Users)
- **CORS**: 적절한 CORS 설정
- **Rate Limiting**: API 요청 제한

### 10.3 확장성

- **멀티 매장**: 프랜차이즈 대응 구조
- **수평 확장**: Render 오토스케일링 활용
- **데이터베이스**: 연결 풀링 및 쿼리 최적화

### 10.4 사용성

- **모바일**: 3-step 주문 완료
- **접근성**: WCAG 2.1 AA 준수 (선택적)
- **반응형**: 모바일/태블릿/데스크톱 지원

### 10.5 가용성

- **업타임**: 99.5% 이상 (Render SLA)
- **장애 복구**: RTO < 1시간
- **데이터 백업**: Render 자동 백업 활용

### 10.6 개발 생산성

- **자동 문서화**: FastAPI Swagger/ReDoc
- **타입 안정성**: Python type hints, Pydantic
- **테스트**: pytest 기반 체계적 테스트

---

## 11. 일정 및 마일스톤

### Phase 1: 설계 및 기획 (Week 1-2)

- [ ] PRD 최종 승인
- [ ] UX/UI 디자인 완료
- [ ] 기술 스택 확정 (Python + FastAPI + React + Render)
- [ ] API 명세서 작성
- [ ] 데이터베이스 스키마 설계

### Phase 2: 핵심 기능 개발 (Week 3-6)

- [ ] Week 3: FastAPI 프로젝트 구조 및 인증 시스템
- [ ] Week 4: 매장/메뉴 조회 및 주문 생성 API
- [ ] Week 5: 픽업 시간 예약 및 주문 상태 관리
- [ ] Week 6: 관리자 기능 및 실시간 알림 시스템

### Phase 3: 프론트엔드 개발 (Week 7-8)

- [ ] Week 7: React 컴포넌트 및 페이지 구현
- [ ] Week 8: API 연동 및 상태 관리

### Phase 4: QA 및 테스트 (Week 9)

- [ ] 단위 테스트 (pytest)
- [ ] 통합 테스트
- [ ] 사용자 테스트
- [ ] 성능 테스트
- [ ] 보안 테스트

### Phase 5: 배포 및 베타 런칭 (Week 10)

- [ ] Render 환경 설정
- [ ] 데이터베이스 마이그레이션
- [ ] 베타 환경 배포
- [ ] 베타 사용자 모집
- [ ] 피드백 수집 및 개선

---

## 12. 리스크 & 의존성

### 12.1 기술적 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 결제 PG 장애 | 높음 | 다중 PG 연동, 장애 시 수동 처리 프로세스 |
| 피크 타임 주문 폭주 | 높음 | Render 오토스케일링, 큐 시스템 도입 |
| 실시간 알림 지연 | 중간 | WebSocket + 폴링 하이브리드 |
| FastAPI 학습 곡선 | 중간 | 체계적 학습 및 문서화 |

### 12.2 비즈니스 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 매장 운영 숙련도 차이 | 중간 | 매장 교육 프로그램, 간단한 UI/UX |
| 사용자 채택률 저조 | 높음 | 초기 프로모션, 사용자 온보딩 강화 |
| 경쟁 서비스 출현 | 중간 | 차별화된 기능 강화, 빠른 반복 개발 |

### 12.3 의존성

- **결제 PG**: 외부 결제 게이트웨이 연동 필수
- **SMS 서비스**: 알림 발송을 위한 SMS Gateway (선택적)
- **매장 협력**: 실제 매장과의 파트너십 필요
- **인프라**: Render 플랫폼 의존

### 12.4 기술 스택 의존성

- **Python 3.11+**: 최신 Python 기능 활용
- **FastAPI**: 활발한 커뮤니티 및 문서
- **PostgreSQL**: 안정적인 관계형 데이터베이스
- **React**: 널리 사용되는 프론트엔드 라이브러리
- **Render**: 통합 배포 플랫폼

---

## 13. 프로젝트 구조

### 13.1 디렉토리 구조

```
OrderBean/
├── frontend/              # React 프론트엔드
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # API 클라이언트
│   │   ├── store/         # 상태 관리 (Zustand)
│   │   ├── types/         # TypeScript 타입
│   │   └── utils/         # 유틸리티 함수
│   ├── public/            # 정적 파일
│   ├── package.json
│   └── vite.config.ts     # 또는 next.config.js
│
├── backend/               # FastAPI 백엔드
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py        # FastAPI 앱 진입점
│   │   ├── config.py      # 설정 관리
│   │   ├── database.py    # 데이터베이스 연결
│   │   ├── models/        # SQLAlchemy 모델
│   │   │   ├── user.py
│   │   │   ├── store.py
│   │   │   ├── menu.py
│   │   │   ├── order.py
│   │   │   └── payment.py
│   │   ├── schemas/       # Pydantic 스키마
│   │   │   ├── user.py
│   │   │   ├── store.py
│   │   │   ├── menu.py
│   │   │   ├── order.py
│   │   │   └── payment.py
│   │   ├── api/           # API 라우터
│   │   │   ├── v1/
│   │   │   │   ├── auth.py
│   │   │   │   ├── stores.py
│   │   │   │   ├── orders.py
│   │   │   │   └── admin.py
│   │   ├── services/      # 비즈니스 로직
│   │   │   ├── auth_service.py
│   │   │   ├── order_service.py
│   │   │   └── admin_service.py
│   │   ├── utils/         # 유틸리티
│   │   │   ├── validation.py
│   │   │   └── helpers.py
│   │   └── dependencies.py
│   ├── alembic/           # 데이터베이스 마이그레이션
│   │   ├── versions/
│   │   └── env.py
│   ├── tests/             # 테스트
│   │   ├── test_auth.py
│   │   ├── test_orders.py
│   │   └── conftest.py
│   ├── requirements.txt   # Python 의존성
│   ├── pyproject.toml     # 프로젝트 설정
│   └── Dockerfile
│
├── database/              # 데이터베이스 관련
│   └── migrations/        # 마이그레이션 파일
│
├── docs/                  # 문서
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── PRD_Up1.md
│
├── docker-compose.yml     # Docker Compose 설정
├── .env.example           # 환경 변수 예제
├── .gitignore
└── README.md
```

---

## 14. 개발 워크플로우

### 14.1 로컬 개발 환경

1. **Python 가상 환경 설정**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate     # Windows
   ```

2. **의존성 설치**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **데이터베이스 설정**
   ```bash
   alembic upgrade head
   ```

4. **개발 서버 실행**
   ```bash
   uvicorn app.main:app --reload
   ```

### 14.2 프론트엔드 개발

1. **의존성 설치**
   ```bash
   cd frontend
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```

### 14.3 테스트 실행

```bash
cd backend
pytest
pytest --cov=app --cov-report=html
```

---

## 15. 배포 전략

### 15.1 Render 배포

#### 백엔드 배포
- **Service Type**: Web Service
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Environment**: Python 3.11

#### 프론트엔드 배포
- **Service Type**: Static Site
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist` 또는 `build`

#### 데이터베이스
- **Service Type**: PostgreSQL
- **Version**: 14+
- **Backup**: 자동 백업 설정

### 15.2 환경 변수 관리

Render 환경 변수 설정:
- `DATABASE_URL`
- `SECRET_KEY`
- `ALGORITHM`
- `CORS_ORIGINS`
- 기타 환경별 설정

---

## 16. 참고 자료

### 공식 문서

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [SQLAlchemy 공식 문서](https://docs.sqlalchemy.org/)
- [FastAPI Users 공식 문서](https://fastapi-users.github.io/fastapi-users/)
- [React 공식 문서](https://react.dev/)
- [Render 공식 문서](https://render.com/docs)
- [pytest 공식 문서](https://docs.pytest.org/)

### 학습 자료

- FastAPI 튜토리얼
- SQLAlchemy 가이드
- React 베스트 프랙티스
- pytest 가이드

---

**작성 완료일**: 2025-12-15  
**다음 검토**: 기술 스택 확정 후

