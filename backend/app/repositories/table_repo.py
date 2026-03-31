"""Table Repository"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.table import Table


class TableRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_store_and_number(self, store_id: uuid.UUID, table_number: int) -> Table | None:
        result = await self.db.execute(
            select(Table).where(
                Table.store_id == store_id,
                Table.table_number == table_number,
            )
        )
        return result.scalar_one_or_none()

    async def get_by_id(self, store_id: uuid.UUID, table_id: uuid.UUID) -> Table | None:
        result = await self.db.execute(
            select(Table).where(Table.store_id == store_id, Table.id == table_id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, store_id: uuid.UUID) -> list[Table]:
        result = await self.db.execute(
            select(Table).where(Table.store_id == store_id).order_by(Table.table_number)
        )
        return list(result.scalars().all())

    async def create(self, table: Table) -> Table:
        self.db.add(table)
        await self.db.flush()
        return table

    async def delete(self, table: Table) -> None:
        await self.db.delete(table)
        await self.db.flush()
