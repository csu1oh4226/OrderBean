# 데이터베이스 설정 진행 상황

**작성일**: 2025-12-15  
**상태**: ⏳ 진행 중

---

## ✅ 완료된 작업

1. ✅ PostgreSQL 18.1 설치 확인
2. ✅ PostgreSQL 서비스 실행 확인
3. ✅ 테스트 데이터 시드 스크립트 작성
4. ✅ 환경 변수 파일 생성 (`.env.test`)
5. ✅ 데이터베이스 생성 후 실행 스크립트 준비

---

## ⏳ 진행 중인 작업

### 사용자 작업 필요

**pgAdmin에서 데이터베이스 생성:**

1. pgAdmin 4 실행
2. 왼쪽 패널에서 'Servers' > 'PostgreSQL 18' 확장
3. 'Databases' 우클릭 > 'Create' > 'Database...'
4. General 탭:
   - Database: `orderbean_test`
   - Owner: `postgres`
5. 'Save' 클릭

---

## 📝 다음 단계 (데이터베이스 생성 후)

### 1. 환경 변수 수정

`backend/.env.test` 파일 열기:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/orderbean_test
```

**중요**: `YOUR_PASSWORD`를 PostgreSQL 설치 시 설정한 postgres 비밀번호로 변경하세요!

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

---

## 🔧 자동 실행 스크립트

데이터베이스 생성 후 다음 스크립트를 실행하면 자동으로 마이그레이션과 테스트 데이터 생성을 진행합니다:

```powershell
cd backend
.\src\scripts\run-after-db-creation.ps1
```

---

## 📋 체크리스트

- [ ] pgAdmin에서 `orderbean_test` 데이터베이스 생성
- [ ] `.env.test` 파일의 비밀번호 수정
- [ ] 마이그레이션 실행
- [ ] 테스트 데이터 생성
- [ ] 테스트 실행

---

## 💡 문제 해결

### 마이그레이션 실패 시

1. DATABASE_URL 확인
   - 비밀번호가 올바른지 확인
   - 데이터베이스 이름이 `orderbean_test`인지 확인

2. PostgreSQL 서비스 확인
   ```powershell
   Get-Service postgresql-x64-18
   ```

3. 연결 테스트
   - pgAdmin에서 데이터베이스에 연결되는지 확인

### 테스트 데이터 생성 실패 시

1. 마이그레이션이 성공했는지 확인
2. 데이터베이스에 테이블이 생성되었는지 확인 (pgAdmin에서 확인)

---

**다음 업데이트**: 데이터베이스 생성 완료 후

