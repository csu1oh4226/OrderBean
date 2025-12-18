# PostgreSQL 설치 및 설정 가이드

## Stack Builder에서 선택할 항목

### ✅ 권장: 기본 설치만 사용 (Cancel 클릭)

**이유:**
- OrderBean 테스트에는 기본 PostgreSQL 서버만 필요
- 추가 도구는 나중에 필요시 설치 가능
- 지금은 테스트 환경 구축이 우선

### 또는 최소 선택 (선택적)

만약 추가 도구가 필요하다면:

1. **Database Drivers** (선택적)
   - 필요시: 애플리케이션에서 PostgreSQL 연결 시
   - 지금은 불필요 (Prisma가 자동 처리)

2. **Add-ons, tools and utilities** (선택적)
   - 필요시: pgAdmin (GUI 도구)
   - 지금은 불필요

## ✅ 다음 단계

Stack Builder를 Cancel하고 다음을 진행하세요:

### 1. PostgreSQL 설치 확인

```powershell
# PostgreSQL 버전 확인
psql --version

# PostgreSQL 서비스 상태 확인
Get-Service postgresql*
```

### 2. 데이터베이스 생성

```powershell
# PostgreSQL에 접속 (기본 사용자: postgres)
psql -U postgres

# SQL 명령어 실행
CREATE DATABASE orderbean_test;
CREATE USER orderbean WITH PASSWORD 'orderbean';
GRANT ALL PRIVILEGES ON DATABASE orderbean_test TO orderbean;
\q
```

### 3. 환경 변수 설정

`backend/.env.test` 파일이 이미 생성되어 있습니다:
```
DATABASE_URL=postgresql://orderbean:orderbean@localhost:5432/orderbean_test
```

### 4. 마이그레이션 실행

```powershell
cd backend
npm run migrate
```

### 5. 테스트 데이터 생성

```powershell
npm run seed:test
```

### 6. 테스트 실행

```powershell
npm test
```

## 🔍 PostgreSQL 설치 확인 방법

### Windows 서비스 확인

```powershell
# PostgreSQL 서비스 확인
Get-Service | Where-Object {$_.Name -like "*postgresql*"}

# 서비스 시작 (필요시)
Start-Service postgresql-x64-*
```

### 포트 확인

기본 PostgreSQL 포트: **5432**

```powershell
# 포트 사용 확인
netstat -an | findstr 5432
```

## 📝 요약

**지금 할 일:**
1. ✅ Stack Builder에서 **Cancel** 클릭
2. ✅ 기본 PostgreSQL 설치 확인
3. ✅ 위의 단계대로 데이터베이스 생성 및 설정

**추가 도구는 나중에:**
- pgAdmin (GUI 도구) - 필요시 설치
- 기타 드라이버 - 필요시 설치

---

**다음 단계**: PostgreSQL 설치 확인 후 데이터베이스 생성 진행

