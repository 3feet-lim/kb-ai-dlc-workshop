# Performance Test Instructions

## Purpose
테이블 오더 시스템의 동시 주문 처리 성능과 SSE 스트리밍 안정성을 검증합니다.

## Performance Requirements
- **응답 시간**: API 95th percentile < 500ms
- **동시 사용자**: 50개 테이블 동시 주문 처리
- **SSE 연결**: 10개 이상 동시 SSE 스트림 유지
- **에러율**: < 1%

## 테스트 도구
- `ab` (Apache Bench) 또는 `hey` — HTTP 부하 테스트
- `curl` — SSE 연결 테스트

## Run Performance Tests

### 1. API 응답 시간 테스트
```bash
# Health endpoint 기본 부하 테스트
ab -n 1000 -c 50 http://localhost:8000/api/health

# 메뉴 조회 부하 테스트 (읽기 성능)
ab -n 500 -c 20 "http://localhost:8000/api/menus?store_id=1"
```

### 2. 주문 생성 부하 테스트
```bash
# hey 사용 시
hey -n 200 -c 10 -m POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $SESSION_TOKEN" \
  -d '{"items":[{"menu_id":1,"quantity":1}]}' \
  http://localhost:8000/api/orders
```

### 3. SSE 동시 연결 테스트
```bash
# 10개 동시 SSE 연결
for i in $(seq 1 10); do
  curl -sN http://localhost:8000/api/sse/orders?store_id=1 \
    -H "Authorization: Bearer $TOKEN" > /dev/null &
done

# 연결 상태 확인
jobs -l

# 정리
kill $(jobs -p)
```

## 결과 분석
- **Requests/sec**: 목표 100 req/s 이상
- **Latency p95**: 목표 500ms 이하
- **Failed requests**: 목표 0
- **SSE 연결 유지**: 10개 동시 연결 안정적 유지
