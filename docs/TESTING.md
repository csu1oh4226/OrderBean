# 테스트 가이드

이 문서는 OrderBean 프로젝트의 테스트 작성 및 실행 방법을 안내합니다.

## 테스트 전략

이 프로젝트는 **TDD (Test-Driven Development)** 방식을 따릅니다:

1. **Red**: 실패하는 테스트 작성
2. **Green**: 테스트를 통과하는 최소한의 코드 작성
3. **Refactor**: 코드 개선

## 테스트 구조

### Backend 테스트

```
backend/
├── src/
│   └── __tests__/
│       ├── setup.ts              # 테스트 설정
│       ├── auth.test.ts          # 인증 API 테스트
│       ├── stores.test.ts        # 매장 API 테스트
│       ├── orders.test.ts        # 주문 API 테스트
│       ├── admin.test.ts         # 관리자 API 테스트
│       └── integration.test.ts  # 통합 테스트
```

### Frontend 테스트

```
frontend/
├── src/
│   └── __tests__/
│       ├── Home.test.tsx         # 홈 페이지 테스트
│       ├── api.test.ts           # API 클라이언트 테스트
│       └── types.test.ts         # 타입 정의 테스트
```

## 테스트 실행

### Backend 테스트

```bash
cd backend

# 모든 테스트 실행
npm test

# Watch 모드로 실행
npm run test:watch

# 커버리지 확인
npm run test:coverage
```

### Frontend 테스트

```bash
cd frontend

# 모든 테스트 실행
npm test

# Watch 모드로 실행
npm run test:watch

# 커버리지 확인
npm run test:coverage
```

## 테스트 작성 가이드

### Backend API 테스트 예시

```typescript
describe('POST /api/auth/register', () => {
  it('should register a new user with valid data', async () => {
    const userData = {
      name: 'Test User',
      phone: '01012345678',
      password: 'password123',
    }

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201)

    expect(response.body).toHaveProperty('user')
  })
})
```

### Frontend 컴포넌트 테스트 예시

```typescript
describe('Home Page', () => {
  it('should render OrderBean title', () => {
    render(<Home />)
    const title = screen.getByText(/OrderBean/i)
    expect(title).toBeInTheDocument()
  })
})
```

## 현재 상태 (Red 단계)

현재 모든 테스트는 **실패 상태**입니다. 이는 의도된 것입니다:

- ✅ 테스트 케이스 작성 완료
- ❌ 실제 구현 코드 없음 (TODO 상태)
- 🎯 다음 단계: Green 단계에서 테스트를 통과하도록 구현

## 테스트 커버리지 목표

- **단위 테스트**: 80% 이상
- **통합 테스트**: 주요 플로우 커버
- **E2E 테스트**: 핵심 사용자 시나리오

## 참고 자료

- [Jest 공식 문서](https://jestjs.io/)
- [Supertest 공식 문서](https://github.com/visionmedia/supertest)
- [React Testing Library](https://testing-library.com/react)


