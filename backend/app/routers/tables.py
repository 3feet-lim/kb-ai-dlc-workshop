"""테이블 라우터 (US-08, US-10)"""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.routers.auth import get_current_admin
from app.schemas.table import TableCreateRequest, TableResponse
from app.services.table_service import TableService

router = APIRouter(prefix="/tables", tags=["테이블"])


@router.get("", response_model=list[TableResponse])
async def get_tables(
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = TableService(db)
    return await service.get_tables(current_user["store_id"])


@router.post("", response_model=TableResponse, status_code=201)
async def create_table(
    request: TableCreateRequest,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = TableService(db)
    return await service.create_table(
        current_user["store_id"], request.table_number, request.password
    )


@router.post("/{table_id}/complete-session", status_code=204)
async def complete_session(
    table_id: uuid.UUID,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = TableService(db)
    await service.end_session(current_user["store_id"], table_id)
