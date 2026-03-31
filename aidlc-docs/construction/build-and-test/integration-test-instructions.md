# Integration Test Instructions

## Purpose
Backend API ↔ Frontend 간 통합, Backend ↔ PostgreSQL 간 데이터 흐름을 검증합니다.

## 사전 조건
```bash
cd /home/participant/aidlc-workshop/table-order
docker compose up -d
# postgres healthcheck 통과 대기
docker compose exec backend curl -s http://localhost:8000/api/health
```

---

## Test Scenarios

### Scenario 1: 인증 플로우
- **설명**: 관리자 로그인 → JWT 발급 → 인증 필요 API 호출
- **테스트 단계**:
```bash
# 1. 시드 데이터 투입
docker compose exec backend python -m scripts.seed

# 2. 관리자 로그인
curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq .

# 3. 토큰으로 매장 조회
TOKEN=$(curl -s -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq -r '.access_token')

curl -s http://localhost:8000/api/stores \
  -H "Authorization: Bearer $TOKEN" | jq .
```
- **기대 결과**: 로그인 성공 시 JWT 반환, 토큰으로 API 접근 가능

### Scenario 2: 테이블 세션 → 메뉴 조회 → 주문 생성
- **설명**: 고객 테이블 세션 시작 → 메뉴 목록 조회 → 주문 생성 → 주문 상태 확인
- **테스트 단계**:
```bash
# 1. 테이블 세션 토큰 획득 (관리자가 테이블 설정 후)
# 2. 메뉴 조회
curl -s http://localhost:8000/api/menus?store_id=1 | jq .

# 3. 주문 생성
curl -s -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SESSION_TOKEN" \
  -d '{"items":[{"menu_id":1,"quantity":2}]}' | jq .

# 4. 주문 조회
curl -s http://localhost:8000/api/orders?table_session_id=1 \
  -H "Authorization: Bearer $SESSION_TOKEN" | jq .
```
- **기대 결과**: 주문 생성 성공, 주문 내역 조회 가능

### Scenario 3: SSE 실시간 이벤트
- **설명**: 주문 생성 시 SSE 스트림으로 실시간 알림 수신
- **테스트 단계**:
```bash
# 터미널 1: SSE 구독
curl -N http://localhost:8000/api/sse/orders?store_id=1 \
  -H "Authorization: Bearer $TOKEN"

# 터미널 2: 주문 생성 (위 Scenario 2 참조)
# → 터미널 1에서 이벤트 수신 확인
```
- **기대 결과**: 주문 생성 시 SSE 스트림에 이벤트 전달

### Scenario 4: DB 마이그레이션 검증
- **설명**: Alembic 마이그레이션이 정상 적용되는지 확인
- **테스트 단계**:
```bash
docker compose exec backend alembic current
docker compose exec backend alembic history
```
- **기대 결과**: 001_initial 마이그레이션 적용 완료 상태

---

## Cleanup
```bash
docker compose down -v  # 볼륨 포함 삭제
```
