# NFR Requirements - All Units

## NFR-01: Performance
- API 응답 시간: 500ms 이내 (일반 요청)
- SSE 이벤트 전달: 주문 발생 후 2초 이내
- 예상 동시 접속: 10명 이하 (PoC, 단일 매장 테스트)

## NFR-02: Usability
- 터치 친화적 UI (최소 44x44px 터치 타겟)
- 직관적 시각적 계층 구조
- 반응형 레이아웃 (태블릿 최적화)

## NFR-03: Reliability
- 장바구니 localStorage 저장 (새로고침 시 유지)
- 주문 데이터 트랜잭션 처리 (atomic)
- SSE 연결 끊김 시 자동 재연결

## NFR-04: Security
- 비밀번호 bcrypt 해싱
- JWT 토큰 인증 (16시간 만료)
- 로그인 시도 제한 (5회 실패 시 30분 잠금)
- 멀티 매장 데이터 격리 (store_id 기반)

## NFR-05: Deployability
- Docker Compose 기반 로컬/온프레미스 배포
- 단일 명령어로 전체 서비스 실행 (`docker-compose up`)

## NFR-06: Testability
- Property-Based Testing 전체 적용
- Backend: Hypothesis (Python)
- Frontend: fast-check (TypeScript)
- PBT + example-based 테스트 병행 (PBT-10)
