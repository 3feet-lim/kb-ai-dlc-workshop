"""메뉴 라우터 (US-02, US-12)"""

import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.routers.auth import get_current_admin, get_current_table
from app.schemas.menu import MenuCreateRequest, MenuResponse, MenuUpdateRequest
from app.services.menu_service import MenuService

router = APIRouter(prefix="/menus", tags=["메뉴"])


@router.get("", response_model=list[MenuResponse])
async def get_menus(
    category_id: uuid.UUID | None = Query(default=None),
    current_user: dict = Depends(get_current_table),
    db: AsyncSession = Depends(get_db),
):
    """고객용 메뉴 조회"""
    service = MenuService(db)
    return await service.get_menus(current_user["store_id"], category_id)


@router.get("/admin", response_model=list[MenuResponse])
async def get_menus_admin(
    category_id: uuid.UUID | None = Query(default=None),
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """관리자용 메뉴 조회"""
    service = MenuService(db)
    return await service.get_menus(current_user["store_id"], category_id)


@router.post("", response_model=MenuResponse, status_code=201)
async def create_menu(
    request: MenuCreateRequest,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    return await service.create_menu(current_user["store_id"], request)


@router.put("/{menu_id}", response_model=MenuResponse)
async def update_menu(
    menu_id: uuid.UUID,
    request: MenuUpdateRequest,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    return await service.update_menu(current_user["store_id"], menu_id, request)


@router.delete("/{menu_id}", status_code=204)
async def delete_menu(
    menu_id: uuid.UUID,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    await service.delete_menu(current_user["store_id"], menu_id)
