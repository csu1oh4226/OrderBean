# 개발 환경 설정 가이드

이 문서는 OrderBean 프로젝트의 개발 환경을 설정하고 실행하는 방법을 안내합니다.

## 목차

- [사전 요구사항](#사전-요구사항)
- [프로젝트 클론](#프로젝트-클론)
- [환경 변수 설정](#환경-변수-설정)
- [Docker를 사용한 개발 환경 설정](#docker를-사용한-개발-환경-설정)
- [로컬 환경 설정](#로컬-환경-설정)
- [프로젝트 실행](#프로젝트-실행)
- [문제 해결](#문제-해결)

---

## 사전 요구사항

다음 소프트웨어가 설치되어 있어야 합니다:

### 필수 요구사항

- **Node.js**: 18.0.0 이상
- **npm**: 9.0.0 이상 (또는 yarn, pnpm)
- **Git**: 최신 버전

### 선택적 요구사항 (로컬 환경 사용 시)

- **PostgreSQL**: 14.0 이상
- **Redis**: 6.0 이상
- **Docker & Docker Compose**: 최신 버전 (권장)

### 버전 확인

```bash
# Node.js 버전 확인
node --version

# npm 버전 확인
npm --version

# Git 버전 확인
git --version

# Docker 버전 확인 (선택)
docker --version
docker-compose --version
```

---

## 프로젝트 클론

```bash
# 저장소 클론
git clone https://github.com/your-org/OrderBean.git
cd OrderBean
```

---

## 환경 변수 설정

### 1. 환경 변수 파일 생성

프로젝트 루트 디렉토리에서 `env.example` 파일을 참고하여 `.env` 파일을 생성합니다.

```bash
# 루트 디렉토리
cp env.example .env
```

### 2. Backend 환경 변수 설정

`backend` 디렉토리에 `.env` 파일을 생성합니다.

```bash
cd backend
cp ../env.example .env
```

필수 환경 변수:

```env
# Database
DATABASE_URL=postgresql://orderbean:orderbean@localhost:5432/orderbean

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Backend
NODE_ENV=development
PORT=3001
```

### 3. Frontend 환경 변수 설정

`frontend` 디렉토리에 `.env.local` 파일을 생성합니다.

```bash
cd frontend
touch .env.local
```

필수 환경 변수:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Docker를 사용한 개발 환경 설정

Docker를 사용하면 PostgreSQL, Redis, Backend, Frontend를 한 번에 실행할 수 있습니다.

### 1. Docker Compose로 서비스 시작

```bash
# 프로젝트 루트 디렉토리에서
docker-compose up -d
```

이 명령은 다음 서비스를 시작합니다:
- PostgreSQL (포트 5432)
- Redis (포트 6379)
- Backend API (포트 3001)
- Frontend (포트 3000)

### 2. 데이터베이스 마이그레이션 실행

```bash
# Backend 컨테이너에서 마이그레이션 실행
docker-compose exec backend npm run migrate

# 또는 로컬에서 실행 (DATABASE_URL이 올바르게 설정된 경우)
cd backend
npm run migrate
```

### 3. 서비스 상태 확인

```bash
# 실행 중인 컨테이너 확인
docker-compose ps

# 로그 확인
docker-compose logs -f

# 특정 서비스 로그 확인
docker-compose logs -f backend
docker-compose logs -f frontend
```

### 4. 서비스 중지

```bash
# 서비스 중지 (데이터는 유지)
docker-compose stop

# 서비스 중지 및 컨테이너 제거 (데이터는 유지)
docker-compose down

# 서비스 중지 및 볼륨까지 제거 (데이터 삭제)
docker-compose down -v
```

### 5. Prisma Studio 실행 (데이터베이스 GUI)

```bash
# Backend 컨테이너에서 실행
docker-compose exec backend npm run studio

# 또는 로컬에서 실행
cd backend
npm run studio
```

브라우저에서 `http://localhost:5555`로 접속하여 데이터베이스를 확인할 수 있습니다.

---

## 로컬 환경 설정

Docker를 사용하지 않고 로컬에 직접 설치하는 방법입니다.

### 1. PostgreSQL 설치 및 설정

#### macOS (Homebrew)

```bash
brew install postgresql@14
brew services start postgresql@14

# 데이터베이스 생성
createdb orderbean
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql-14

# PostgreSQL 시작
sudo systemctl start postgresql

# 데이터베이스 생성
sudo -u postgres createdb orderbean
```

#### Windows

[PostgreSQL 공식 사이트](https://www.postgresql.org/download/windows/)에서 설치 프로그램을 다운로드하여 설치합니다.

### 2. Redis 설치 및 설정

#### macOS (Homebrew)

```bash
brew install redis
brew services start redis
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
```

#### Windows

[Redis for Windows](https://github.com/microsoftarchive/redis/releases) 또는 WSL을 사용합니다.

### 3. 의존성 설치

#### 루트 디렉토리

```bash
# 프로젝트 루트에서
npm install
```

#### Backend

```bash
cd backend
npm install

# Prisma Client 생성
npm run generate
```

#### Frontend

```bash
cd frontend
npm install
```

### 4. 데이터베이스 마이그레이션

```bash
cd backend

# 개발 환경 마이그레이션
npm run migrate

# 또는 마이그레이션 파일 생성
npx prisma migrate dev --name init
```

---

## 프로젝트 실행

### 방법 1: Docker Compose 사용 (권장)

```bash
# 모든 서비스 한 번에 실행
docker-compose up

# 백그라운드 실행
docker-compose up -d

# 특정 서비스만 실행
docker-compose up postgres redis backend
```

### 방법 2: 로컬 환경에서 실행

#### 터미널 1: PostgreSQL 및 Redis 실행 확인

```bash
# PostgreSQL 실행 확인
pg_isready

# Redis 실행 확인
redis-cli ping
# 응답: PONG
```

#### 터미널 2: Backend 실행

```bash
cd backend
npm run dev
```

Backend 서버가 `http://localhost:3001`에서 실행됩니다.

#### 터미널 3: Frontend 실행

```bash
cd frontend
npm run dev
```

Frontend 서버가 `http://localhost:3000`에서 실행됩니다.

### 방법 3: 루트에서 한 번에 실행 (npm workspaces)

```bash
# 프로젝트 루트에서
npm run dev
```

이 명령은 Backend와 Frontend를 동시에 실행합니다.

---

## 접속 확인

### 1. Frontend 확인

브라우저에서 `http://localhost:3000` 접속

### 2. Backend API 확인

```bash
# Health check
curl http://localhost:3001/health

# 또는 브라우저에서
# http://localhost:3001/health
```

예상 응답:
```json
{
  "status": "ok",
  "timestamp": "2025-01-XX..."
}
```

### 3. 데이터베이스 연결 확인

```bash
# PostgreSQL 연결 확인
psql -U orderbean -d orderbean -h localhost

# 또는 Prisma Studio 사용
cd backend
npm run studio
```

---

## 개발 워크플로우

### 1. 코드 변경 시 자동 리로드

- **Backend**: `tsx watch`를 사용하여 자동 리로드
- **Frontend**: Next.js의 Fast Refresh 기능 사용

### 2. 데이터베이스 스키마 변경

```bash
cd backend

# 스키마 변경 후 마이그레이션 생성
npx prisma migrate dev --name your_migration_name

# Prisma Client 재생성
npm run generate
```

### 3. 타입 체크

```bash
# Backend 타입 체크
cd backend
npm run type-check

# Frontend 타입 체크
cd frontend
npm run type-check
```

### 4. 린트 실행

```bash
# Backend 린트
cd backend
npm run lint

# Frontend 린트
cd frontend
npm run lint
```

---

## 문제 해결

### PostgreSQL 연결 오류

**문제**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**해결 방법**:
1. PostgreSQL이 실행 중인지 확인
   ```bash
   # macOS/Linux
   brew services list
   # 또는
   sudo systemctl status postgresql
   ```
2. `DATABASE_URL` 환경 변수 확인
3. PostgreSQL 포트 확인 (기본값: 5432)

### Redis 연결 오류

**문제**: `Error: connect ECONNREFUSED 127.0.0.1:6379`

**해결 방법**:
1. Redis가 실행 중인지 확인
   ```bash
   redis-cli ping
   ```
2. `REDIS_URL` 환경 변수 확인

### 포트 충돌

**문제**: `Error: listen EADDRINUSE: address already in use :::3001`

**해결 방법**:
1. 포트를 사용 중인 프로세스 확인
   ```bash
   # macOS/Linux
   lsof -i :3001
   # 또는
   netstat -an | grep 3001
   ```
2. 프로세스 종료 또는 다른 포트 사용
3. 환경 변수에서 포트 변경

### Prisma 마이그레이션 오류

**문제**: `Migration failed`

**해결 방법**:
1. 데이터베이스 연결 확인
2. 마이그레이션 상태 확인
   ```bash
   cd backend
   npx prisma migrate status
   ```
3. 마이그레이션 리셋 (개발 환경에서만)
   ```bash
   npx prisma migrate reset
   ```

### Docker 컨테이너 문제

**문제**: 컨테이너가 시작되지 않음

**해결 방법**:
1. 컨테이너 로그 확인
   ```bash
   docker-compose logs [service_name]
   ```
2. 컨테이너 재시작
   ```bash
   docker-compose restart [service_name]
   ```
3. 컨테이너 재생성
   ```bash
   docker-compose up -d --force-recreate [service_name]
   ```

### Node 버전 불일치

**문제**: `The engine "node" is incompatible`

**해결 방법**:
1. Node.js 버전 확인 (18.0.0 이상 필요)
2. nvm 사용 시 올바른 버전으로 전환
   ```bash
   nvm install 18
   nvm use 18
   ```

---

## 유용한 명령어

### Docker 관련

```bash
# 모든 컨테이너 로그 보기
docker-compose logs -f

# 특정 서비스 재시작
docker-compose restart backend

# 컨테이너 내부 접속
docker-compose exec backend sh
docker-compose exec postgres psql -U orderbean -d orderbean
```

### 데이터베이스 관련

```bash
# Prisma Studio 실행
cd backend && npm run studio

# 마이그레이션 상태 확인
cd backend && npx prisma migrate status

# 데이터베이스 리셋 (개발 환경)
cd backend && npx prisma migrate reset
```

### 개발 도구

```bash
# 타입 체크
npm run type-check --workspace=backend
npm run type-check --workspace=frontend

# 린트
npm run lint --workspaces

# 빌드 테스트
npm run build --workspaces
```

---

## 다음 단계

개발 환경이 준비되었습니다! 다음 문서를 참고하세요:

- [API 문서](./API.md) - API 엔드포인트 상세 정보
- [아키텍처 문서](./ARCHITECTURE.md) - 시스템 아키텍처 설명
- [기여 가이드](./CONTRIBUTING.md) - 코드 기여 방법

---

## 추가 도움말

문제가 지속되면 다음을 확인하세요:

1. [GitHub Issues](https://github.com/your-org/OrderBean/issues)에서 유사한 문제 검색
2. 새로운 이슈 생성
3. 팀 채널에서 문의

---

**Happy Coding! ☕**

