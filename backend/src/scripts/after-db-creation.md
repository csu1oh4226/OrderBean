# 데이터베이스 생성 후 다음 단계

pgAdmin에서 `orderbean_test` 데이터베이스를 생성하셨다면, 다음 단계를 진행하세요.

## ✅ 확인 사항

데이터베이스가 생성되었는지 확인:
- 데이터베이스 이름: `orderbean_test`
- 소유자: `postgres` (또는 현재 사용자)

## 📝 다음 단계

### 1. 환경 변수 확인

`backend/.env.test` 파일이 올바른 DATABASE_URL을 가지고 있는지 확인:

```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/orderbean_test
```

**중요**: `YOUR_PASSWORD`를 설치 시 설정한 postgres 비밀번호로 변경하세요.

### 2. 마이그레이션 실행

```powershell
cd backend
npm run migrate
```

### 3. 테스트 데이터 생성

```powershell
npm run seed:test
```

### 4. 테스트 실행

```powershell
npm test
```

## 🔧 문제 해결

### 마이그레이션 실패 시

1. DATABASE_URL 확인
2. PostgreSQL 서비스 실행 확인
3. 비밀번호 확인

### 테스트 데이터 생성 실패 시

1. 데이터베이스가 올바르게 생성되었는지 확인
2. 마이그레이션이 성공했는지 확인
3. 권한 문제 확인

