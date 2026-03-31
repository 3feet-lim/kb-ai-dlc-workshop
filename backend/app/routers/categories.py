"""카테고리 라우터 (US-12)"""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.routers.auth import get_current_admin
from app.schemas.category import CategoryCreateRequest, CategoryResponse, CategoryUpdateRequest
from app.services.menu_service import MenuService

router = APIRouter(prefix="/categories", tags=["카테고리"])


@router.get("", response_model=list[CategoryResponse])
async def get_categories(
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    return await service.get_categories(current_user["store_id"])


@router.post("", response_model=CategoryResponse, status_code=201)
async def create_category(
    request: CategoryCreateRequest,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    return await service.create_category(current_user["store_id"], request.name, request.sort_order)


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: uuid.UUID,
    request: CategoryUpdateRequest,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    return await service.update_category(
        current_user["store_id"], category_id, request.name, request.sort_order
    )


@router.delete("/{category_id}", status_code=204)
async def delete_category(
    category_id: uuid.UUID,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    await service.delete_category(current_user["store_id"], category_id)
