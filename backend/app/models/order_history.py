"""OrderHistory 모델"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class OrderHistory(Base):
    __tablename__ = "order_histories"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    store_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("stores.id"), nullable=False)
    table_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("tables.id"), nullable=False)
    session_id: Mapped[uuid.UUID] = mapped_column(nullable=False)
    order_data: Mapped[str] = mapped_column(Text, nullable=False)  # JSON 스냅샷
    completed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
