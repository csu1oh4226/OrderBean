# OrderBean Backend (FastAPI + Python)

OrderBean 커피 주문 서비스의 FastAPI 기반 백엔드 서버입니다.

## 기술 스택

- **Framework**: FastAPI 0.104+
- **Language**: Python 3.10+
- **ASGI Server**: Uvicorn
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Validation**: Pydantic

## 개발 환경 설정

### 1. 가상 환경 생성 및 활성화

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python -m venv venv
source venv/bin/activate
```

### 2. 의존성 설치

```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정

`.env.example` 파일을 참고하여 `.env` 파일을 생성하세요.

```bash
cp .env.example .env
```

### 4. 서버 실행

```bash
# 개발 모드 (자동 리로드)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 또는
python -m app.main
```

### 5. API 문서 확인

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 프로젝트 구조

```
backend-python/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI 애플리케이션 진입점
│   ├── config.py            # 설정 관리
│   ├── database.py          # 데이터베이스 연결
│   └── api/
│       └── v1/
│           ├── __init__.py
│           ├── auth.py      # 인증 API
│           ├── stores.py    # 매장 API
│           ├── orders.py    # 주문 API
│           └── admin.py     # 관리자 API
├── venv/                    # 가상 환경 (gitignore)
├── requirements.txt         # Python 의존성
├── .env.example             # 환경 변수 예제
└── README.md
```

## API 엔드포인트

### 공통
- `GET /` - 헬스 체크
- `GET /health` - 상세 헬스 체크

### 인증
- `POST /api/v1/auth/register` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `GET /api/v1/auth/me` - 현재 사용자 정보

### 매장
- `GET /api/v1/stores/{store_id}/menus` - 메뉴 목록 조회

### 주문
- `POST /api/v1/orders` - 주문 생성
- `GET /api/v1/orders/{order_id}` - 주문 조회

### 관리자
- `GET /api/v1/admin/orders` - 주문 목록 조회
- `PATCH /api/v1/admin/orders/{order_id}/status` - 주문 상태 변경

## 테스트

```bash
# 테스트 실행
pytest

# 커버리지 포함
pytest --cov=app --cov-report=html
```

## 참고 문서

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [SQLAlchemy 공식 문서](https://docs.sqlalchemy.org/)
- [Pydantic 공식 문서](https://docs.pydantic.dev/)

