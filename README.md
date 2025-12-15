# PRD: OrderBean v1.0

## Document Info

- **작성자**: (기입)
- **작성일**: 2025-XX-XX
- **최종 수정일**: 2025-XX-XX
- **버전**: 1.0
- **상태**: Draft
- **승인자**: PM / Tech Lead / Design Lead

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

#### Frontend
- **Framework**: Next.js
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query / Zustand
- **알림**: Web Push API

#### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Language**: TypeScript
- **Real-time**: WebSocket (Socket.io)

#### Database
- **주 데이터베이스**: PostgreSQL
- **캐싱**: Redis
- **ORM**: Prisma / TypeORM

#### Infrastructure
- **Cloud**: AWS
- **CDN**: CloudFront
- **CI/CD**: GitHub Actions
- **Container**: Docker & Docker Compose

#### 알림
- **Web Push**: Web Push API
- **SMS**: SMS Gateway (선택)

---

## 8. API 개요

### 8.1 고객 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stores/nearby` | 근처 매장 조회 |
| GET | `/api/stores/{id}/menus` | 매장 메뉴 조회 |
| POST | `/api/orders` | 주문 생성 |
| GET | `/api/orders/{id}` | 주문 상세 조회 |
| GET | `/api/users/me/orders` | 내 주문 목록 |
| POST | `/api/cart/add` | 장바구니에 추가 |

### 8.2 관리자 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/orders` | 주문 목록 조회 |
| PATCH | `/api/admin/orders/{id}/status` | 주문 상태 변경 |
| POST | `/api/admin/menus` | 메뉴 생성 |
| PATCH | `/api/admin/menus/{id}` | 메뉴 수정 |
| GET | `/api/admin/dashboard` | 대시보드 데이터 |

### 8.3 인증 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | 로그인 |
| POST | `/api/auth/logout` | 로그아웃 |
| POST | `/api/auth/register` | 회원가입 |

---

## 9. 데이터 모델

### 9.1 주요 엔터티

#### User
- `user_id` (PK)
- `name`
- `phone`
- `role` (CUSTOMER / ADMIN)
- `created_at`

#### Store
- `store_id` (PK)
- `name`
- `location`
- `opening_hours`
- `max_orders_per_slot`

#### Menu
- `menu_id` (PK)
- `store_id` (FK)
- `name`
- `price`
- `status` (AVAILABLE / SOLD_OUT)

#### Order
- `order_id` (PK)
- `user_id` (FK)
- `store_id` (FK)
- `pickup_time`
- `status`
- `total_price`
- `created_at`

#### OrderItem
- `order_item_id` (PK)
- `order_id` (FK)
- `menu_id` (FK)
- `options`
- `quantity`

#### Payment
- `payment_id` (PK)
- `order_id` (FK)
- `method`
- `status`
- `amount`

### 9.2 관계

- User 1:N Order
- Store 1:N Menu
- Store 1:N Order
- Order 1:N OrderItem
- Order 1:1 Payment

---

## 10. 비기능 요구사항

### 10.1 성능

- **주문 API**: P95 < 700ms
- **페이지 로딩**: 초기 로딩 < 2초
- **실시간 알림**: 지연 < 1초

### 10.2 보안

- **HTTPS**: 모든 통신 암호화
- **결제정보**: 비저장 (PG 연동)
- **관리자**: MFA (Multi-Factor Authentication)
- **인증**: JWT 기반 인증

### 10.3 확장성

- **멀티 매장**: 프랜차이즈 대응 구조
- **수평 확장**: 로드 밸런싱 지원
- **데이터베이스**: 샤딩 준비

### 10.4 사용성

- **모바일**: 3-step 주문 완료
- **접근성**: WCAG 2.1 AA 준수
- **반응형**: 모바일/태블릿/데스크톱 지원

### 10.5 가용성

- **업타임**: 99.5% 이상
- **장애 복구**: RTO < 1시간
- **데이터 백업**: 일일 자동 백업

---

## 11. 일정 및 마일스톤

### Phase 1: 설계 및 기획 (Week 1-2)

- [ ] PRD 최종 승인
- [ ] UX/UI 디자인 완료
- [ ] 기술 스택 확정
- [ ] API 명세서 작성

### Phase 2: 핵심 기능 개발 (Week 3-6)

- [ ] Week 3: 인증 및 사용자 관리
- [ ] Week 4: 매장/메뉴 조회 및 주문 생성
- [ ] Week 5: 픽업 시간 예약 및 주문 상태 관리
- [ ] Week 6: 관리자 기능 및 알림 시스템

### Phase 3: QA 및 테스트 (Week 7)

- [ ] 단위 테스트
- [ ] 통합 테스트
- [ ] 사용자 테스트
- [ ] 성능 테스트
- [ ] 보안 테스트

### Phase 4: 베타 런칭 (Week 8)

- [ ] 베타 환경 배포
- [ ] 베타 사용자 모집
- [ ] 피드백 수집 및 개선
- [ ] 정식 런칭 준비

---

## 12. 리스크 & 의존성

### 12.1 기술적 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 결제 PG 장애 | 높음 | 다중 PG 연동, 장애 시 수동 처리 프로세스 |
| 피크 타임 주문 폭주 | 높음 | 오토스케일링, 큐 시스템 도입 |
| 실시간 알림 지연 | 중간 | WebSocket + 폴링 하이브리드 |

### 12.2 비즈니스 리스크

| 리스크 | 영향도 | 대응 방안 |
|--------|--------|-----------|
| 매장 운영 숙련도 차이 | 중간 | 매장 교육 프로그램, 간단한 UI/UX |
| 사용자 채택률 저조 | 높음 | 초기 프로모션, 사용자 온보딩 강화 |
| 경쟁 서비스 출현 | 중간 | 차별화된 기능 강화, 빠른 반복 개발 |

### 12.3 의존성

- **결제 PG**: 외부 결제 게이트웨이 연동 필수
- **SMS 서비스**: 알림 발송을 위한 SMS Gateway
- **매장 협력**: 실제 매장과의 파트너십 필요
- **인프라**: AWS 등 클라우드 인프라 의존

---

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

---

Made with ☕ by OrderBean Team
