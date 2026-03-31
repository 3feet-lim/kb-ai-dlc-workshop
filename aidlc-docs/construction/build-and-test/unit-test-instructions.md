# Unit Test Execution

## Backend (Python - pytest)

### 1. 테스트 실행
```bash
# Docker 컨테이너 내에서 실행
docker compose exec backend pytest tests/ -v

# Property-Based Tests 포함
docker compose exec backend pytest tests/pbt/ -v
```

### 2. 로컬 실행 (선택)
```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
pytest tests/pbt/ -v
```

### 3. 테스트 범위
| 테스트 파일 | 대상 |
|------------|------|
| tests/test_auth.py | 인증/인가 API |
| tests/test_tables.py | 테이블 관리 API |
| tests/test_menus.py | 메뉴 관리 API |
| tests/test_orders.py | 주문 처리 API |
| tests/pbt/test_order_properties.py | 주문 속성 기반 테스트 |
| tests/pbt/test_serialization.py | 직렬화 속성 기반 테스트 |
| tests/pbt/test_session_stateful.py | 세션 상태 기반 테스트 |

---

## Customer Frontend (TypeScript - vitest)

### 1. 테스트 실행
```bash
cd customer-web
npm install
npm test
```

### 2. 테스트 범위
| 테스트 파일 | 대상 |
|------------|------|
| src/__tests__/cart.test.ts | 장바구니 로직 |
| src/__tests__/pbt/cart.property.test.ts | 장바구니 속성 기반 테스트 |

---

## Admin Frontend (TypeScript - vitest)

### 1. 테스트 실행
```bash
cd admin-web
npm install
npm test
```

### 2. 테스트 범위
- 현재 별도 테스트 파일 없음 (컴포넌트 단위 테스트 추가 권장)

---

## 전체 유닛 테스트 한번에 실행
```bash
cd /home/participant/aidlc-workshop/table-order

# Backend
docker compose exec backend pytest tests/ -v

# Customer Frontend
cd customer-web && npm install && npm test && cd ..

# Admin Frontend
cd admin-web && npm install && npm test && cd ..
```
