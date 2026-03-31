# Component Dependencies

## Dependency Matrix

| Component | Depends On |
|-----------|-----------|
| Auth | Store Repo, AdminUser Repo, Table Repo |
| Table | Table Repo, TableSession Repo, Order Repo, SSE |
| Menu | Menu Repo, Category Repo, File |
| Order | Order Repo, OrderItem Repo, TableSession Repo, SSE |
| SSE | (standalone - in-memory event bus) |
| File | (standalone - local filesystem) |
| Customer App | Auth API, Menu API, Order API, SSE API |
| Admin App | Auth API, Menu API, Order API, Table API, SSE API, File API |

## Communication Patterns

```
Customer App ──HTTP/SSE──> FastAPI Backend ──SQL──> PostgreSQL
Admin App ────HTTP/SSE──> FastAPI Backend ──SQL──> PostgreSQL
                              │
                              ├── Auth (JWT/Session Token)
                              ├── Store Router
                              ├── Table Router
                              ├── Menu Router
                              ├── Order Router
                              ├── SSE Router (EventStream)
                              └── File Router (Static)
```

## Data Flow

### 주문 생성 플로우
```
Customer App → POST /orders → OrderService
  → OrderRepo.create() → DB
  → SSEService.publish(new_order) → Admin App (SSE)
  → SSEService.publish(new_order) → Customer App (SSE)
```

### 주문 상태 변경 플로우
```
Admin App → PATCH /orders/{id}/status → OrderService
  → OrderRepo.update_status() → DB
  → SSEService.publish(status_changed) → Admin App (SSE)
  → SSEService.publish(status_changed) → Customer App (SSE)
```

### 이용 완료 플로우
```
Admin App → POST /tables/{id}/complete → TableService
  → OrderRepo.move_to_history() → DB
  → TableSessionRepo.end_session() → DB
  → SSEService.publish(session_ended) → Customer App (SSE)
```
