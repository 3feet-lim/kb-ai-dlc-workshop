"""Store Repository"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.store import Store


class StoreRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, store_id: uuid.UUID) -> Store | None:
        result = await self.db.execute(select(Store).where(Store.id == store_id))
        return result.scalar_one_or_none()

    async def get_by_code(self, store_code: str) -> Store | None:
        result = await self.db.execute(select(Store).where(Store.store_code == store_code))
        return result.scalar_one_or_none()
