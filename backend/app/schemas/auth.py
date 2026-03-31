"""인증 관련 스키마"""

from pydantic import BaseModel


class AdminLoginRequest(BaseModel):
    store_code: str
    username: str
    password: str


class TableLoginRequest(BaseModel):
    store_code: str
    table_number: int
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
