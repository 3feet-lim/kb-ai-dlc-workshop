# Application Design - Consolidated

## Architecture Overview

3-tier 아키텍처: Frontend (Next.js x2) → Backend (FastAPI) → Database (PostgreSQL)

### Design Decisions
- **API 구조**: 도메인별 라우터 분리 (stores, tables, menus, orders, auth, sse, files)
- **데이터 접근**: Repository 패턴 (도메인별 Repository 클래스)
- **실시간 통신**: In-memory 이벤트 버스 기반 SSE
- **파일 저장**: 서버 로컬 파일시스템 (Docker 볼륨 마운트)

## System Components

| # | Component | Type | Purpose |
|---|-----------|------|---------|
| 1 | Auth | Backend | 인증/인가 (JWT, 세션 토큰) |
| 2 | Store | Backend | 매장 데이터 관리 |
| 3 | Table | Backend | 테이블/세션 관리 |
| 4 | Menu | Backend | 메뉴/카테고리 관리 |
| 5 | Order | Backend | 주문 생성/관리 |
| 6 | SSE | Backend | 실시간 이벤트 스트리밍 |
| 7 | File | Backend | 파일 업로드/서빙 |
| 8 | Customer App | Frontend | 고객 주문 UI |
| 9 | Admin App | Frontend | 관리자 대시보드 UI |
| 10 | PostgreSQL | Database | 영구 데이터 저장 |

## Service Layer

| Service | Orchestrates | Key Workflow |
|---------|-------------|--------------|
| AuthService | Auth + Repos | 로그인 → 인증 → 토큰 발급 |
| TableService | Table + Order + SSE | 세션 관리, 이용 완료 처리 |
| MenuService | Menu + File | 메뉴 CRUD + 이미지 업로드 |
| OrderService | Order + Table + SSE | 주문 생성/상태 변경 + 실시간 알림 |
| SSEService | SSE (in-memory) | 이벤트 구독/발행 |

## Key Data Flow

```
Customer App ──HTTP/SSE──> FastAPI ──SQL──> PostgreSQL
Admin App ────HTTP/SSE──> FastAPI ──SQL──> PostgreSQL
```

주문 생성 시: Customer → OrderService → DB 저장 → SSE 발행 → Admin/Customer 실시간 수신

## Detailed References
- Components: [components.md](components.md)
- Methods: [component-methods.md](component-methods.md)
- Services: [services.md](services.md)
- Dependencies: [component-dependency.md](component-dependency.md)
