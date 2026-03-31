"""인증 서비스 (US-01, US-06)"""

from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.repositories.admin_user_repo import AdminUserRepo
from app.repositories.store_repo import StoreRepo
from app.repositories.table_repo import TableRepo


class AuthService:
    def __init__(self, db: AsyncSession):
        self.store_repo = StoreRepo(db)
        self.admin_user_repo = AdminUserRepo(db)
        self.table_repo = TableRepo(db)

    async def admin_login(self, store_code: str, username: str, password: str) -> str:
        """관리자 로그인 → JWT 토큰 반환"""
        store = await self.store_repo.get_by_code(store_code)
        if not store:
            raise HTTPException(status_code=401, detail="인증 실패")

        user = await self.admin_user_repo.get_by_store_and_username(store.id, username)
        if not user:
            raise HTTPException(status_code=401, detail="인증 실패")

        # 잠금 확인
        if user.locked_until and user.locked_until > datetime.now(timezone.utc):
            raise HTTPException(status_code=423, detail="계정이 잠겨 있습니다")

        # 비밀번호 검증
        if not verify_password(password, user.password_hash):
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= settings.max_login_attempts:
                user.locked_until = datetime.now(timezone.utc) + timedelta(
                    minutes=settings.lockout_minutes
                )
            await self.admin_user_repo.update(user)
            raise HTTPException(status_code=401, detail="인증 실패")

        # 성공: 카운터 리셋 + 토큰 발급
        user.failed_login_attempts = 0
        user.locked_until = None
        await self.admin_user_repo.update(user)

        return create_access_token(
            {"sub": str(user.id), "store_id": str(store.id), "role": "admin"}
        )

    async def table_login(self, store_code: str, table_number: int, password: str) -> str:
        """테이블 태블릿 로그인 → 세션 토큰 반환"""
        store = await self.store_repo.get_by_code(store_code)
        if not store:
            raise HTTPException(status_code=401, detail="인증 실패")

        table = await self.table_repo.get_by_store_and_number(store.id, table_number)
        if not table:
            raise HTTPException(status_code=401, detail="인증 실패")

        if not verify_password(password, table.password_hash):
            raise HTTPException(status_code=401, detail="인증 실패")

        return create_access_token(
            {"sub": str(table.id), "store_id": str(store.id), "table_id": str(table.id), "role": "customer"}
        )
