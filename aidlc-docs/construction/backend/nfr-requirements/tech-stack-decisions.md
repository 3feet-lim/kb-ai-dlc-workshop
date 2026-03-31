# Tech Stack Decisions

## Backend API

| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.13 | Runtime |
| FastAPI | latest | Web framework |
| SQLAlchemy | 2.x (async) | ORM |
| asyncpg | latest | PostgreSQL async driver |
| Alembic | latest | DB migration |
| Pydantic | 2.x | Data validation/serialization |
| python-jose | latest | JWT token handling |
| passlib[bcrypt] | latest | Password hashing |
| python-multipart | latest | File upload |
| uvicorn | latest | ASGI server |
| Hypothesis | latest | PBT framework (PBT-09) |
| pytest | latest | Test runner |
| httpx | latest | Async test client |

## Customer Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 22 LTS | Runtime |
| Next.js | 15.x | React framework |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| fast-check | latest | PBT framework (PBT-09) |
| Jest / Vitest | latest | Test runner |

## Admin Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 22 LTS | Runtime |
| Next.js | 15.x | React framework |
| React | 19.x | UI library |
| TypeScript | 5.x | Type safety |
| fast-check | latest | PBT framework (PBT-09) |
| Jest / Vitest | latest | Test runner |

## Infrastructure

| Technology | Version | Purpose |
|-----------|---------|---------|
| PostgreSQL | 16 | Database |
| Docker | latest | Containerization |
| Docker Compose | latest | Multi-container orchestration |

## PBT Framework Selection (PBT-09)
- **Python**: Hypothesis - mature, excellent shrinking, async support
- **TypeScript**: fast-check - Jest/Vitest integration, good shrinking
- Both frameworks support: custom generators, automatic shrinking, seed-based reproducibility
