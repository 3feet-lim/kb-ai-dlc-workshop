"""주문 라우터 (US-04, US-05, US-07, US-09, US-11)"""

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.order import OrderStatus
from app.routers.auth import get_current_admin, get_current_table
from app.schemas.order import OrderCreateRequest, OrderResponse
from app.services.order_service import OrderService

router = APIRouter(prefix="/orders", tags=["주문"])


@router.post("", response_model=OrderResponse, status_code=201)
async def create_order(
    request: OrderCreateRequest,
    current_user: dict = Depends(get_current_table),
    db: AsyncSession = Depends(get_db),
):
    """고객 주문 생성"""
    service = OrderService(db)
    return await service.create_order(
        current_user["store_id"], current_user["table_id"], request
    )


@router.get("/table/{table_id}", response_model=list[OrderResponse])
async def get_table_orders(
    table_id: uuid.UUID,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """관리자: 테이블별 주문 조회"""
    service = OrderService(db)
    return await service.get_orders_by_table(current_user["store_id"], table_id)


@router.get("/my", response_model=list[OrderResponse])
async def get_my_orders(
    current_user: dict = Depends(get_current_table),
    db: AsyncSession = Depends(get_db),
):
    """고객: 내 테이블 주문 조회"""
    service = OrderService(db)
    return await service.get_orders_by_table(
        current_user["store_id"], current_user["table_id"]
    )


from pydantic import BaseModel


class OrderStatusUpdateRequest(BaseModel):
    status: OrderStatus


@router.patch("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: uuid.UUID,
    request: OrderStatusUpdateRequest,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """관리자: 주문 상태 변경"""
    service = OrderService(db)
    return await service.update_status(current_user["store_id"], order_id, request.status)


@router.delete("/{order_id}", status_code=204)
async def delete_order(
    order_id: uuid.UUID,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """관리자: 주문 삭제"""
    service = OrderService(db)
    await service.delete_order(current_user["store_id"], order_id)


@router.get("/history/{table_id}")
async def get_order_history(
    table_id: uuid.UUID,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """관리자: 과거 주문 내역 조회"""
    service = OrderService(db)
    return await service.get_order_history(current_user["store_id"], table_id)
