"""메뉴 서비스 (US-12)"""

import os
import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.category import Category
from app.models.menu import Menu
from app.repositories.category_repo import CategoryRepo
from app.repositories.menu_repo import MenuRepo
from app.schemas.menu import MenuCreateRequest, MenuUpdateRequest


class MenuService:
    def __init__(self, db: AsyncSession):
        self.menu_repo = MenuRepo(db)
        self.category_repo = CategoryRepo(db)

    async def create_menu(self, store_id: uuid.UUID, request: MenuCreateRequest) -> Menu:
        category = await self.category_repo.get_by_id(store_id, request.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다")

        menu = Menu(store_id=store_id, **request.model_dump())
        return await self.menu_repo.create(menu)

    async def update_menu(self, store_id: uuid.UUID, menu_id: uuid.UUID, request: MenuUpdateRequest) -> Menu:
        menu = await self.menu_repo.get_by_id(store_id, menu_id)
        if not menu:
            raise HTTPException(status_code=404, detail="메뉴를 찾을 수 없습니다")

        update_data = request.model_dump(exclude_unset=True)
        if "category_id" in update_data:
            category = await self.category_repo.get_by_id(store_id, update_data["category_id"])
            if not category:
                raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다")

        for key, value in update_data.items():
            setattr(menu, key, value)
        return await self.menu_repo.update(menu)

    async def delete_menu(self, store_id: uuid.UUID, menu_id: uuid.UUID) -> None:
        menu = await self.menu_repo.get_by_id(store_id, menu_id)
        if not menu:
            raise HTTPException(status_code=404, detail="메뉴를 찾을 수 없습니다")
        await self.menu_repo.delete(menu)

    async def get_menus(self, store_id: uuid.UUID, category_id: uuid.UUID | None = None) -> list[Menu]:
        return await self.menu_repo.get_all(store_id, category_id)

    async def create_category(self, store_id: uuid.UUID, name: str, sort_order: int = 0) -> Category:
        category = Category(store_id=store_id, name=name, sort_order=sort_order)
        return await self.category_repo.create(category)

    async def update_category(
        self, store_id: uuid.UUID, category_id: uuid.UUID, name: str | None, sort_order: int | None
    ) -> Category:
        category = await self.category_repo.get_by_id(store_id, category_id)
        if not category:
            raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다")
        if name is not None:
            category.name = name
        if sort_order is not None:
            category.sort_order = sort_order
        return await self.category_repo.update(category)

    async def delete_category(self, store_id: uuid.UUID, category_id: uuid.UUID) -> None:
        category = await self.category_repo.get_by_id(store_id, category_id)
        if not category:
            raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다")
        menu_count = await self.category_repo.count_menus(store_id, category_id)
        if menu_count > 0:
            raise HTTPException(status_code=400, detail="메뉴가 있는 카테고리는 삭제할 수 없습니다")
        await self.category_repo.delete(category)

    async def get_categories(self, store_id: uuid.UUID) -> list[Category]:
        return await self.category_repo.get_all(store_id)

    async def upload_image(self, store_id: uuid.UUID, file: UploadFile) -> str:
        ext = file.filename.rsplit(".", 1)[-1].lower() if file.filename else ""
        if ext not in settings.allowed_extensions:
            raise HTTPException(status_code=400, detail=f"허용되지 않는 파일 형식: {ext}")

        filename = f"{uuid.uuid4()}.{ext}"
        store_dir = os.path.join(settings.upload_dir, str(store_id))
        os.makedirs(store_dir, exist_ok=True)

        filepath = os.path.join(store_dir, filename)
        content = await file.read()
        with open(filepath, "wb") as f:
            f.write(content)

        return f"/static/uploads/{store_id}/{filename}"
