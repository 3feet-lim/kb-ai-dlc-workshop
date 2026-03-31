"""카테고리 관련 스키마"""

import uuid
from datetime import datetime

from pydantic import BaseModel


class CategoryCreateRequest(BaseModel):
    name: str
    sort_order: int = 0


class CategoryUpdateRequest(BaseModel):
    name: str | None = None
    sort_order: int | None = None


class CategoryResponse(BaseModel):
    id: uuid.UUID
    store_id: uuid.UUID
    name: str
    sort_order: int
    created_at: datetime

    model_config = {"from_attributes": True}
