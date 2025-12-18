# 다음 단계 안내

## 현재 상태

✅ 환경 변수 파일 생성 완료 (`backend/.env.test`)
⚠️ 데이터베이스 생성 필요
⚠️ 비밀번호 확인 필요

## 🔴 우선순위 1: 데이터베이스 생성 및 비밀번호 확인

### 방법 A: pgAdmin 사용 (권장)

1. **pgAdmin 4 실행**
2. **서버 연결**
   - 왼쪽 패널에서 'Servers' > 'PostgreSQL 18' 클릭
   - 설치 시 설정한 비밀번호 입력
3. **데이터베이스 생성**
   - 'Databases' 우클릭 > 'Create' > 'Database...'
   - Name: `orderbean_test`
   - Owner: `postgres`
   - 'Save' 클릭

### 방법 B: SQL 명령어 사용

pgAdmin의 Query Tool에서:

```sql
CREATE DATABASE orderbean_test;
```

## 🔴 우선순위 2: 비밀번호 확인 및 환경 변수 수정

`backend/.env.test` 파일을 열고:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/orderbean_test
```

**YOUR_PASSWORD**를 PostgreSQL 설치 시 설정한 postgres 비밀번호로 변경하세요!

## 🟡 우선순위 3: 마이그레이션 실행

데이터베이스 생성 및 비밀번호 설정 후:

```powershell
cd backend
npm run migrate
```

## 🟡 우선순위 4: 테스트 데이터 생성

```powershell
npm run seed:test
```

## 🟢 우선순위 5: 테스트 실행

```powershell
npm test
```

## 📋 빠른 체크리스트

- [ ] pgAdmin에서 `orderbean_test` 데이터베이스 생성
- [ ] `.env.test` 파일의 비밀번호 수정
- [ ] 마이그레이션 실행 (`npm run migrate`)
- [ ] 테스트 데이터 생성 (`npm run seed:test`)
- [ ] 테스트 실행 (`npm test`)

## 💡 문제 해결

### 인증 실패 시

1. **비밀번호 확인**
   - PostgreSQL 설치 시 설정한 postgres 비밀번호 확인
   - `.env.test` 파일의 DATABASE_URL 확인

2. **데이터베이스 존재 확인**
   - pgAdmin에서 `orderbean_test` 데이터베이스가 있는지 확인

3. **서비스 실행 확인**
   ```powershell
   Get-Service postgresql-x64-18
   ```

