# Build Instructions

## Prerequisites
- **Docker**: Docker Engine 24+ with Docker Compose V2
- **System Requirements**: 4GB+ RAM (PostgreSQL + 3 containers)

## Environment Setup

docker-compose.yml이 이미 루트에 구성되어 있으며, 모든 환경변수가 포함되어 있습니다.

## Build Steps

### 1. 전체 서비스 빌드
```bash
cd /home/participant/aidlc-workshop/table-order
docker compose build
```

### 2. 전체 서비스 실행
```bash
docker compose up -d
```

### 3. 빌드 확인
```bash
# 모든 컨테이너 상태 확인
docker compose ps

# Backend health check
curl http://localhost:8000/api/health
```

### 4. 시드 데이터 투입 (선택)
```bash
docker compose exec backend python -m scripts.seed
```

## Build Artifacts
| Unit | Image | Port |
|------|-------|------|
| backend | table-order-backend | 8000 |
| customer-web | table-order-customer-web | 3000 (nginx:80 → /) |
| admin-web | table-order-admin-web | 3100 (nginx:80 → /admin) |
| postgres | postgres:16-alpine | 5432 |
| nginx | nginx:alpine | 80 |

## Troubleshooting

### PostgreSQL 연결 실패
- **원인**: postgres 컨테이너 healthcheck 미완료
- **해결**: `docker compose logs postgres`로 상태 확인, 재시작: `docker compose restart backend`

### Frontend 빌드 실패
- **원인**: node_modules 미설치 또는 Next.js standalone 설정 누락
- **해결**: `next.config.ts`에 `output: 'standalone'` 확인

### Port 충돌
- **해결**: `docker compose down` 후 기존 프로세스 종료, 재실행
