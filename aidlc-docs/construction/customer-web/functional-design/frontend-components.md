# Frontend Components - Customer Web

## Page Structure

### /login (초기 설정 페이지)
- **TableLoginForm**: 매장 ID, 테이블 번호, 비밀번호 입력 폼
- 로그인 성공 시 credentials를 localStorage에 저장, /menu로 이동

### /menu (메뉴 페이지 - 기본 화면)
- **CategoryNav**: 카테고리 탭 네비게이션 (가로 스크롤)
- **MenuGrid**: 카드 형태 메뉴 목록 (카테고리별 필터)
  - **MenuCard**: 메뉴 이미지, 이름, 가격, 설명, 추가 버튼
- **CartFloatingButton**: 장바구니 아이콘 + 항목 수 배지, 클릭 시 /cart 이동

### /cart (장바구니 페이지)
- **CartItemList**: 장바구니 항목 목록
  - **CartItem**: 메뉴명, 단가, 수량 조절(+/-), 삭제 버튼, 소계
- **CartSummary**: 총 금액 표시
- **CartActions**: 장바구니 비우기 버튼, 주문하기 버튼
- **OrderConfirmModal**: 주문 확정 확인 팝업

### /orders (주문 내역 페이지)
- **OrderList**: 주문 목록 (시간 순)
  - **OrderCard**: 주문 번호, 시각, 상태 배지, 금액
    - **OrderItemList**: 메뉴명, 수량, 소계
- SSE 연결로 실시간 상태 업데이트

### /order-success (주문 성공 페이지)
- **OrderSuccessMessage**: 주문 번호 표시, 5초 카운트다운 후 /menu 리다이렉트

## Bottom Navigation
- **BottomNav**: 메뉴 | 장바구니 | 주문내역 (3탭)

## State Management
- **장바구니**: localStorage 저장, React Context로 전역 관리
- **인증**: localStorage에 토큰 저장, 자동 로그인 시 검증
- **SSE**: 주문 내역 페이지에서 EventSource 연결

## API Integration
| Component | Endpoint |
|-----------|----------|
| TableLoginForm | POST /auth/table-login |
| MenuGrid | GET /menus?store_id&category_id |
| CategoryNav | GET /categories?store_id |
| CartActions (주문) | POST /orders |
| OrderList | GET /orders?store_id&table_id&session_id |
| OrderCard (실시간) | SSE /sse/orders?store_id&table_id |
