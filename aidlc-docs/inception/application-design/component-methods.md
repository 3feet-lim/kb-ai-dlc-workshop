# Component Methods

> Note: 상세 비즈니스 규칙은 Functional Design (CONSTRUCTION) 단계에서 정의

## Auth Component

| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `admin_login(store_id, username, password)` | str, str, str | JWT token | 관리자 로그인 |
| `table_login(store_id, table_number, password)` | str, int, str | Session token | 테이블 태블릿 로그인 |
| `verify_admin_token(token)` | str | AdminUser | JWT 토큰 검증 |
| `verify_table_token(token)` | str | TableSession | 테이블 세션 토큰 검증 |

## Store Component

| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `get_store(store_id)` | str | Store | 매장 정보 조회 |

## Table Component

| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `create_table(store_id, table_number, password)` | str, int, str | Table | 테이블 생성/설정 |
| `get_tables(store_id)` | str | List[Table] | 매장 테이블 목록 |
| `start_session(store_id, table_id)` | str, int | TableSession | 테이블 세션 시작 |
| `end_session(store_id, table_id)` | str, int | None | 이용 완료 처리 |

## Menu Component

| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `get_categories(store_id)` | str | List[Category] | 카테고리 목록 |
| `get_menus(store_id, category_id?)` | str, int? | List[Menu] | 메뉴 목록 |
| `create_menu(store_id, menu_data)` | str, MenuCreate | Menu | 메뉴 등록 |
| `update_menu(store_id, menu_id, menu_data)` | str, int, MenuUpdate | Menu | 메뉴 수정 |
| `delete_menu(store_id, menu_id)` | str, int | None | 메뉴 삭제 |
| `update_menu_order(store_id, menu_orders)` | str, List[MenuOrder] | None | 노출 순서 변경 |
| `upload_image(file)` | UploadFile | str (URL) | 이미지 업로드 |

## Order Component

| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `create_order(store_id, table_id, session_id, items)` | str, int, str, List[OrderItem] | Order | 주문 생성 |
| `get_orders(store_id, table_id, session_id)` | str, int, str | List[Order] | 현재 세션 주문 조회 |
| `get_all_orders(store_id)` | str | List[Order] | 매장 전체 주문 (관리자) |
| `update_order_status(store_id, order_id, status)` | str, int, OrderStatus | Order | 주문 상태 변경 |
| `delete_order(store_id, order_id)` | str, int | None | 주문 삭제 |
| `get_order_history(store_id, table_id, date?)` | str, int, date? | List[OrderHistory] | 과거 주문 내역 |

## SSE Component

| Method | Input | Output | Purpose |
|--------|-------|--------|---------|
| `subscribe(store_id, client_type, table_id?)` | str, str, int? | EventStream | SSE 구독 |
| `publish_order_event(store_id, event)` | str, OrderEvent | None | 주문 이벤트 발행 |
