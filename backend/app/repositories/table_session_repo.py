"""TableSession Repository"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.table_session import TableSession


class TableSessionRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_active_session(self, store_id: uuid.UUID, table_id: uuid.UUID) -> TableSession | None:
        result = await self.db.execute(
            select(TableSession).where(
                TableSession.store_id == store_id,
                TableSession.table_id == table_id,
                TableSession.is_active.is_(True),
            )
        )
        return result.scalar_one_or_none()

    async def create(self, session: TableSession) -> TableSession:
        self.db.add(session)
        await self.db.flush()
        return session

    async def update(self, session: TableSession) -> TableSession:
        self.db.add(session)
        await self.db.flush()
        return session
