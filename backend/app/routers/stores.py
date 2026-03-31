"""매장 라우터"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.repositories.store_repo import StoreRepo
from app.routers.auth import get_current_admin
from app.schemas.store import StoreResponse

router = APIRouter(prefix="/stores", tags=["매장"])


@router.get("/me", response_model=StoreResponse)
async def get_my_store(
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    repo = StoreRepo(db)
    store = await repo.get_by_id(current_user["store_id"])
    return store
