# Logical Components - All Units

## Backend API Logical Architecture

```
FastAPI Application
├── core/
│   ├── config.py          # Settings (Pydantic BaseSettings)
│   ├── database.py        # AsyncSession factory, engine
│   ├── security.py        # JWT encode/decode, password hashing
│   └── events.py          # SSE EventBus (in-memory)
├── routers/
│   ├── auth.py            # POST /auth/admin-login, /auth/table-login
│   ├── stores.py          # GET /stores/{id}
│   ├── tables.py          # CRUD + POST /tables/{id}/complete-session
│   ├── categories.py      # CRUD /categories
│   ├── menus.py           # CRUD /menus
│   ├── orders.py          # CRUD + PATCH /orders/{id}/status
│   ├── sse.py             # GET /sse/orders (EventStream)
│   └── files.py           # POST /files/upload
├── services/
│   ├── auth_service.py
│   ├── table_service.py
│   ├── menu_service.py
│   ├── order_service.py
│   └── sse_service.py
├── repositories/
│   ├── store_repo.py
│   ├── admin_user_repo.py
│   ├── table_repo.py
│   ├── table_session_repo.py
│   ├── category_repo.py
│   ├── menu_repo.py
│   ├── order_repo.py
│   └── daily_order_counter_repo.py
├── models/               # SQLAlchemy ORM models
│   ├── store.py
│   ├── admin_user.py
│   ├── table.py
│   ├── table_session.py
│   ├── category.py
│   ├── menu.py
│   ├── order.py
│   ├── order_item.py
│   ├── order_history.py
│   └── daily_order_counter.py
├── schemas/              # Pydantic request/response schemas
│   ├── auth.py
│   ├── table.py
│   ├── category.py
│   ├── menu.py
│   ├── order.py
│   └── sse.py
└── tests/
    ├── test_auth.py
    ├── test_orders.py
    ├── test_menus.py
    ├── test_tables.py
    ├── pbt/              # Property-based tests
    │   ├── generators.py # Domain generators (PBT-07)
    │   ├── test_order_properties.py
    │   ├── test_serialization.py
    │   └── test_session_stateful.py
    └── conftest.py

## Customer Frontend Logical Architecture

customer-web/src/
├── app/                  # Next.js App Router
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── menu/page.tsx
│   ├── cart/page.tsx
│   ├── orders/page.tsx
│   └── order-success/page.tsx
├── components/
│   ├── CategoryNav.tsx
│   ├── MenuGrid.tsx
│   ├── MenuCard.tsx
│   ├── CartItem.tsx
│   ├── CartSummary.tsx
│   ├── OrderCard.tsx
│   ├── OrderConfirmModal.tsx
│   └── BottomNav.tsx
├── lib/
│   ├── api.ts            # API client (fetch wrapper)
│   ├── auth.ts           # Token management
│   └── cart.ts           # localStorage cart logic
├── hooks/
│   ├── useCart.ts
│   ├── useSSE.ts
│   └── useAuth.ts
└── __tests__/
    ├── cart.test.ts
    └── pbt/
        ├── generators.ts
        └── cart.property.test.ts

## Admin Frontend Logical Architecture

admin-web/src/
├── app/
│   ├── layout.tsx
│   ├── login/page.tsx
│   ├── dashboard/page.tsx
│   ├── tables/page.tsx
│   └── menus/page.tsx
├── components/
│   ├── TableGrid.tsx
│   ├── TableCard.tsx
│   ├── OrderDetailModal.tsx
│   ├── StatusButtons.tsx
│   ├── CompleteSessionModal.tsx
│   ├── OrderHistoryModal.tsx
│   ├── CategorySidebar.tsx
│   ├── MenuList.tsx
│   ├── MenuFormModal.tsx
│   ├── TableSetupForm.tsx
│   └── SideNav.tsx
├── lib/
│   ├── api.ts
│   └── auth.ts
├── hooks/
│   ├── useSSE.ts
│   └── useAuth.ts
└── __tests__/
    └── pbt/
        └── generators.ts
```
