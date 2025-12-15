# 배포 가이드

## 개발 환경 실행

### Docker Compose 사용

```bash
docker-compose up -d
```

### 로컬 환경 실행

1. PostgreSQL 및 Redis 실행
2. Backend 실행
   ```bash
   cd backend
   npm install
   npm run migrate
   npm run dev
   ```
3. Frontend 실행
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 프로덕션 배포

### 환경 변수 설정

`.env` 파일에 필요한 환경 변수를 설정하세요.

### 빌드

```bash
# Backend 빌드
cd backend
npm run build

# Frontend 빌드
cd frontend
npm run build
```

### 데이터베이스 마이그레이션

```bash
cd backend
npm run migrate:deploy
```

## Docker 배포

```bash
docker-compose -f docker-compose.prod.yml up -d
```

