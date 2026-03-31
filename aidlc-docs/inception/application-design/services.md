# Services

## Service Layer Architecture

서비스 레이어는 컴포넌트 간 조율과 비즈니스 워크플로우를 담당합니다.

## 1. AuthService
- **Orchestrates**: Auth Component + Store Repository + Admin User Repository + Table Repository
- **Workflows**:
  - 관리자 로그인: 매장 확인 → 사용자 인증 → JWT 발급
  - 테이블 로그인: 매장 확인 → 테이블 인증 → 세션 토큰 발급

## 2. TableService
- **Orchestrates**: Table Component + Order Component + SSE Component
- **Workflows**:
  - 테이블 설정: 테이블 생성 → 비밀번호 설정
  - 이용 완료: 현재 주문 → 이력 이동 → 세션 종료 → SSE 이벤트 발행

## 3. MenuService
- **Orchestrates**: Menu Component + File Component
- **Workflows**:
  - 메뉴 등록: 이미지 업로드 → 메뉴 데이터 저장
  - 메뉴 수정: 이미지 교체(선택) → 메뉴 데이터 업데이트

## 4. OrderService
- **Orchestrates**: Order Component + Table Component + SSE Component
- **Workflows**:
  - 주문 생성: 세션 확인 → 주문 저장 → SSE 이벤트 발행(신규 주문)
  - 상태 변경: 주문 업데이트 → SSE 이벤트 발행(상태 변경)
  - 주문 삭제: 주문 삭제 → 총액 재계산 → SSE 이벤트 발행(삭제)

## 5. SSEService
- **Orchestrates**: SSE Component (In-memory 이벤트 버스)
- **Workflows**:
  - 구독: 클라이언트 등록 → 매장/테이블 필터 설정 → EventStream 반환
  - 발행: 이벤트 수신 → 구독자 필터링 → 이벤트 전송
