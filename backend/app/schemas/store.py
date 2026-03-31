"""매장 관련 스키마"""

import uuid
from datetime import datetime

from pydantic import BaseModel


class StoreResponse(BaseModel):
    id: uuid.UUID
    name: str
    store_code: str
    created_at: datetime

    model_config = {"from_attributes": True}
