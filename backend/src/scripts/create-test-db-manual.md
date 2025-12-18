# 테스트 데이터베이스 수동 생성 가이드

PostgreSQL 비밀번호 인증 문제로 자동 생성이 실패했습니다. 다음 방법 중 하나를 사용하세요.

## 방법 1: pgAdmin 사용 (권장)

1. **pgAdmin 실행**
   - 시작 메뉴에서 "pgAdmin 4" 검색 및 실행

2. **서버 연결**
   - 왼쪽 패널에서 "Servers" > "PostgreSQL 18" 확장
   - 설치 시 설정한 비밀번호 입력

3. **데이터베이스 생성**
   - "Databases" 우클릭 > "Create" > "Database..."
   - Name: `orderbean_test`
   - Owner: `postgres` (또는 현재 사용자)
   - "Save" 클릭

4. **사용자 생성 (선택적)**
   - "Login/Group Roles" 우클릭 > "Create" > "Login/Group Role..."
   - Name: `orderbean`
   - Definition 탭: Password: `orderbean`
   - Privileges 탭: 모든 권한 체크
   - "Save" 클릭

## 방법 2: SQL 명령어 직접 실행

pgAdmin의 Query Tool 사용:

```sql
-- 1. 데이터베이스 생성
CREATE DATABASE orderbean_test;

-- 2. 사용자 생성 (선택적)
CREATE USER orderbean WITH PASSWORD 'orderbean';

-- 3. 권한 부여
GRANT ALL PRIVILEGES ON DATABASE orderbean_test TO orderbean;
```

## 방법 3: 명령 프롬프트 사용 (비밀번호 입력)

PowerShell에서:

```powershell
# PostgreSQL 경로를 PATH에 추가
$env:Path += ";C:\Program Files\PostgreSQL\18\bin"

# psql 실행 (비밀번호 입력 필요)
psql -U postgres -h localhost

# SQL 명령어 실행
CREATE DATABASE orderbean_test;
CREATE USER orderbean WITH PASSWORD 'orderbean';
GRANT ALL PRIVILEGES ON DATABASE orderbean_test TO orderbean;
\q
```

## 다음 단계

데이터베이스 생성 후:

1. **환경 변수 확인**
   - `backend/.env.test` 파일의 DATABASE_URL 확인
   - 비밀번호가 맞는지 확인

2. **마이그레이션 실행**
   ```powershell
   cd backend
   npm run migrate
   ```

3. **테스트 데이터 생성**
   ```powershell
   npm run seed:test
   ```

4. **테스트 실행**
   ```powershell
   npm test
   ```

