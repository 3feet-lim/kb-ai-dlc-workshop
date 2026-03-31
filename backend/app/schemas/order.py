"""주문 관련 스키마"""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field

from app.models.order import OrderStatus


class OrderItemRequest(BaseModel):
    menu_id: uuid.UUID
    quantity: int = Field(ge=1)


class OrderCreateRequest(BaseModel):
    items: list[OrderItemRequest] = Field(min_length=1)


class OrderItemResponse(BaseModel):
    id: uuid.UUID
    menu_id: uuid.UUID
    menu_name: str
    quantity: int
    unit_price: int
    subtotal: int

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: uuid.UUID
    store_id: uuid.UUID
    table_id: uuid.UUID
    session_id: uuid.UUID
    order_number: str
    status: OrderStatus
    total_amount: int
    items: list[OrderItemResponse]
    created_at: datetime

    model_config = {"from_attributes": True}
