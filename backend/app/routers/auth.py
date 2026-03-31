"""인증 라우터 (US-01, US-06)"""

import uuid

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_access_token
from app.schemas.auth import AdminLoginRequest, TableLoginRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["인증"])
security = HTTPBearer()


# --- 인증 의존성 ---

async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """관리자 인증 미들웨어"""
    payload = decode_access_token(credentials.credentials)
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=401, detail="인증이 필요합니다")
    return {"user_id": payload["sub"], "store_id": uuid.UUID(payload["store_id"]), "role": "admin"}


async def get_current_table(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """테이블 인증 미들웨어"""
    payload = decode_access_token(credentials.credentials)
    if not payload or payload.get("role") != "customer":
        raise HTTPException(status_code=401, detail="인증이 필요합니다")
    return {
        "table_id": uuid.UUID(payload["table_id"]),
        "store_id": uuid.UUID(payload["store_id"]),
        "role": "customer",
    }


# --- 엔드포인트 ---

@router.post("/admin-login", response_model=TokenResponse)
async def admin_login(request: AdminLoginRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    token = await service.admin_login(request.store_code, request.username, request.password)
    return TokenResponse(access_token=token)


@router.post("/table-login", response_model=TokenResponse)
async def table_login(request: TableLoginRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    token = await service.table_login(request.store_code, request.table_number, request.password)
    return TokenResponse(access_token=token)
