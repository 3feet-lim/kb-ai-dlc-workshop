"""Category Repository"""

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.models.menu import Menu


class CategoryRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, store_id: uuid.UUID, category_id: uuid.UUID) -> Category | None:
        result = await self.db.execute(
            select(Category).where(Category.store_id == store_id, Category.id == category_id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, store_id: uuid.UUID) -> list[Category]:
        result = await self.db.execute(
            select(Category).where(Category.store_id == store_id).order_by(Category.sort_order)
        )
        return list(result.scalars().all())

    async def create(self, category: Category) -> Category:
        self.db.add(category)
        await self.db.flush()
        return category

    async def update(self, category: Category) -> Category:
        self.db.add(category)
        await self.db.flush()
        return category

    async def delete(self, category: Category) -> None:
        await self.db.delete(category)
        await self.db.flush()

    async def count_menus(self, store_id: uuid.UUID, category_id: uuid.UUID) -> int:
        result = await self.db.execute(
            select(func.count()).select_from(Menu).where(
                Menu.store_id == store_id, Menu.category_id == category_id
            )
        )
        return result.scalar_one()
