"""SSE 서비스 (US-05, US-07)"""

import asyncio
from collections.abc import AsyncGenerator

from app.core.events import SSEClient, event_bus


class SSEService:
    def subscribe(self, store_id: str, client_type: str, table_id: str | None = None) -> SSEClient:
        return event_bus.subscribe(store_id, client_type, table_id)

    def unsubscribe(self, client_id: str) -> None:
        event_bus.unsubscribe(client_id)

    async def stream(self, client: SSEClient) -> AsyncGenerator[str, None]:
        """SSE 이벤트 스트림 생성"""
        try:
            while True:
                try:
                    message = await asyncio.wait_for(client.queue.get(), timeout=30.0)
                    yield f"data: {message}\n\n"
                except asyncio.TimeoutError:
                    # 연결 유지를 위한 heartbeat
                    yield ": heartbeat\n\n"
        except asyncio.CancelledError:
            pass
        finally:
            self.unsubscribe(client.client_id)
