"""파일 업로드 라우터 (US-12)"""

from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.routers.auth import get_current_admin
from app.services.menu_service import MenuService

router = APIRouter(prefix="/files", tags=["파일"])


@router.post("/upload")
async def upload_file(
    file: UploadFile,
    current_user: dict = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = MenuService(db)
    url = await service.upload_image(current_user["store_id"], file)
    return {"url": url}
