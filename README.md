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

----

## Refactoring TODO

이 섹션은 코드 품질 개선을 위한 리팩토링 작업을 추적합니다. 자세한 분석은 [`docs/CODE_SMELLS_AND_SOLID_VIOLATIONS.md`](./docs/CODE_SMELLS_AND_SOLID_VIOLATIONS.md)를 참조하세요.

### Definition of Done (완료 기준)

각 리팩토링 항목은 다음 기준을 모두 만족해야 완료로 간주됩니다:

1. **코드 변경**
   - ✅ 리팩토링 기법이 올바르게 적용됨
   - ✅ 기존 기능이 정상 동작함 (회귀 테스트 통과)
   - ✅ 타입 안정성이 향상됨 (TypeScript 에러 없음)

2. **테스트**
   - ✅ 기존 테스트가 모두 통과함
   - ✅ 새로운 테스트가 추가됨 (필요한 경우)
   - ✅ 테스트 커버리지가 유지되거나 향상됨

3. **코드 리뷰**
   - ✅ PR이 생성되고 리뷰를 받음
   - ✅ 리뷰 피드백이 반영됨
   - ✅ 메인 브랜치에 머지됨

4. **문서화**
   - ✅ 변경 사항이 커밋 메시지에 명확히 기록됨
   - ✅ 주요 변경 사항이 문서에 반영됨 (필요한 경우)

---

### High Priority (즉시 해결 필요)

#### 긴 함수 분리

- [ ] **#1** `backend/src/controllers/orderController.ts:createOrder` (128줄)
  - [ ] Service Layer 도입하여 비즈니스 로직 분리
  - [ ] 검증 로직을 별도 함수로 추출
  - [ ] 트랜잭션 처리를 서비스 레이어로 이동
  - [ ] 단위 테스트 추가
  - **완료 기준**: 함수 길이 50줄 이하, 각 책임이 명확히 분리됨

- [ ] **#2** `backend/src/controllers/adminController.ts:getDashboard` (68줄)
  - [ ] 통계 계산 로직을 별도 함수로 추출
  - [ ] 피크 시간 분석 로직을 별도 함수로 추출
  - [ ] Service Layer로 이동
  - [ ] 단위 테스트 추가
  - **완료 기준**: 함수 길이 30줄 이하, 각 책임이 명확히 분리됨

#### 중복 코드 제거

- [ ] **#4** 가격 계산 로직 통합 (3곳)
  - [ ] `frontend/src/utils/priceCalculator.ts` 생성
  - [ ] `MenuCard.calculatePrice`, `ShoppingCart.calculateItemPrice`, `cartStore.getTotal`에서 공통 함수 사용
  - [ ] 단위 테스트 추가
  - **완료 기준**: 가격 계산 로직이 단일 소스에서 관리됨, 모든 테스트 통과

- [ ] **#5** 샷 가격 상수화 (4곳)
  - [ ] `frontend/src/constants/prices.ts` 생성
  - [ ] `SHOT_PRICE = 500` 상수 정의
  - [ ] 모든 하드코딩된 값 제거
  - **완료 기준**: 샷 가격이 상수로 관리됨, 하드코딩된 값 없음

- [ ] **#7** 타입 정의 통합
  - [ ] `frontend/src/types/index.ts`에 모든 공통 타입 정의
  - [ ] `Menu`, `CartItem`, `Order` 등 중복 제거
  - [ ] 모든 파일에서 중앙 타입 사용
  - **완료 기준**: 타입 정의 중복 없음, 모든 파일이 중앙 타입 사용

#### 타입 안정성 향상

- [ ] **#19** `any` 타입 제거 (11곳)
  - [ ] `MenuCardProps.onAddToCart`의 `any` 타입을 구체적 타입으로 변경
  - [ ] `ShoppingCartProps`의 `options: any`를 구체적 타입으로 변경
  - [ ] `cartStore`의 `any` 타입 제거
  - [ ] `admin-api.ts`, `order-api.ts`의 `any` 타입 제거
  - [ ] 모든 컨트롤러의 `any` 타입 제거
  - **완료 기준**: `any` 타입 사용 0개, TypeScript strict 모드 통과

#### 에러 처리 표준화

- [ ] **#21** 프론트엔드/백엔드 에러 처리 일관성
  - [ ] 공통 에러 응답 형식 정의
  - [ ] 프론트엔드 에러 핸들러 구현
  - [ ] 백엔드 에러 핸들러 개선
  - [ ] 에러 타입 정의
  - **완료 기준**: 일관된 에러 응답 형식, 모든 에러가 적절히 처리됨

- [ ] **#22** 네트워크 에러 처리
  - [ ] Error Boundary 구현
  - [ ] API 호출 재시도 로직 추가
  - [ ] 사용자 친화적 에러 메시지 표시
  - [ ] 오프라인 상태 감지
  - **완료 기준**: 네트워크 에러 시 적절한 처리, 사용자 경험 개선

#### 의존성 역전

