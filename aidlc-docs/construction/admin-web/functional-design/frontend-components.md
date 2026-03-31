# Frontend Components - Admin Web

## Page Structure

### /login (관리자 로그인)
- **AdminLoginForm**: 매장 ID, 사용자명, 비밀번호 입력 폼
- JWT 토큰을 localStorage에 저장, /dashboard로 이동

### /dashboard (주문 모니터링 - 기본 화면)
- **TableFilter**: 테이블 필터 드롭다운
- **TableGrid**: 테이블별 카드 그리드 레이아웃
  - **TableCard**: 테이블 번호, 총 주문액, 최신 주문 미리보기
    - 클릭 시 **OrderDetailModal** 표시
- **OrderDetailModal**: 테이블 전체 주문 목록 상세
  - **OrderDetail**: 주문 번호, 시각, 메뉴 목록, 금액
  - **StatusButtons**: 상태 변경 버튼 (대기중→준비중→완료)
  - **DeleteOrderButton**: 주문 삭제 (확인 팝업)
- **TableActions**: 이용 완료 버튼, 과거 내역 버튼
- **CompleteSessionModal**: 이용 완료 확인 팝업
- **OrderHistoryModal**: 과거 주문 내역 (날짜 필터, 시간 역순)
- SSE 연결로 실시간 주문 업데이트, 신규 주문 시각적 강조

### /tables (테이블 관리)
- **TableList**: 테이블 목록
- **TableSetupForm**: 테이블 번호, 비밀번호 설정 폼

### /menus (메뉴 관리)
- **CategorySidebar**: 카테고리 목록 + CRUD 버튼
  - **CategoryForm**: 카테고리 추가/수정 폼
- **MenuList**: 카테고리별 메뉴 목록 (드래그 정렬)
  - **MenuItem**: 메뉴명, 가격, 이미지 썸네일, 수정/삭제 버튼
- **MenuFormModal**: 메뉴 등록/수정 폼
  - 메뉴명, 가격, 설명, 카테고리 선택, 이미지 업로드
  - 필수 필드/가격 범위 검증

## Side Navigation
- **SideNav**: 대시보드 | 테이블 관리 | 메뉴 관리 (3메뉴)

## State Management
- **인증**: localStorage에 JWT 저장, 만료 시 /login 리다이렉트
- **SSE**: 대시보드에서 EventSource 연결, 주문 이벤트 수신
- **주문 데이터**: SSE 이벤트로 실시간 갱신

## API Integration
| Component | Endpoint |
|-----------|----------|
| AdminLoginForm | POST /auth/admin-login |
| TableGrid | GET /orders?store_id (전체) |
| StatusButtons | PATCH /orders/{id}/status |
| DeleteOrderButton | DELETE /orders/{id} |
| CompleteSessionModal | POST /tables/{id}/complete-session |
| OrderHistoryModal | GET /orders/history?store_id&table_id&date |
| TableSetupForm | POST /tables |
| CategorySidebar | GET/POST/PUT/DELETE /categories |
| MenuList | GET /menus?store_id&category_id |
| MenuFormModal | POST/PUT /menus |
| MenuFormModal (이미지) | POST /files/upload |
| Dashboard (실시간) | SSE /sse/orders?store_id |
