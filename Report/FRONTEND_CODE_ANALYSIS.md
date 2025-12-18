# 프론트엔드 코드 분석 및 개선 사항 리포트

## 분석 일시
2025-12-18

## 테스트 실행 결과

### 테스트 환경 문제
- ❌ **Jest 환경 설정 오류**: `jest-environment-jsdom`이 설치되지 않음
- ❌ **Next.js lockfile 문제**: 패키지 의존성 충돌 가능성

### 해결 필요 사항
1. `jest-environment-jsdom` 재설치
2. `package-lock.json` 재생성
3. 테스트 설정 파일 점검

---

## 코드 품질 분석

### ✅ 잘 구현된 부분

1. **타입 안정성**
   - TypeScript를 적극 활용
   - 중앙화된 타입 정의 (`types/index.ts`)
   - `any` 타입 사용 최소화 (리팩토링 후)

2. **코드 구조**
   - 유틸리티 함수 분리 (`priceCalculator`, `cartUtils`, `cartStorage`)
   - 상수 분리 (`constants/prices.ts`)
   - 관심사 분리 (컴포넌트, 로직, 상태 관리)

3. **상태 관리**
   - Zustand를 활용한 전역 상태 관리
   - localStorage 동기화 구현

---

## 개선이 필요한 부분

### 🔴 High Priority (즉시 개선 필요)

#### 1. 하드코딩된 데이터 제거
**위치**: `OrderPage`, `AdminDashboard`, `AdminMenusPage`, `AdminOrdersPage`

**문제점**:
- 모든 페이지에서 `setTimeout`과 하드코딩된 데이터 사용
- 실제 API 호출이 구현되지 않음
- TODO 주석으로만 표시

**개선 방안**:
```typescript
// 현재
useEffect(() => {
  setTimeout(() => {
    setMenus([...하드코딩된 데이터])
    setLoading(false)
  }, 500)
}, [])

// 개선
const { data: menus, isLoading, error } = useMenus(storeId)
```

**우선순위**: High

#### 2. `alert()` 사용 제거
**위치**: `OrderPage:94`

**문제점**:
- 브라우저 기본 `alert()`는 사용자 경험 저하
- 접근성 문제
- 스타일링 불가능

**개선 방안**:
- Toast 알림 라이브러리 도입 (react-hot-toast, sonner 등)
- 또는 커스텀 Modal 컴포넌트 구현

**우선순위**: High

#### 3. 에러 처리 부재
**위치**: 모든 API 호출 위치

**문제점**:
- 네트워크 에러 처리 없음
- 로딩 실패 시 사용자 피드백 없음
- Error Boundary 미구현

**개선 방안**:
- React Query의 에러 핸들링 활용
- Error Boundary 컴포넌트 구현
- 사용자 친화적 에러 메시지 표시

**우선순위**: High

#### 4. 이미지 URL 하드코딩
**위치**: `MenuCard.tsx:51-73`

**문제점**:
- 긴 if-else 체인
- 새로운 메뉴 추가 시 코드 수정 필요
- 확장성 부족

**개선 방안**:
```typescript
// constants/images.ts
export const MENU_IMAGES: Record<string, string> = {
  '에스프레소': 'https://...',
  '아메리카노(ICE)': 'https://...',
  // ...
}
```

**우선순위**: High

---

### 🟡 Medium Priority (단기 개선)

#### 5. 접근성(A11y) 개선
**위치**: 모든 컴포넌트

**문제점**:
- 버튼에 `aria-label` 부족
- 키보드 네비게이션 미고려
- 스크린 리더 지원 부족

**개선 방안**:
```typescript
<button
  onClick={handleAddToCart}
  aria-label={`${menu.name} 장바구니에 추가`}
  className="..."
>
  담기
</button>
```

**우선순위**: Medium

#### 6. 성능 최적화
**위치**: `MenuCard`, `ShoppingCart`