- [ ] **#25** Repository Pattern 도입
  - [ ] `backend/src/repositories/` 디렉토리 생성
  - [ ] `OrderRepository`, `MenuRepository`, `StoreRepository` 구현
  - [ ] 모든 컨트롤러가 Repository 사용하도록 변경
  - [ ] Prisma 의존성 제거
  - [ ] 단위 테스트 추가
  - **완료 기준**: 컨트롤러가 Prisma에 직접 의존하지 않음, Repository 테스트 통과

- [ ] **#26** 데이터 페칭 로직 분리
  - [ ] `useMenus`, `useOrders`, `useAdmin` 커스텀 훅 생성
  - [ ] `OrderPage`, `AdminDashboard`에서 하드코딩된 데이터 제거
  - [ ] React Query 적용
  - [ ] 로딩 및 에러 상태 처리
  - **완료 기준**: 모든 페이지가 API를 통해 데이터를 가져옴, 하드코딩된 데이터 없음

#### SOLID 원칙 준수

- [ ] **#30, #31** SRP 위반 해결 (Service Layer)
  - [ ] `backend/src/services/` 디렉토리 생성
  - [ ] `OrderService`, `AdminService`, `StoreService` 구현
  - [ ] 컨트롤러는 요청/응답 처리만 담당
  - [ ] 비즈니스 로직은 서비스 레이어로 이동
  - **완료 기준**: 각 클래스가 단일 책임만 가짐, 테스트 가능성 향상

- [ ] **#38, #39** ISP 위반 해결 (인터페이스 명확화)
  - [ ] `MenuCardProps.onAddToCart` 타입 정의
  - [ ] `ShoppingCartProps` 타입 정의
  - [ ] 모든 `any` 타입을 구체적 타입으로 변경
  - **완료 기준**: 모든 인터페이스가 명확한 타입을 가짐

- [ ] **#40** DIP 위반 해결 (의존성 역전)
  - [ ] Repository 인터페이스 정의
  - [ ] Service가 Repository 인터페이스에 의존
  - [ ] Dependency Injection 적용
  - **완료 기준**: 고수준 모듈이 저수준 모듈에 의존하지 않음

---

### Medium Priority (단기간 내 해결)

#### 긴 함수 분리

- [ ] **#3** `frontend/src/components/MenuCard.tsx:getCoffeeImageUrl` (23줄)
  - [ ] 이미지 URL 매핑을 설정 객체로 분리
  - [ ] Strategy Pattern 적용
  - [ ] `frontend/src/constants/images.ts` 생성
  - **완료 기준**: if-else 체인 제거, 새로운 메뉴 추가 시 설정만 변경

#### 중복 코드 제거

- [ ] **#6** localStorage 저장 로직 통합
  - [ ] `cartStore`에서 localStorage 동기화 로직을 별도 함수로 추출
  - [ ] Side Effect 분리
  - [ ] 테스트 가능성 향상
  - **완료 기준**: localStorage 저장 로직이 단일 함수에서 관리됨

- [ ] **#8** 에러 처리 패턴 통합
  - [ ] 공통 에러 처리 래퍼 함수 생성
  - [ ] AOP 적용 (선택사항)
  - [ ] 모든 컨트롤러에 적용
  - **완료 기준**: 에러 처리 패턴이 일관됨, 중복 코드 제거

- [ ] **#9** 옵션 비교 로직 통합
  - [ ] `compareOptions` 유틸 함수 생성
  - [ ] Value Object 패턴 적용 (선택사항)
  - [ ] 모든 위치에서 공통 함수 사용
  - **완료 기준**: 옵션 비교 로직이 단일 함수에서 관리됨

#### 매직 넘버 제거

- [ ] **#12** 시간 관련 상수화
  - [ ] `60 * 60 * 1000` (1시간) 상수 정의
  - [ ] `backend/src/constants/time.ts` 생성
  - **완료 기준**: 시간 관련 매직 넘버 없음

- [ ] **#13** 페이지네이션 기본값 상수화
  - [ ] `1, 10, 20` 상수 정의
  - [ ] `backend/src/constants/pagination.ts` 생성
  - **완료 기준**: 페이지네이션 기본값이 상수로 관리됨

#### 의미없는 이름 개선

- [ ] **#16** 제네릭한 변수명 개선
  - [ ] `id` → `orderId`, `menuId` 등 구체적 이름으로 변경
  - [ ] `delta` → `quantityChange` 등 의미있는 이름으로 변경
  - [ ] `item` → `cartItem`, `menuItem` 등 구체적 이름으로 변경
  - [ ] `prev` → `previousItems` 등 의미있는 이름으로 변경
  - **완료 기준**: 모든 변수명이 의미를 명확히 전달함

#### 예외 처리 개선

- [ ] **#20** `alert()` 대체
  - [ ] Toast 알림 시스템 도입
  - [ ] 또는 Modal 컴포넌트 사용
  - [ ] `OrderPage:100`의 `alert()` 제거
  - **완료 기준**: `alert()` 사용 없음, 사용자 경험 개선

- [ ] **#24** Prisma 에러 처리 개선
  - [ ] 모든 Prisma 에러 타입 처리
  - [ ] 에러 핸들러에 Prisma 에러 케이스 추가
  - [ ] 사용자 친화적 에러 메시지
  - **완료 기준**: 모든 Prisma 에러가 적절히 처리됨

