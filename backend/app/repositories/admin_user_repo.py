"""AdminUser Repository"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.admin_user import AdminUser


class AdminUserRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_store_and_username(self, store_id: uuid.UUID, username: str) -> AdminUser | None:
        result = await self.db.execute(
            select(AdminUser).where(
                AdminUser.store_id == store_id,
                AdminUser.username == username,
            )
        )
        return result.scalar_one_or_none()

    async def update(self, user: AdminUser) -> AdminUser:
        self.db.add(user)
        await self.db.flush()
        return user
