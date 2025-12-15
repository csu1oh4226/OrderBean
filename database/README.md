# Database

## Prisma Schema

데이터베이스 스키마는 `backend/prisma/schema.prisma` 파일에서 관리됩니다.

## 마이그레이션

### 개발 환경

```bash
cd backend
npm run migrate
```

### 프로덕션 환경

```bash
cd backend
npm run migrate:deploy
```

## Prisma Studio

데이터베이스 데이터를 시각적으로 확인하고 편집할 수 있습니다.

```bash
cd backend
npm run studio
```

## 주요 엔터티

- **User**: 사용자 정보
- **Store**: 매장 정보
- **Menu**: 메뉴 정보
- **Order**: 주문 정보
- **OrderItem**: 주문 항목
- **Payment**: 결제 정보

