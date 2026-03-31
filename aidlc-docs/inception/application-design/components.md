# Components

## Backend Components (FastAPI)

### 1. Auth Component
- **Purpose**: 인증/인가 처리
- **Responsibilities**:
  - 관리자 로그인 (JWT 발급)
  - 테이블 태블릿 로그인 (세션 토큰 발급)
  - 토큰 검증 미들웨어
  - 로그인 시도 제한

### 2. Store Component
- **Purpose**: 매장 데이터 관리
- **Responsibilities**:
  - 매장 정보 조회
  - 멀티 매장 데이터 격리 기반 제공

### 3. Table Component
- **Purpose**: 테이블 및 세션 관리
- **Responsibilities**:
  - 테이블 CRUD
  - 테이블 세션 시작/종료
  - 테이블 이용 완료 처리

### 4. Menu Component
- **Purpose**: 메뉴 및 카테고리 관리
- **Responsibilities**:
  - 메뉴 CRUD
  - 카테고리 관리
  - 메뉴 노출 순서 관리
  - 메뉴 이미지 업로드

### 5. Order Component
- **Purpose**: 주문 생성 및 관리
- **Responsibilities**:
  - 주문 생성
  - 주문 상태 변경
  - 주문 삭제
  - 주문 내역 조회 (현재 세션 / 과거 이력)

### 6. SSE Component
- **Purpose**: 실시간 이벤트 스트리밍
- **Responsibilities**:
  - SSE 연결 관리
  - 주문 이벤트 발행/구독
  - 클라이언트별 이벤트 필터링 (매장/테이블)

### 7. File Component
- **Purpose**: 파일 업로드/서빙
- **Responsibilities**:
  - 이미지 파일 업로드 (로컬 파일시스템)
  - 정적 파일 서빙

## Frontend Components

### 8. Customer App (Next.js)
- **Purpose**: 고객용 주문 인터페이스
- **Responsibilities**:
  - 자동 로그인/세션 관리
  - 메뉴 조회/탐색
  - 장바구니 관리 (로컬 저장)
  - 주문 생성
  - 주문 내역 조회 (SSE 실시간)

### 9. Admin App (Next.js)
- **Purpose**: 관리자용 매장 관리 인터페이스
- **Responsibilities**:
  - 관리자 로그인
  - 실시간 주문 모니터링 (SSE)
  - 테이블 관리
  - 메뉴 관리
  - 과거 주문 내역 조회

## Data Components

### 10. Database (PostgreSQL)
- **Purpose**: 영구 데이터 저장
- **Tables**: stores, admin_users, tables, table_sessions, categories, menus, orders, order_items, order_history
