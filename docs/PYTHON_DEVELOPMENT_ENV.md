# OrderBean Python 기반 개발 환경 설정 가이드

## Document Info

- **작성자**: OrderBean Team
- **작성일**: 2025-12-15
- **최종 수정일**: 2025-12-15
- **버전**: 1.0
- **상태**: Draft

---

## Table of Contents

1. [개요](#1-개요)
2. [기술 스택](#2-기술-스택)
3. [사전 요구사항](#3-사전-요구사항)
4. [프로젝트 구조](#4-프로젝트-구조)
5. [개발 환경 설정](#5-개발-환경-설정)
6. [프로젝트 실행](#6-프로젝트-실행)
7. [테스트](#7-테스트)
8. [문서화](#8-문서화)
9. [배포](#9-배포)
10. [문제 해결](#10-문제-해결)

---

## 1. 개요

OrderBean 프로젝트는 Python 기반 풀스택 웹 애플리케이션으로, 다음과 같은 기술 스택을 사용합니다:

- **프론트엔드**: React (빠른 프로토타입 또는 완성형 웹 인터페이스)
- **백엔드**: FastAPI (비동기 고성능 Python 웹 프레임워크)
- **데이터베이스**: PostgreSQL (안정적이고 ORM 기반의 DB 설계)
- **인증/세션**: FastAPI Users, OAuth2 (로그인, JWT 인증)
- **테스트**: pytest (단위/통합 테스트)
- **문서화**: Swagger / ReDoc (FastAPI 자동 문서)
- **배포/환경**: Render (백엔드, DB, 프론트 통합 실행 환경 구성)

---

## 2. 기술 스택

### 2.1 계층별 기술

| 계층 | 사용 기술 | 설명 |
|------|----------|------|
| 프론트엔드 (UI) | React | 빠른 프로토타입 또는 완성형 웹 인터페이스 |
| 백엔드 (API) | FastAPI | 비동기 고성능 Python 웹 프레임워크 |
| 데이터베이스 | PostgreSQL | 안정적이고 ORM 기반의 DB 설계 |
| 인증/세션 | FastAPI Users, OAuth2 | 로그인, JWT 인증 |
| 테스트 | pytest | 단위/통합 테스트 |
| 문서화 | Swagger / ReDoc | API 자동 문서 생성 |
| 배포/환경 | Render | 백엔드, DB, 프론트 통합 실행 환경 구성 |

### 2.2 주요 라이브러리

#### 백엔드 (Python)

- **FastAPI**: 웹 프레임워크
- **SQLAlchemy**: ORM
- **Alembic**: 데이터베이스 마이그레이션
- **Pydantic**: 데이터 검증
- **FastAPI Users**: 사용자 인증 관리
- **python-jose**: JWT 토큰 처리
- **passlib**: 비밀번호 해싱
- **python-multipart**: 파일 업로드
- **pytest**: 테스트 프레임워크
- **httpx**: 테스트용 HTTP 클라이언트

#### 프론트엔드 (React)

- **React**: UI 라이브러리
- **Next.js**: React 프레임워크 (선택적)
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 스타일링
- **React Query**: 데이터 페칭
- **Zustand**: 상태 관리

---

## 3. 사전 요구사항

### 3.1 필수 요구사항

- **Python**: 3.11 이상
- **Node.js**: 18.0 이상 (프론트엔드용)
- **PostgreSQL**: 14.0 이상
- **Git**: 최신 버전

### 3.2 선택적 요구사항

- **Redis**: 6.0 이상 (캐싱용, 선택적)
- **Docker & Docker Compose**: 최신 버전 (권장)

### 3.3 버전 확인

```bash
# Python 버전 확인
python --version
# 또는
python3 --version

# Node.js 버전 확인
node --version

# PostgreSQL 버전 확인
psql --version

# Git 버전 확인
git --version
```

---

## 4. 프로젝트 구조

### 4.1 디렉토리 구조

```
OrderBean/
├── frontend/              # React 프론트엔드
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── utils/
│   ├── package.json
│   └── Dockerfile
│
├── backend/               # FastAPI 백엔드
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py        # FastAPI 앱 진입점
│   │   ├── config.py      # 설정
│   │   ├── database.py    # 데이터베이스 연결
│   │   ├── models/        # SQLAlchemy 모델
│   │   ├── schemas/       # Pydantic 스키마
│   │   ├── api/           # API 라우터
│   │   │   ├── auth.py
│   │   │   ├── stores.py
│   │   │   ├── orders.py
│   │   │   └── admin.py
│   │   ├── services/      # 비즈니스 로직
│   │   ├── utils/         # 유틸리티
│   │   └── dependencies.py
│   ├── alembic/           # 데이터베이스 마이그레이션
│   ├── tests/             # 테스트
│   ├── requirements.txt   # Python 의존성
│   ├── pyproject.toml     # 프로젝트 설정
│   └── Dockerfile
│
├── database/              # 데이터베이스 관련
│   └── migrations/
│
├── docs/                  # 문서
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
├── docker-compose.yml     # Docker Compose 설정
├── .env.example           # 환경 변수 예제
├── .gitignore
└── README.md
```

---

## 5. 개발 환경 설정

### 5.1 Python 가상 환경 설정

```bash
# 프로젝트 루트로 이동
cd OrderBean

# Python 가상 환경 생성
python -m venv venv

# 가상 환경 활성화 (Windows)
venv\Scripts\activate

# 가상 환경 활성화 (Linux/Mac)
source venv/bin/activate

# 가상 환경 확인
which python  # Linux/Mac
where python  # Windows
```

### 5.2 백엔드 의존성 설치

```bash
cd backend

# 의존성 설치
pip install -r requirements.txt

# 개발 의존성 설치 (선택적)
pip install -r requirements-dev.txt
```

### 5.3 프론트엔드 의존성 설치

```bash
cd frontend

# 의존성 설치
npm install
# 또는
yarn install
```

### 5.4 환경 변수 설정

#### 백엔드 환경 변수

`backend/.env` 파일 생성:

```env
# Database
DATABASE_URL=postgresql://orderbean:orderbean@localhost:5432/orderbean
TEST_DATABASE_URL=postgresql://orderbean:orderbean@localhost:5432/orderbean_test

# Redis (선택적)
REDIS_URL=redis://localhost:6379

# JWT
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 days

# FastAPI
ENVIRONMENT=development
DEBUG=True
API_V1_PREFIX=/api/v1

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

#### 프론트엔드 환경 변수

`frontend/.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## 6. 프로젝트 실행

### 6.1 데이터베이스 설정

```bash
# PostgreSQL 데이터베이스 생성
createdb orderbean
createdb orderbean_test

# 마이그레이션 실행
cd backend
alembic upgrade head
```

### 6.2 백엔드 실행

```bash
cd backend

# 개발 서버 실행
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 또는
python -m uvicorn app.main:app --reload
```

백엔드 API는 `http://localhost:8000`에서 실행됩니다.

**API 문서**:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 6.3 프론트엔드 실행

```bash
cd frontend

# 개발 서버 실행
npm run dev
# 또는
yarn dev
```

프론트엔드는 `http://localhost:3000`에서 실행됩니다.

### 6.4 Docker Compose 사용 (권장)

```bash
# 모든 서비스 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f

# 서비스 중지
docker-compose down
```

---

## 7. 테스트

### 7.1 백엔드 테스트

```bash
cd backend

# 모든 테스트 실행
pytest

# 특정 테스트 실행
pytest tests/test_auth.py

# 커버리지 포함
pytest --cov=app --cov-report=html

# 상세 출력
pytest -v
```

### 7.2 프론트엔드 테스트

```bash
cd frontend

# 테스트 실행
npm test
# 또는
yarn test

# 커버리지 포함
npm run test:coverage
```

---

## 8. 문서화

### 8.1 API 문서

FastAPI는 자동으로 API 문서를 생성합니다:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### 8.2 코드 문서

```bash
# Sphinx 문서 생성 (선택적)
cd docs
sphinx-build -b html . _build/html
```

---

## 9. 배포

### 9.1 Render 배포

#### 백엔드 배포

1. Render에서 새 Web Service 생성
2. GitHub 저장소 연결
3. 빌드 명령: `cd backend && pip install -r requirements.txt`
4. 시작 명령: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. 환경 변수 설정

#### 프론트엔드 배포

1. Render에서 새 Static Site 생성
2. GitHub 저장소 연결
3. 빌드 명령: `cd frontend && npm install && npm run build`
4. 출력 디렉토리: `frontend/.next`

#### 데이터베이스

1. Render에서 새 PostgreSQL 데이터베이스 생성
2. DATABASE_URL 환경 변수 설정

---

## 10. 문제 해결

### 10.1 일반적인 문제

#### Python 가상 환경 문제

```bash
# 가상 환경 재생성
rm -rf venv
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

#### 데이터베이스 연결 문제

```bash
# PostgreSQL 서비스 확인
# Windows
Get-Service postgresql*

# Linux/Mac
sudo systemctl status postgresql

# 연결 테스트
psql -U orderbean -d orderbean -h localhost
```

#### 포트 충돌

```bash
# 포트 사용 확인
# Windows
netstat -ano | findstr :8000

# Linux/Mac
lsof -i :8000

# 다른 포트 사용
uvicorn app.main:app --port 8001
```

### 10.2 의존성 문제

```bash
# requirements.txt 업데이트
pip freeze > requirements.txt

# 의존성 재설치
pip install --upgrade -r requirements.txt
```

### 10.3 마이그레이션 문제

```bash
# 마이그레이션 초기화 (주의: 데이터 손실)
alembic downgrade base
alembic upgrade head

# 새 마이그레이션 생성
alembic revision --autogenerate -m "description"
alembic upgrade head
```

---

## 11. 개발 워크플로우

### 11.1 기능 개발

1. 기능 브랜치 생성
   ```bash
   git checkout -b feature/new-feature
   ```

2. 코드 작성 및 테스트
3. 커밋 및 푸시
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

4. Pull Request 생성

### 11.2 데이터베이스 변경

1. SQLAlchemy 모델 수정
2. 마이그레이션 생성
   ```bash
   alembic revision --autogenerate -m "description"
   ```
3. 마이그레이션 검토 및 수정
4. 마이그레이션 적용
   ```bash
   alembic upgrade head
   ```

---

## 12. 추가 리소스

### 12.1 공식 문서

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [SQLAlchemy 공식 문서](https://docs.sqlalchemy.org/)
- [FastAPI Users 공식 문서](https://fastapi-users.github.io/fastapi-users/)
- [React 공식 문서](https://react.dev/)
- [Render 공식 문서](https://render.com/docs)

### 12.2 학습 자료

- FastAPI 튜토리얼
- SQLAlchemy 가이드
- React 베스트 프랙티스
- pytest 가이드

---

**작성 완료일**: 2025-12-15

