# NFR Design Patterns - All Units

## 1. Authentication Pattern

### Backend: JWT + Session Token
- **Admin**: JWT 토큰 (python-jose), 16h 만료, Authorization header
- **Customer**: 세션 토큰 (JWT 형식), 16h 만료, store_id+table_id 포함
- **Middleware**: FastAPI Depends로 인증 미들웨어 구현
  - `get_current_admin(token)` → AdminUser
  - `get_current_table(token)` → TableSession info
- **Login Rate Limiting**: 인메모리 카운터 (5회 실패 → 30분 잠금)

### Frontend: Token Storage
- localStorage에 토큰 저장
- API 요청 시 Authorization header 자동 첨부
- 401 응답 시 로그인 페이지 리다이렉트

## 2. Real-time Communication Pattern (SSE)

### Backend: In-memory Event Bus
```
EventBus (asyncio.Queue per client)
  ├── subscribe(store_id, client_type, table_id?) → AsyncGenerator
  ├── publish(store_id, event) → broadcast to matching subscribers
  └── unsubscribe(client_id) → cleanup on disconnect
```
- FastAPI StreamingResponse로 SSE 엔드포인트 구현
- 클라이언트 연결 시 asyncio.Queue 생성
- 이벤트 발행 시 store_id 매칭 구독자에게 전송
- Admin: 매장 전체 이벤트 수신
- Customer: 자신의 table_id 이벤트만 수신

### Frontend: EventSource
- EventSource API로 SSE 연결
- 연결 끊김 시 자동 재연결 (EventSource 기본 동작)
- 이벤트 수신 시 React state 업데이트

## 3. Data Access Pattern (Repository)

### Backend: Async Repository
```
Router → Service → Repository → SQLAlchemy AsyncSession → PostgreSQL
```
- 각 도메인별 Repository 클래스 (StoreRepo, TableRepo, MenuRepo, OrderRepo 등)
- 모든 Repository 메서드에 store_id 필터 강제 (멀티 매장 격리)
- AsyncSession을 FastAPI Depends로 주입
- 트랜잭션: async with session.begin()

## 4. Multi-tenancy Pattern

### Store-based Data Isolation
- 모든 테이블에 store_id FK
- Repository 레이어에서 store_id 조건 자동 적용
- 인증 토큰에서 store_id 추출 → Repository에 전달
- 잘못된 store_id 접근 시 403 Forbidden

## 5. File Storage Pattern

### Local Filesystem + Static Serving
- 업로드: `/uploads/{store_id}/{uuid}.{ext}`
- 서빙: FastAPI StaticFiles mount (`/static/uploads`)
- Docker 볼륨: `./uploads:/app/uploads`

## 6. Error Handling Pattern

### Backend: Structured Error Response
```json
{
  "detail": "Error message",
  "error_code": "ORDER_NOT_FOUND"
}
```
- FastAPI HTTPException으로 에러 반환
- 비즈니스 에러: 400/404/403/409
- 인증 에러: 401/423

### Frontend: Error Boundary + Toast
- API 에러 시 사용자 친화적 메시지 표시
- 네트워크 에러 시 재시도 안내
