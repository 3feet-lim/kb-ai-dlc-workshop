"""주문 서비스 (US-04, US-05, US-07, US-09)"""

import uuid
from datetime import date, timezone, datetime

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.events import event_bus
from app.models.order import Order, OrderStatus
from app.models.order_item import OrderItem
from app.models.table_session import TableSession
from app.repositories.daily_order_counter_repo import DailyOrderCounterRepo
from app.repositories.menu_repo import MenuRepo
from app.repositories.order_repo import OrderRepo
from app.repositories.table_session_repo import TableSessionRepo
from app.schemas.order import OrderCreateRequest


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.order_repo = OrderRepo(db)
        self.menu_repo = MenuRepo(db)
        self.session_repo = TableSessionRepo(db)
        self.counter_repo = DailyOrderCounterRepo(db)

    async def create_order(
        self, store_id: uuid.UUID, table_id: uuid.UUID, request: OrderCreateRequest
    ) -> Order:
        """주문 생성"""
        # 활성 세션 확인 또는 생성
        session = await self.session_repo.get_active_session(store_id, table_id)
        if not session:
            session = TableSession(store_id=store_id, table_id=table_id)
            session = await self.session_repo.create(session)

        # 주문번호 생성
        today = datetime.now(timezone.utc).date()
        order_number = await self.counter_repo.get_next_number(store_id, today)

        # 주문 생성
        order = Order(
            store_id=store_id,
            table_id=table_id,
            session_id=session.id,
            order_number=order_number,
            status=OrderStatus.PENDING,
        )
        order = await self.order_repo.create(order)

        # 주문 항목 생성
        total = 0
        for item_req in request.items:
            menu = await self.menu_repo.get_by_id(store_id, item_req.menu_id)
            if not menu or not menu.is_available:
                raise HTTPException(status_code=404, detail=f"메뉴를 찾을 수 없습니다: {item_req.menu_id}")

            subtotal = menu.price * item_req.quantity
            item = OrderItem(
                order_id=order.id,
                menu_id=menu.id,
                menu_name=menu.name,
                quantity=item_req.quantity,
                unit_price=menu.price,
                subtotal=subtotal,
            )
            await self.order_repo.add_item(item)
            total += subtotal

        order.total_amount = total
        order = await self.order_repo.update(order)

        # SSE 이벤트 발행
        await event_bus.publish(
            store_id=str(store_id),
            event_type="new_order",
            data={"order_id": str(order.id), "table_id": str(table_id), "order_number": order_number},
            table_id=str(table_id),
        )

        # items를 다시 로드
        order = await self.order_repo.get_by_id(store_id, order.id)
        return order

    async def update_status(
        self, store_id: uuid.UUID, order_id: uuid.UUID, new_status: OrderStatus
    ) -> Order:
        """주문 상태 변경"""
        order = await self.order_repo.get_by_id(store_id, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다")

        # 상태 전이 검증: PENDING → PREPARING → COMPLETED
        valid_transitions = {
            OrderStatus.PENDING: OrderStatus.PREPARING,
            OrderStatus.PREPARING: OrderStatus.COMPLETED,
        }
        if valid_transitions.get(order.status) != new_status:
            raise HTTPException(
                status_code=400,
                detail=f"상태 전이 불가: {order.status.value} → {new_status.value}",
            )

        order.status = new_status
        order = await self.order_repo.update(order)

        await event_bus.publish(
            store_id=str(store_id),
            event_type="status_changed",
            data={"order_id": str(order.id), "status": new_status.value},
            table_id=str(order.table_id),
        )
        return order

    async def delete_order(self, store_id: uuid.UUID, order_id: uuid.UUID) -> None:
        """주문 삭제"""
        order = await self.order_repo.get_by_id(store_id, order_id)
        if not order:
            raise HTTPException(status_code=404, detail="주문을 찾을 수 없습니다")

        table_id = str(order.table_id)
        await self.order_repo.delete(order)

        await event_bus.publish(
            store_id=str(store_id),
            event_type="order_deleted",
            data={"order_id": str(order_id)},
            table_id=table_id,
        )

    async def get_orders_by_store(self, store_id: uuid.UUID) -> list[Order]:
        return await self.order_repo.get_by_store(store_id)

    async def get_orders_by_session(self, store_id: uuid.UUID, session_id: uuid.UUID) -> list[Order]:
        return await self.order_repo.get_by_session(store_id, session_id)

    async def get_orders_by_table(self, store_id: uuid.UUID, table_id: uuid.UUID) -> list[Order]:
        return await self.order_repo.get_by_table(store_id, table_id)

    async def get_order_history(self, store_id: uuid.UUID, table_id: uuid.UUID):
        return await self.order_repo.get_history(store_id, table_id)
