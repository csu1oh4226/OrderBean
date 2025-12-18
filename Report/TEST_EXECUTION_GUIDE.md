# 테스트 실행 가이드

이 문서는 OrderBean 프로젝트의 테스트를 올바르게 실행하기 위한 가이드입니다.

## 🚨 현재 상태

테스트 실행 시 데이터베이스 연결 문제로 인해 대부분의 테스트가 실패합니다.

## ✅ 해결 방법

### 방법 1: 실제 데이터베이스 사용 (권장)

#### 1단계: PostgreSQL 실행 확인

```bash
# PostgreSQL 실행 확인
pg_isready

# 또는 Windows에서
# 서비스에서 PostgreSQL 확인
```

#### 2단계: 테스트용 데이터베이스 생성

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE orderbean_test;

# 사용자 생성 (필요시)
CREATE USER orderbean WITH PASSWORD 'orderbean';
GRANT ALL PRIVILEGES ON DATABASE orderbean_test TO orderbean;
```

#### 3단계: 환경 변수 설정

`backend/.env.test` 파일 생성:

```env
DATABASE_URL=postgresql://orderbean:orderbean@localhost:5432/orderbean_test
JWT_SECRET=test-secret-key
NODE_ENV=test
```

#### 4단계: 마이그레이션 실행

```bash
cd backend

# 마이그레이션 실행
npm run migrate
```

#### 5단계: 테스트 실행

```bash
npm test
```

---

### 방법 2: Docker Compose 사용

#### 1단계: Docker Compose로 데이터베이스 실행

```bash
# 프로젝트 루트에서
docker-compose up -d postgres

# 테스트용 데이터베이스 생성
docker-compose exec postgres psql -U orderbean -c "CREATE DATABASE orderbean_test;"
```

#### 2단계: 환경 변수 설정

테스트용 DATABASE_URL을 Docker 컨테이너로 설정

#### 3단계: 마이그레이션 및 테스트 실행

```bash
cd backend
DATABASE_URL=postgresql://orderbean:orderbean@localhost:5432/orderbean_test npm run migrate
DATABASE_URL=postgresql://orderbean:orderbean@localhost:5432/orderbean_test npm test
```

---

### 방법 3: Prisma 모킹 (고급)

실제 데이터베이스 없이 테스트 실행 (구현 필요)

---

## 🔍 문제 진단

### 에러 메시지 확인

#### "PrismaClientInitializationError"
- **원인**: 데이터베이스 연결 실패
- **해결**: DATABASE_URL 확인, PostgreSQL 실행 확인

#### "P2002: Unique constraint failed"
- **원인**: 중복 데이터
- **해결**: 테스트 데이터 정리

#### "500 Internal Server Error"
- **원인**: 데이터베이스 쿼리 실패
- **해결**: 데이터베이스 연결 및 스키마 확인

---

## 📋 테스트 실행 체크리스트

### 사전 준비
- [ ] PostgreSQL 실행 중
- [ ] 테스트용 데이터베이스 생성
- [ ] 환경 변수 설정
- [ ] Prisma 마이그레이션 실행

### 테스트 실행
- [ ] 단위 테스트 실행
- [ ] 통합 테스트 실행
- [ ] 커버리지 확인

### 결과 확인
- [ ] 모든 테스트 통과 확인
- [ ] 실패한 테스트 분석
- [ ] 커버리지 목표 달성 확인

---

## 🛠️ 트러블슈팅

### 문제: 데이터베이스 연결 실패

**해결 방법**:
1. PostgreSQL 서비스 실행 확인
2. DATABASE_URL 형식 확인
3. 방화벽 설정 확인
4. 사용자 권한 확인

### 문제: 마이그레이션 실패

**해결 방법**:
1. 기존 마이그레이션 상태 확인: `npx prisma migrate status`
2. 마이그레이션 리셋 (개발 환경): `npx prisma migrate reset`
3. 새로 마이그레이션 생성: `npx prisma migrate dev`

### 문제: 테스트 데이터 충돌

**해결 방법**:
1. 테스트 전 데이터베이스 정리
2. 각 테스트 후 롤백
3. 격리된 테스트 데이터 사용

---

## 📊 예상 결과

데이터베이스가 올바르게 설정되면:

- ✅ 인증 API: 6개 테스트 통과
- ✅ 매장 API: 5개 테스트 통과
- ✅ 주문 API: 12개 테스트 통과
- ✅ 관리자 API: 12개 테스트 통과
- ✅ 통합 테스트: 1개 테스트 통과

**총 36개 이상의 테스트 통과 예상**

---

## 🔗 관련 문서

- [Development.md](../docs/Development.md) - 개발 환경 설정
- [GREEN_PHASE_TEST_RESULTS.md](./GREEN_PHASE_TEST_RESULTS.md) - 테스트 결과 상세
- [TEST_CASES.md](./TEST_CASES.md) - 테스트 케이스 문서

---

**작성일**: 2025-12-15

