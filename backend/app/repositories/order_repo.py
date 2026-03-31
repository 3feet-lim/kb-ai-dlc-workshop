"""Order Repository"""

import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.order import Order
from app.models.order_history import OrderHistory
from app.models.order_item import OrderItem


class OrderRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, store_id: uuid.UUID, order_id: uuid.UUID) -> Order | None:
        result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.store_id == store_id, Order.id == order_id)
        )
        return result.scalar_one_or_none()

    async def get_by_session(self, store_id: uuid.UUID, session_id: uuid.UUID) -> list[Order]:
        result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.store_id == store_id, Order.session_id == session_id)
            .order_by(Order.created_at)
        )
        return list(result.scalars().all())

    async def get_by_table(self, store_id: uuid.UUID, table_id: uuid.UUID) -> list[Order]:
        result = await self.db.execute(
            select(Order)
            .options(selectinload(Order.items))
            .where(Order.store_id == store_id, Order.table_id == table_id)
            .order_by(Order.created_at)
        )
        return list(result.scalars().all())

    async def create(self, order: Order) -> Order:
        self.db.add(order)
        await self.db.flush()
        return order

    async def add_item(self, item: OrderItem) -> OrderItem:
        self.db.add(item)
        await self.db.flush()
        return item

    async def update(self, order: Order) -> Order:
        self.db.add(order)
        await self.db.flush()
        return order

    async def delete(self, order: Order) -> None:
        await self.db.delete(order)
        await self.db.flush()

    async def create_history(self, history: OrderHistory) -> OrderHistory:
        self.db.add(history)
        await self.db.flush()
        return history

    async def get_history(self, store_id: uuid.UUID, table_id: uuid.UUID) -> list[OrderHistory]:
        result = await self.db.execute(
            select(OrderHistory)
            .where(OrderHistory.store_id == store_id, OrderHistory.table_id == table_id)
            .order_by(OrderHistory.completed_at.desc())
        )
        return list(result.scalars().all())
