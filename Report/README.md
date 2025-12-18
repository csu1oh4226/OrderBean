# 테스트 커버리지 리포트

이 폴더에는 OrderBean 프로젝트의 테스트 커버리지 리포트가 저장됩니다.

## 폴더 구조

```
Report/
├── README.md                    # 이 파일
├── COVERAGE_REPORT.md           # 커버리지 상세 리포트
├── coverage/                     # Jest 커버리지 리포트
│   ├── backend/                 # Backend 커버리지 리포트
│   │   ├── index.html          # HTML 리포트 (브라우저에서 열기)
│   │   ├── lcov.info           # LCOV 형식 리포트
│   │   └── coverage-final.json  # JSON 형식 리포트
│   └── frontend/                # Frontend 커버리지 리포트
│       ├── index.html          # HTML 리포트
│       ├── lcov.info           # LCOV 형식 리포트
│       └── coverage-final.json  # JSON 형식 리포트
└── backend-coverage-output.txt  # Backend 테스트 실행 로그
```

## 리포트 확인 방법

### HTML 리포트 (권장)

1. **Backend 리포트**
   - `coverage/backend/index.html` 파일을 브라우저에서 열기
   - 파일별 상세 커버리지 확인 가능

2. **Frontend 리포트**
   - `coverage/frontend/index.html` 파일을 브라우저에서 열기
   - 컴포넌트별 커버리지 확인 가능

### 텍스트 리포트

- `COVERAGE_REPORT.md`: 마크다운 형식의 상세 리포트
- `backend-coverage-output.txt`: Backend 테스트 실행 로그

## 리포트 생성 방법

### Backend 커버리지 리포트 생성

```bash
cd backend
npm run test:coverage
```

생성된 리포트는 `Report/coverage/backend/` 폴더에 저장됩니다.

### Frontend 커버리지 리포트 생성

```bash
cd frontend
npm run test:coverage
```

생성된 리포트는 `Report/coverage/frontend/` 폴더에 저장됩니다.

## 리포트 형식

### HTML 리포트
- 파일별 커버리지 시각화
- 라인별 커버 여부 표시
- 브라우저에서 바로 확인 가능

### LCOV 리포트
- CI/CD 통합에 사용
- 코드 커버리지 도구와 호환

### JSON 리포트
- 프로그래밍 방식으로 파싱 가능
- 자동화 스크립트에서 사용

## 커버리지 목표

- **Statements**: 80% 이상
- **Branches**: 70% 이상
- **Functions**: 85% 이상
- **Lines**: 80% 이상

## 업데이트 주기

커버리지 리포트는 다음 시점에 업데이트됩니다:

- 주요 기능 구현 완료 시
- 테스트 케이스 추가 시
- 리팩토링 후
- 배포 전

---

**마지막 업데이트**: 2025-12-15


