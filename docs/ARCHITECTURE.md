# 아키텍처 문서

## 시스템 개요

OrderBean은 모놀리식 아키텍처를 기반으로 하며, 다음과 같은 구조로 구성됩니다:

- **Frontend**: Next.js 기반 웹 애플리케이션
- **Backend**: Express.js 기반 REST API 서버
- **Database**: PostgreSQL (주 데이터베이스)
- **Cache**: Redis (세션 및 캐싱)
- **Real-time**: Socket.io (실시간 알림)

## 기술 스택

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query (데이터 페칭)
- Zustand (상태 관리)

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma (ORM)
- Socket.io (WebSocket)

### Infrastructure
- Docker & Docker Compose
- PostgreSQL
- Redis
- AWS (프로덕션)

## 디렉토리 구조

```
OrderBean/
├── frontend/          # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/      # Next.js App Router
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── backend/           # Express 백엔드
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── types/
│   ├── prisma/
│   └── package.json
├── database/          # 데이터베이스 관련
│   └── migrations/
├── docs/              # 문서
└── docker-compose.yml
```

## 데이터 흐름

1. 사용자가 Frontend에서 요청
2. Frontend가 Backend API 호출
3. Backend가 Database에서 데이터 조회/저장
4. Backend가 Socket.io를 통해 실시간 알림 발송
5. Frontend가 WebSocket을 통해 실시간 업데이트 수신

## 보안

- JWT 기반 인증
- HTTPS 통신
- 결제 정보 비저장
- 관리자 MFA (Multi-Factor Authentication)

