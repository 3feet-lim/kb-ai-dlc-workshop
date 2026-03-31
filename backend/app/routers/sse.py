"""SSE 라우터 (US-05, US-07)"""

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse

from app.routers.auth import get_current_admin, get_current_table
from app.services.sse_service import SSEService

router = APIRouter(prefix="/sse", tags=["SSE"])


@router.get("/orders")
async def sse_orders_admin(
    current_user: dict = Depends(get_current_admin),
):
    """관리자: 매장 전체 주문 이벤트 스트림"""
    service = SSEService()
    client = service.subscribe(
        store_id=str(current_user["store_id"]),
        client_type="admin",
    )
    return StreamingResponse(
        service.stream(client),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )


@router.get("/orders/customer")
async def sse_orders_customer(
    current_user: dict = Depends(get_current_table),
):
    """고객: 내 테이블 주문 이벤트 스트림"""
    service = SSEService()
    client = service.subscribe(
        store_id=str(current_user["store_id"]),
        client_type="customer",
        table_id=str(current_user["table_id"]),
    )
    return StreamingResponse(
        service.stream(client),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )
