# Unit of Work Dependencies

## Dependency Matrix

| Unit | Depends On | Communication |
|------|-----------|---------------|
| Backend API | PostgreSQL | SQL (SQLAlchemy) |
| Customer Frontend | Backend API | HTTP REST + SSE |
| Admin Frontend | Backend API | HTTP REST + SSE |

## Dependency Diagram

```
Customer Frontend ──HTTP/SSE──┐
                              ├──> Backend API ──SQL──> PostgreSQL
Admin Frontend ───HTTP/SSE────┘
```

## Inter-Unit Contracts

### Backend API → Frontends
- REST API endpoints (JSON)
- SSE event stream (text/event-stream)
- Static file serving (메뉴 이미지)

### Shared Concerns
- API 스펙을 기반으로 프론트엔드 동시 개발
- 인증 토큰 형식 (JWT for admin, session token for customer)
- SSE 이벤트 형식 통일

## Development Order
- 동시 개발 (API 스펙 기반)
- Backend API가 데이터 모델과 API 스펙을 먼저 정의
- Frontend는 API 스펙에 맞춰 개발