**문제점**:
- `calculatePrice()`가 매 렌더링마다 호출
- `getCoffeeImageUrl()`가 매 렌더링마다 호출
- 불필요한 리렌더링 가능성

**개선 방안**:
```typescript
// useMemo 활용
const totalPrice = useMemo(
  () => calculatePrice(),
  [menu.price, shotAdded, syrupAdded, quantity]
)
```

**우선순위**: Medium

#### 7. 로딩 상태 개선
**위치**: `OrderPage`, `AdminDashboard`

**문제점**:
- 단순 텍스트만 표시
- 스켈레톤 UI 없음
- 사용자 경험 저하

**개선 방안**:
- 스켈레톤 UI 컴포넌트 구현
- 로딩 애니메이션 추가

**우선순위**: Medium

#### 8. 중복 코드
**위치**: `ShoppingCart.tsx:95-107`

**문제점**:
- 아이템 목록이 두 번 렌더링됨 (왼쪽, 오른쪽)
- `getItemDisplayName`, `calculateItemPrice` 중복 호출

**개선 방안**:
- 컴포넌트 분리 또는 메모이제이션

**우선순위**: Medium

---

### 🟢 Low Priority (장기 개선)

#### 9. 이미지 최적화
**위치**: `MenuCard.tsx:79-90`

**문제점**:
- Next.js Image 컴포넌트 미사용
- 이미지 프리로딩 없음
- 레이지 로딩 미적용

**개선 방안**:
```typescript
import Image from 'next/image'

<Image
  src={getCoffeeImageUrl()}
  alt={menu.name}
  width={400}
  height={400}
  loading="lazy"
  placeholder="blur"
/>
```

**우선순위**: Low

#### 10. 폼 검증 개선
**위치**: `AdminMenusPage`

**문제점**:
- 클라이언트 사이드 검증만 존재
- 서버 사이드 검증 없음

**우선순위**: Low

#### 11. 국제화(i18n) 지원
**위치**: 모든 컴포넌트

**문제점**:
- 하드코딩된 한국어 텍스트
- 다국어 지원 없음

**우선순위**: Low

---

## 컴포넌트별 상세 분석

### MenuCard.tsx

**장점**:
- 명확한 props 타입 정의
- 가격 계산 로직이 유틸 함수로 분리됨
- 옵션 상태 관리가 명확함

**개선 사항**:
1. `getCoffeeImageUrl()` 함수를 설정 객체로 분리 (High)
2. `calculatePrice()`를 `useMemo`로 최적화 (Medium)
3. 접근성 속성 추가 (Medium)
4. Next.js Image 컴포넌트 사용 (Low)

### ShoppingCart.tsx

**장점**:
- 가격 계산 로직이 유틸 함수로 분리됨
- 빈 장바구니 상태 처리
- 반응형 레이아웃

**개선 사항**:
1. 아이템 목록 중복 렌더링 제거 (Medium)
2. 수량 조절 기능 추가 (Medium)
3. 접근성 속성 추가 (Medium)

### OrderPage.tsx

**장점**:
- 컴포넌트 분리가 잘 되어 있음
- 타입 안정성 확보

**개선 사항**:
1. 하드코딩된 데이터를 API 호출로 대체 (High)
2. `alert()` 제거 (High)
3. 에러 처리 추가 (High)
4. 로딩 상태 개선 (Medium)

### AdminDashboard.tsx

**장점**:
- 통계 계산 로직이 명확함
- 상태 관리가 체계적

**개선 사항**:
1. 하드코딩된 데이터를 API 호출로 대체 (High)
2. 재고 변경 시 API 호출 추가 (High)
3. 주문 접수 시 API 호출 추가 (High)

---

## 유틸리티 함수 분석

### priceCalculator.ts ✅
- 잘 구현됨
- 단일 책임 원칙 준수
- 테스트 가능한 구조

