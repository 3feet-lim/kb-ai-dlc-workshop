#!/bin/bash
set -e

# DB 마이그레이션 실행
alembic upgrade head

# 애플리케이션 시작
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
