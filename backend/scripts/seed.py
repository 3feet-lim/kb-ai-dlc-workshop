"""시드 데이터 스크립트 - 테스트용 매장/테이블/메뉴 데이터 생성"""

import asyncio

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import async_session_factory
from app.core.security import hash_password
from app.models.admin_user import AdminUser
from app.models.category import Category
from app.models.menu import Menu
from app.models.store import Store
from app.models.table import Table


async def seed():
    async with async_session_factory() as db:
        # 기존 데이터 확인
        result = await db.execute(select(Store).where(Store.store_code == "DEMO"))
        if result.scalar_one_or_none():
            print("시드 데이터가 이미 존재합니다. 건너뜁니다.")
            return

        # 매장 생성
        store = Store(name="데모 매장", store_code="DEMO")
        db.add(store)
        await db.flush()

        # 관리자 계정
        admin = AdminUser(
            store_id=store.id,
            username="admin",
            password_hash=hash_password("admin123"),
        )
        db.add(admin)

        # 테이블 3개
        for i in range(1, 4):
            table = Table(
                store_id=store.id,
                table_number=i,
                password_hash=hash_password("1234"),
            )
            db.add(table)

        # 카테고리 3개
        cat_main = Category(store_id=store.id, name="메인", sort_order=1)
        cat_side = Category(store_id=store.id, name="사이드", sort_order=2)
        cat_drink = Category(store_id=store.id, name="음료", sort_order=3)
        db.add_all([cat_main, cat_side, cat_drink])
        await db.flush()

        # 메뉴 6개 (카테고리별 2개)
        menus = [
            Menu(store_id=store.id, category_id=cat_main.id, name="불고기", price=15000, sort_order=1),
            Menu(store_id=store.id, category_id=cat_main.id, name="김치찌개", price=10000, sort_order=2),
            Menu(store_id=store.id, category_id=cat_side.id, name="계란말이", price=7000, sort_order=1),
            Menu(store_id=store.id, category_id=cat_side.id, name="감자튀김", price=6000, sort_order=2),
            Menu(store_id=store.id, category_id=cat_drink.id, name="콜라", price=2000, sort_order=1),
            Menu(store_id=store.id, category_id=cat_drink.id, name="사이다", price=2000, sort_order=2),
        ]
        db.add_all(menus)

        await db.commit()
        print("시드 데이터 생성 완료!")
        print(f"  매장: {store.name} (코드: {store.store_code})")
        print(f"  관리자: admin / admin123")
        print(f"  테이블: 1~3번 / 비밀번호: 1234")


if __name__ == "__main__":
    asyncio.run(seed())
