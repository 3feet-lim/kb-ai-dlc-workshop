"""테스트 설정 - 인메모리 SQLite 사용"""

import asyncio
from collections.abc import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.database import Base, get_db
from app.core.security import hash_password
from app.main import app
from app.models.admin_user import AdminUser
from app.models.category import Category
from app.models.menu import Menu
from app.models.store import Store
from app.models.table import Table

# 테스트용 SQLite (async)
TEST_DB_URL = "sqlite+aiosqlite:///./test.db"
test_engine = create_async_engine(TEST_DB_URL, echo=False)
test_session_factory = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with test_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


app.dependency_overrides[get_db] = override_get_db


@pytest_asyncio.fixture
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    async with test_session_factory() as session:
        yield session


@pytest_asyncio.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest_asyncio.fixture
async def seed_data(db_session: AsyncSession):
    """테스트용 시드 데이터"""
    store = Store(name="테스트 매장", store_code="TEST")
    db_session.add(store)
    await db_session.flush()

    admin = AdminUser(
        store_id=store.id, username="testadmin", password_hash=hash_password("pass123")
    )
    db_session.add(admin)

    table = Table(store_id=store.id, table_number=1, password_hash=hash_password("1234"))
    db_session.add(table)

    category = Category(store_id=store.id, name="메인", sort_order=1)
    db_session.add(category)
    await db_session.flush()

    menu = Menu(
        store_id=store.id, category_id=category.id, name="테스트메뉴", price=10000, sort_order=1
    )
    db_session.add(menu)
    await db_session.commit()

    return {"store": store, "admin": admin, "table": table, "category": category, "menu": menu}
