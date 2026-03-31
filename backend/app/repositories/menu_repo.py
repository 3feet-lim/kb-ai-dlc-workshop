"""Menu Repository"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.menu import Menu


class MenuRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, store_id: uuid.UUID, menu_id: uuid.UUID) -> Menu | None:
        result = await self.db.execute(
            select(Menu).where(Menu.store_id == store_id, Menu.id == menu_id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, store_id: uuid.UUID, category_id: uuid.UUID | None = None) -> list[Menu]:
        query = select(Menu).where(Menu.store_id == store_id)
        if category_id:
            query = query.where(Menu.category_id == category_id)
        result = await self.db.execute(query.order_by(Menu.sort_order))
        return list(result.scalars().all())

    async def create(self, menu: Menu) -> Menu:
        self.db.add(menu)
        await self.db.flush()
        return menu

    async def update(self, menu: Menu) -> Menu:
        self.db.add(menu)
        await self.db.flush()
        return menu

    async def delete(self, menu: Menu) -> None:
        await self.db.delete(menu)
        await self.db.flush()
