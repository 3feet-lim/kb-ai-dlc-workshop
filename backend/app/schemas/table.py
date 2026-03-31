"""테이블 관련 스키마"""

import uuid
from datetime import datetime

from pydantic import BaseModel


class TableCreateRequest(BaseModel):
    table_number: int
    password: str


class TableUpdateRequest(BaseModel):
    password: str | None = None


class TableResponse(BaseModel):
    id: uuid.UUID
    store_id: uuid.UUID
    table_number: int
    created_at: datetime

    model_config = {"from_attributes": True}


class TableSessionResponse(BaseModel):
    id: uuid.UUID
    store_id: uuid.UUID
    table_id: uuid.UUID
    started_at: datetime
    ended_at: datetime | None
    is_active: bool

    model_config = {"from_attributes": True}
