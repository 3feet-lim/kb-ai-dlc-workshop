"""SSE 이벤트 버스 (인메모리)"""

import asyncio
import json
import uuid
from dataclasses import dataclass, field


@dataclass
class SSEClient:
    client_id: str
    store_id: str
    client_type: str  # "admin" | "customer"
    table_id: str | None
    queue: asyncio.Queue = field(default_factory=asyncio.Queue)


class EventBus:
    """매장별 SSE 이벤트 발행/구독 관리"""

    def __init__(self):
        self._clients: dict[str, SSEClient] = {}

    def subscribe(self, store_id: str, client_type: str, table_id: str | None = None) -> SSEClient:
        client_id = str(uuid.uuid4())
        client = SSEClient(
            client_id=client_id,
            store_id=store_id,
            client_type=client_type,
            table_id=table_id,
        )
        self._clients[client_id] = client
        return client

    def unsubscribe(self, client_id: str) -> None:
        self._clients.pop(client_id, None)

    async def publish(self, store_id: str, event_type: str, data: dict, table_id: str | None = None) -> None:
        message = json.dumps({"event": event_type, "data": data}, ensure_ascii=False)
        for client in self._clients.values():
            if client.store_id != store_id:
                continue
            # admin은 매장 전체 이벤트 수신
            if client.client_type == "admin":
                await client.queue.put(message)
            # customer는 자신의 table_id 이벤트만 수신
            elif client.client_type == "customer" and table_id and client.table_id == table_id:
                await client.queue.put(message)


# 싱글톤 이벤트 버스
event_bus = EventBus()
