# Business Logic Model - Backend API

## Service Workflows

### AuthService

#### admin_login(store_code, username, password)
1. Store 조회 (store_code) → 없으면 401
2. AdminUser 조회 (store_id + username) → 없으면 401
3. locked_until 확인 → 잠금 중이면 423
4. bcrypt 비밀번호 검증 → 실패 시 failed_login_attempts++, 5회 시 잠금
5. 성공 시 failed_login_attempts=0, JWT 발급 (16h)

#### table_login(store_code, table_number, password)
1. Store 조회 (store_code) → 없으면 401
2. Table 조회 (store_id + table_number) → 없으면 401
3. bcrypt 비밀번호 검증 → 실패 시 401
4. 성공 시 세션 토큰 발급 (16h, store_id+table_id 포함)

### OrderService

#### create_order(store_id, table_id, items)
1. 항목 검증: items 비어있으면 400
2. 각 메뉴 존재/available 확인 → 없으면 404
3. 활성 세션 확인 → 없으면 새 TableSession 생성 (첫 주문)
4. DailyOrderCounter에서 주문번호 생성 (atomic increment)
5. Order + OrderItems 생성 (메뉴명/단가 스냅샷)
6. total_amount 계산
7. SSE 이벤트 발행 (new_order)
8. Order 반환

#### update_order_status(store_id, order_id, new_status)
1. Order 조회 → 없으면 404
2. 상태 전이 검증 (PENDING→PREPARING→COMPLETED만 허용)
3. 상태 업데이트
4. SSE 이벤트 발행 (status_changed)

#### delete_order(store_id, order_id)
1. Order 조회 → 없으면 404
2. Order + OrderItems 삭제
3. SSE 이벤트 발행 (order_deleted)

### TableService

#### end_session(store_id, table_id)
1. 활성 세션 조회 → 없으면 404
2. 해당 세션의 모든 Order를 OrderHistory로 이동 (JSON 스냅샷)
3. 세션 종료 (is_active=false, ended_at 설정)
4. SSE 이벤트 발행 (session_ended)

### MenuService

#### create_menu(store_id, menu_data)
1. 카테고리 존재 확인 (해당 매장) → 없으면 404
2. 필수 필드 검증 (name, price, category_id)
3. 가격 검증 (>= 0)
4. Menu 생성

#### upload_image(store_id, file)
1. 확장자 검증 (jpg/jpeg/png/gif/webp)
2. 파일명 UUID 변환
3. /uploads/{store_id}/ 디렉토리에 저장
4. URL 반환

### SSEService

#### subscribe(store_id, client_type, table_id?)
1. 클라이언트 등록 (store_id + client_type + table_id)
2. EventStream 반환
3. 연결 종료 시 클라이언트 제거

#### publish(store_id, event)
1. 해당 store_id 구독자 필터링
2. admin 클라이언트: 모든 이벤트 수신
3. customer 클라이언트: 자신의 table_id 이벤트만 수신
4. 이벤트 전송

## Testable Properties (PBT-01)

### Round-trip Properties (PBT-02)
- Order → JSON serialization → deserialization = 원본 Order
- Menu → API response serialization → deserialization = 원본 Menu

### Invariant Properties (PBT-03)
- Order.total_amount == sum(item.quantity * item.unit_price) for all items
- 주문 생성 후 OrderItems 수 == 입력 items 수
- 카테고리 삭제 시 해당 카테고리 메뉴 수 > 0이면 항상 실패

### Idempotency Properties (PBT-04)
- 동일 주문 상태로의 전이는 idempotent (PENDING→PENDING은 에러지만 결과 상태 불변)

### Stateful Properties (PBT-06)
- 장바구니: add/remove/update 시퀀스 후 총액 == 남은 항목들의 합
- 테이블 세션: start→orders→end 시퀀스 후 활성 주문 0개

### No PBT Properties Identified
- File upload: I/O 작업, PBT 부적합
- SSE publish: 외부 통신, PBT 부적합
