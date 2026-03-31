"""메뉴 관련 스키마"""

import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class MenuCreateRequest(BaseModel):
    category_id: uuid.UUID
    name: str = Field(max_length=100)
    price: int = Field(ge=0)
    description: str | None = Field(default=None, max_length=500)
    image_url: str | None = None
    sort_order: int = 0
    is_available: bool = True


class MenuUpdateRequest(BaseModel):
    category_id: uuid.UUID | None = None
    name: str | None = Field(default=None, max_length=100)
    price: int | None = Field(default=None, ge=0)
    description: str | None = Field(default=None, max_length=500)
    image_url: str | None = None
    sort_order: int | None = None
    is_available: bool | None = None


class MenuResponse(BaseModel):
    id: uuid.UUID
    store_id: uuid.UUID
    category_id: uuid.UUID
    name: str
    price: int
    description: str | None
    image_url: str | None
    sort_order: int
    is_available: bool
    created_at: datetime

    model_config = {"from_attributes": True}