#### 의존성 개선

- [ ] **#27** API 클라이언트 의존성 개선
  - [ ] localStorage 의존성을 Dependency Injection으로 변경
  - [ ] 테스트 가능성 향상
  - **완료 기준**: API 클라이언트가 localStorage에 직접 의존하지 않음

- [ ] **#29** 거리 계산 로직 분리
  - [ ] `backend/src/services/distanceService.ts` 생성
  - [ ] Haversine 공식 구현
  - [ ] 컨트롤러에서 서비스 사용
  - **완료 기준**: 거리 계산 로직이 서비스 레이어로 분리됨

#### SOLID 원칙 준수

- [ ] **#32** `MenuCard` 컴포넌트 책임 분리
  - [ ] `useMenuOptions` 커스텀 훅 생성
  - [ ] 이미지 URL 로직을 유틸 함수로 분리
  - [ ] 가격 계산 로직을 유틸 함수로 분리
  - **완료 기준**: 컴포넌트가 UI 렌더링만 담당

- [ ] **#33** `ShoppingCart` 컴포넌트 책임 분리
  - [ ] 가격 계산 로직을 유틸 함수로 분리
  - [ ] 아이템 표시 로직을 서브 컴포넌트로 분리
  - **완료 기준**: 컴포넌트가 UI 렌더링만 담당

- [ ] **#34** `cartStore` 책임 분리
  - [ ] localStorage 동기화를 별도 모듈로 분리
  - [ ] 가격 계산을 유틸 함수로 분리
  - [ ] 상태 관리만 담당
  - **완료 기준**: 각 책임이 명확히 분리됨

- [ ] **#35** OCP 위반 해결 (`getCoffeeImageUrl`)
  - [ ] Strategy Pattern 적용
  - [ ] 설정 객체로 이미지 URL 관리
  - [ ] 새로운 메뉴 추가 시 설정만 변경
  - **완료 기준**: 함수 수정 없이 새로운 메뉴 추가 가능

- [ ] **#41** DIP 위반 해결 (`api.ts`)
  - [ ] localStorage 의존성을 Dependency Injection으로 변경
  - [ ] 테스트 가능성 향상
  - **완료 기준**: API 클라이언트가 localStorage에 직접 의존하지 않음

---

### Low Priority (여유 있을 때 개선)

#### 매직 넘버 제거

- [ ] **#11** setTimeout 상수화
  - [ ] `500` (ms) 상수 정의
  - [ ] `frontend/src/constants/delays.ts` 생성
  - **완료 기준**: setTimeout 값이 상수로 관리됨

- [ ] **#14** HTTP 상태 코드 상수화
  - [ ] `400, 404, 403` 등 상수 정의
  - [ ] `backend/src/constants/httpStatus.ts` 생성
  - **완료 기준**: HTTP 상태 코드가 상수로 관리됨

- [ ] **#15** 임시 매장 ID 제거
  - [ ] 환경 변수 또는 설정으로 관리
  - [ ] `OrderPage:21`의 하드코딩 제거
  - **완료 기준**: 임시 ID가 설정으로 관리됨

#### 의미없는 이름 개선

- [ ] **#17** `tx` → `transaction` 변경
  - [ ] `orderController.ts:82`의 변수명 개선
  - **완료 기준**: 변수명이 의미를 명확히 전달함

- [ ] **#18** `lat`, `lng` → `latitude`, `longitude` 변경
  - [ ] `storeController.ts:18-19`의 변수명 개선
  - **완료 기준**: 변수명이 의미를 명확히 전달함

#### 예외 처리 개선

- [ ] **#23** 이미지 로드 실패 처리 개선
  - [ ] 로딩 상태 표시
  - [ ] 재시도 로직 추가
  - [ ] 사용자 친화적 메시지
  - **완료 기준**: 이미지 로드 실패 시 적절한 처리

#### 의존성 개선

- [ ] **#28** 전역 상태 의존성 개선
  - [ ] Props Drilling 또는 Context 적용
  - [ ] 컴포넌트 간 결합도 감소
  - **완료 기준**: 전역 상태 의존성이 적절히 관리됨

#### SOLID 원칙 준수

- [ ] **#36** 에러 핸들러 확장성 개선
  - [ ] Strategy Pattern 적용
  - [ ] Chain of Responsibility 패턴 적용
  - [ ] 새로운 에러 타입 추가 시 수정 최소화
  - **완료 기준**: 에러 핸들러가 확장 가능한 구조

---

## 진행 상황 추적

- **High Priority**: 0/15 완료
- **Medium Priority**: 0/15 완료
- **Low Priority**: 0/6 완료
- **전체 진행률**: 0/36 (0%)

---

## 참고 문서

- [코드 스멜 및 SOLID 위반 분석](./docs/CODE_SMELLS_AND_SOLID_VIOLATIONS.md)
- [리팩토링 작업 계획](./docs/REFACTORING_PLAN.md)

---

## To-D0 List

- TC
- Implementation
- Refactoring


Made with ☕ by OrderBean Team
