"""DailyOrderCounter 모델"""

import uuid
from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class DailyOrderCounter(Base):
    __tablename__ = "daily_order_counters"
    __table_args__ = (UniqueConstraint("store_id", "date"),)

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    store_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("stores.id"), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    counter: Mapped[int] = mapped_column(Integer, default=0)
