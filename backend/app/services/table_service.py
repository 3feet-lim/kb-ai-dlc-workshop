"""테이블 서비스 (US-08, US-10)"""

import json
import uuid
from datetime import datetime, timezone

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.events import event_bus
from app.core.security import hash_password
from app.models.order_history import OrderHistory
from app.models.table import Table
from app.repositories.order_repo import OrderRepo
from app.repositories.table_repo import TableRepo
from app.repositories.table_session_repo import TableSessionRepo


class TableService:
    def __init__(self, db: AsyncSession):
        self.table_repo = TableRepo(db)
        self.session_repo = TableSessionRepo(db)
        self.order_repo = OrderRepo(db)

    async def create_table(self, store_id: uuid.UUID, table_number: int, password: str) -> Table:
        """테이블 생성"""
        existing = await self.table_repo.get_by_store_and_number(store_id, table_number)
        if existing:
            raise HTTPException(status_code=409, detail="이미 존재하는 테이블 번호입니다")

        table = Table(
            store_id=store_id,
            table_number=table_number,
            password_hash=hash_password(password),
        )
        return await self.table_repo.create(table)

    async def get_tables(self, store_id: uuid.UUID) -> list[Table]:
        return await self.table_repo.get_all(store_id)

    async def end_session(self, store_id: uuid.UUID, table_id: uuid.UUID) -> None:
        """이용 완료 처리"""
        session = await self.session_repo.get_active_session(store_id, table_id)
        if not session:
            raise HTTPException(status_code=404, detail="활성 세션이 없습니다")

        # 주문을 이력으로 이동
        orders = await self.order_repo.get_by_session(store_id, session.id)
        now = datetime.now(timezone.utc)
        for order in orders:
            order_data = {
                "id": str(order.id),
                "order_number": order.order_number,
                "status": order.status.value,
                "total_amount": order.total_amount,
                "created_at": order.created_at.isoformat(),
                "items": [
                    {
                        "menu_name": item.menu_name,
                        "quantity": item.quantity,
                        "unit_price": item.unit_price,
                        "subtotal": item.subtotal,
                    }
                    for item in order.items
                ],
            }
            history = OrderHistory(
                store_id=store_id,
                table_id=table_id,
                session_id=session.id,
                order_data=json.dumps(order_data, ensure_ascii=False),
                completed_at=now,
            )
            await self.order_repo.create_history(history)
            await self.order_repo.delete(order)

        # 세션 종료
        session.is_active = False
        session.ended_at = now
        await self.session_repo.update(session)

        await event_bus.publish(
            store_id=str(store_id),
            event_type="session_ended",
            data={"table_id": str(table_id)},
            table_id=str(table_id),
        )
