# Units of Work

## Unit Decomposition: 3개 유닛 (모노레포, 동시 개발)

### Directory Structure
```
table-order/                    # Workspace Root (모노레포)
├── backend/                    # Unit 1: Backend API
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/           # 도메인별 라우터
│   │   ├── services/          # 서비스 레이어
│   │   ├── repositories/      # Repository 패턴
│   │   ├── models/            # SQLAlchemy 모델
│   │   ├── schemas/           # Pydantic 스키마
│   │   ├── core/              # 설정, 인증, SSE
│   │   └── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── customer-web/               # Unit 2: Customer Frontend
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   ├── components/
│   │   ├── lib/               # API 클라이언트, 유틸
│   │   └── hooks/
│   ├── package.json
│   └── Dockerfile
├── admin-web/                  # Unit 3: Admin Frontend
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── hooks/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── aidlc-docs/                 # Documentation only
```

---

## Unit 1: Backend API

| Attribute | Value |
|-----------|-------|
| Name | backend |
| Technology | Python, FastAPI, SQLAlchemy, PostgreSQL |
| Type | REST API + SSE Server |
| Deploy | Docker container |

**Responsibilities**:
- 인증/인가 (JWT, 세션 토큰)
- 매장/테이블/메뉴/주문 CRUD API
- SSE 실시간 이벤트 스트리밍
- 파일 업로드 (메뉴 이미지)
- 멀티 매장 데이터 격리

**Components**: Auth, Store, Table, Menu, Order, SSE, File

---

## Unit 2: Customer Frontend

| Attribute | Value |
|-----------|-------|
| Name | customer-web |
| Technology | Next.js, React, TypeScript |
| Type | Web Application (SPA) |
| Deploy | Docker container |

**Responsibilities**:
- 테이블 태블릿 자동 로그인
- 메뉴 조회/탐색
- 장바구니 관리 (로컬 저장)
- 주문 생성
- 주문 내역 조회 (SSE 실시간)

---

## Unit 3: Admin Frontend

| Attribute | Value |
|-----------|-------|
| Name | admin-web |
| Technology | Next.js, React, TypeScript |
| Type | Web Application (SPA) |
| Deploy | Docker container |

**Responsibilities**:
- 관리자 로그인
- 실시간 주문 모니터링 (SSE)
- 테이블 관리 (설정, 이용 완료)
- 메뉴 관리 (CRUD, 이미지 업로드)
- 과거 주문 내역 조회

---

## Development Strategy
- **Approach**: 모든 유닛 동시 개발 (API 스펙 기반)
- **Repository**: 모노레포 (단일 저장소)
- **Deployment**: Docker Compose로 전체 서비스 통합 실행