### cartUtils.ts ✅
- 잘 구현됨
- 옵션 비교 로직이 명확함
- 재사용 가능한 함수들

### cartStorage.ts ✅
- 잘 구현됨
- 에러 처리 포함
- 타입 안정성 확보

---

## 타입 정의 분석

### types/index.ts ✅
- 중앙화된 타입 정의
- 명확한 인터페이스
- 확장 가능한 구조

**개선 사항**:
- `Menu` 타입에 `description` 필드 추가 (이미 있음)
- `OrderStatus` 타입이 여러 곳에 중복 정의됨 → 통합 필요

---

## 상태 관리 분석

### cartStore.ts ✅
- Zustand 활용 적절
- localStorage 동기화 구현
- 타입 안정성 확보

**개선 사항**:
- 에러 처리 개선 (localStorage 실패 시)
- 옵티미스틱 업데이트 고려

---

## API 클라이언트 분석

### api.ts
**장점**:
- Axios 인터셉터 활용
- 인증 토큰 자동 추가
- 401 에러 처리

**개선 사항**:
1. 재시도 로직 추가 (Medium)
2. 타임아웃 설정 (Medium)
3. 에러 타입 정의 (Medium)

---

## 테스트 커버리지

### 현재 상태
- ❌ 테스트 환경 설정 문제로 테스트 실행 불가
- ⚠️ 테스트 파일은 존재하나 실행되지 않음

### 필요한 테스트
1. **컴포넌트 테스트**
   - MenuCard 렌더링 및 상호작용
   - ShoppingCart 렌더링 및 상호작용
   - OrderPage 통합 테스트

2. **유틸리티 함수 테스트**
   - priceCalculator 테스트
   - cartUtils 테스트
   - cartStorage 테스트

3. **상태 관리 테스트**
   - cartStore 테스트

---

## 종합 개선 계획

### Phase 1: 긴급 개선 (1주)
1. ✅ 타입 정의 통합 (완료)
2. ✅ 상수 추출 (완료)
3. ✅ 가격 계산 로직 통합 (완료)
4. ⏳ 하드코딩된 데이터 제거
5. ⏳ `alert()` 제거
6. ⏳ 에러 처리 추가

### Phase 2: 단기 개선 (2주)
1. 이미지 URL 관리 개선
2. 접근성 개선
3. 성능 최적화
4. 로딩 상태 개선
5. 테스트 환경 수정 및 테스트 작성

### Phase 3: 장기 개선 (1개월)
1. 이미지 최적화
2. 국제화 지원
3. 고급 에러 처리
4. 모니터링 및 로깅

---

## 우선순위별 체크리스트

### High Priority
- [ ] 하드코딩된 데이터를 API 호출로 대체
- [ ] `alert()` 제거 및 Toast 알림 구현
- [ ] Error Boundary 구현
- [ ] 이미지 URL 관리 개선
- [ ] 테스트 환경 수정

### Medium Priority
- [ ] 접근성 속성 추가
- [ ] 성능 최적화 (useMemo, useCallback)
- [ ] 스켈레톤 UI 구현
- [ ] 중복 렌더링 제거
- [ ] API 클라이언트 개선

### Low Priority
- [ ] Next.js Image 컴포넌트 사용
- [ ] 국제화 지원
- [ ] 고급 에러 처리
- [ ] 모니터링 도구 연동

---

## 결론

프론트엔드 코드는 전반적으로 잘 구조화되어 있으며, 최근 리팩토링을 통해 타입 안정성과 코드 재사용성이 크게 향상되었습니다. 

하지만 **하드코딩된 데이터**, **에러 처리 부재**, **사용자 경험 개선** 등의 영역에서 즉시 개선이 필요합니다.

가장 우선적으로 해결해야 할 사항:
1. 실제 API 연동
2. 에러 처리 및 사용자 피드백 개선
3. 테스트 환경 수정 및 테스트 작성

