"""DailyOrderCounter Repository"""

import uuid
from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.daily_order_counter import DailyOrderCounter


class DailyOrderCounterRepo:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_next_number(self, store_id: uuid.UUID, today: date) -> str:
        """매장별 일일 주문번호를 atomic하게 증가시키고 반환"""
        result = await self.db.execute(
            select(DailyOrderCounter).where(
                DailyOrderCounter.store_id == store_id,
                DailyOrderCounter.date == today,
            ).with_for_update()
        )
        counter = result.scalar_one_or_none()

        if counter is None:
            counter = DailyOrderCounter(store_id=store_id, date=today, counter=1)
            self.db.add(counter)
        else:
            counter.counter += 1

        await self.db.flush()
        return f"#{counter.counter:03d}"
