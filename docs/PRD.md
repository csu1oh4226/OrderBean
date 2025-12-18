PRD: OrderBean v1.0
Document Info

작성자: (기입)

작성일: 2025-XX-XX

최종 수정일: 2025-XX-XX

버전: 1.0

상태: Draft

승인자: PM / Tech Lead / Design Lead

Table of Contents

Executive Summary

목표 및 성공 지표

사용자 & 페르소나

사용자 스토리

기능 명세

UX/UI 설계

기술 사양

API 개요

데이터 모델

비기능 요구사항

일정 및 마일스톤

리스크 & 의존성

1. Executive Summary
1.1 제품 개요

OrderBean은 바쁜 직장인을 위한 커피 주문 웹 서비스로,
카페 방문 시 발생하는 대기 시간·줄 서기·헛걸음 문제를
사전 주문 + 픽업 시간 예약 + 실시간 준비 상태 제공 방식으로 해결한다.

1.2 배경 및 필요성

시장 기회

직장인 테이크아웃 커피 이용 빈도 증가

점심·회의 전후 시간 압박 심화

사용자 문제(Pain Point)

인기 카페 대기 시간 예측 불가

주문 후 언제 받을 수 있는지 알 수 없음

기존 솔루션의 한계

카페 앱은 매장별로 분절

실시간 혼잡·제조 상황 반영 부족

1.3 핵심 가치

시간 절약: 주문~픽업까지 소요 시간 최소화

예측 가능성: 언제 받을 수 있는지 명확한 안내

운영 안정성: 매장 제조 병목 방지

1.4 범위 (Scope)

In Scope

웹 기반 주문/픽업 시스템

실시간 주문 상태 관리

관리자 주문·메뉴 관리

Out of Scope

배달 서비스

멤버십/포인트

모바일 네이티브 앱(Phase 2)

2. 목표 및 성공 지표
2.1 비즈니스 목표

런칭 3개월 내 MAU 5,000명

주문 완료율 85% 이상

재주문 사용자 비율 40% 이상

2.2 제품 목표

평균 대기 체감 시간 30% 감소

주문 완료까지 평균 클릭 수 3회 이하

피크 시간 주문 실패율 1% 이하

2.3 핵심 지표 (Key Metrics)
지표	목표	측정 방법
MAU	5,000	GA
주문 완료율	≥85%	주문 로그
재주문율	≥40%	Cohort
평균 픽업 지연	<3분	주문/픽업 로그
3. 사용자 & 페르소나
3.1 타깃 사용자

Primary

25~45세 직장인

점심시간·회의 전후 테이크아웃 빈번

Secondary

팀 단위 주문 담당자

카페 매장 관리자(점주)

3.2 Primary Persona

이름: 김현우 (34세)
직업: IT 회사 대리
목표: 점심시간 30분 내 커피 픽업
고충

줄 서는 시간 낭비

주문 후 대기 예측 불가
구매 결정 요인

빠른 주문

정확한 픽업 시간

사용 편의성

4. 사용자 스토리
Epic E001: 빠른 주문
As a 바쁜 직장인
I want to 최근 주문을 한 번에 다시 주문하고
So that 주문 시간을 최소화할 수 있다

Epic E002: 픽업 시간 관리
As a 사용자
I want to 픽업 시간을 미리 선택하고
So that 줄 서지 않고 바로 받을 수 있다

5. 기능 명세
Feature F001: 빠른 주문 & 재주문

우선순위: Must Have

설명: 최근 주문/즐겨찾기 기반 1-클릭 주문

Feature F002: 픽업 시간 예약

우선순위: Must Have

설명: 결제 전 픽업 시간 선택 및 시간대별 주문 제한

Feature F003: 주문 상태 알림

우선순위: Must Have

설명: 접수→제조중→픽업가능 실시간 알림

Feature F004: 매장·메뉴 관리(관리자)

우선순위: Must Have

설명: 메뉴, 품절, 영업시간, 주문 상한 관리

Feature F005: 결제 & 이력 관리

우선순위: Must Have

설명: 간편결제 및 주문/환불 이력 관리

6. UX/UI 설계
6.1 디자인 원칙

모바일 우선

3-step 주문

즉각적 피드백

불안 최소화(상태 가시성)

6.2 주요 화면

홈(근처 매장 + 예상 준비 시간)

메뉴/재주문

장바구니 & 픽업 시간

주문 상태 화면

관리자 대시보드

7. 기술 사양
7.1 기술 스택

Frontend: Next.js, TypeScript

Backend: Node.js, Express

DB: PostgreSQL

Cache: Redis

Infra: AWS, CDN

알림: Web Push / SMS

8. API 개요
고객 API

GET /stores/nearby

GET /stores/{id}/menus

POST /orders

GET /orders/{id}

관리자 API

PATCH /admin/orders/{id}/status

POST /admin/menus

GET /admin/dashboard

9. 데이터 모델
주요 엔터티

User

Store

Menu

Order

OrderItem

Payment

관계

User 1:N Order

Store 1:N Menu

Order 1:N OrderItem

10. 비기능 요구사항

성능: 주문 API P95 < 700ms

보안: HTTPS, 결제정보 비저장

확장성: 멀티 매장 구조

사용성: 모바일 3-step 주문

11. 일정 및 마일스톤

Week 1–2: 설계/UX

Week 3–6: 핵심 기능 개발

Week 7: QA

Week 8: 베타 런칭

12. 리스크 & 의존성

결제 PG 장애

피크 타임 주문 폭주

매장 운영 숙련도 차이