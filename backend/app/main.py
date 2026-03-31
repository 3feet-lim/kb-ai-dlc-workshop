"""FastAPI 메인 애플리케이션"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.routers import auth, categories, files, menus, orders, sse, stores, tables

app = FastAPI(title="Table Order API", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 정적 파일 서빙 (업로드 이미지)
import os
os.makedirs(settings.upload_dir, exist_ok=True)
app.mount("/static/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# 라우터 등록
app.include_router(auth.router, prefix="/api")
app.include_router(stores.router, prefix="/api")
app.include_router(tables.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(menus.router, prefix="/api")
app.include_router(orders.router, prefix="/api")
app.include_router(sse.router, prefix="/api")
app.include_router(files.router, prefix="/api")


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
