"""SSE 관련 스키마"""

from pydantic import BaseModel


class SSEEvent(BaseModel):
    event: str
    data: dict
