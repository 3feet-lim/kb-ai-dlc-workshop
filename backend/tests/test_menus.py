"""메뉴 테스트 (US-02, US-12) - Example-Based"""

import pytest
from httpx import AsyncClient


async def _get_admin_token(client: AsyncClient) -> str:
    resp = await client.post("/api/auth/admin-login", json={
        "store_code": "TEST", "username": "testadmin", "password": "pass123",
    })
    return resp.json()["access_token"]


@pytest.mark.asyncio
async def test_create_menu(client: AsyncClient, seed_data):
    """메뉴 생성"""
    token = await _get_admin_token(client)
    category_id = str(seed_data["category"].id)

    response = await client.post(
        "/api/menus",
        json={
            "category_id": category_id,
            "name": "새 메뉴",
            "price": 8000,
            "description": "맛있는 메뉴",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "새 메뉴"
    assert data["price"] == 8000


@pytest.mark.asyncio
async def test_create_category(client: AsyncClient, seed_data):
    """카테고리 생성"""
    token = await _get_admin_token(client)
    response = await client.post(
        "/api/categories",
        json={"name": "디저트", "sort_order": 4},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    assert response.json()["name"] == "디저트"


@pytest.mark.asyncio
async def test_delete_category_with_menus(client: AsyncClient, seed_data):
    """메뉴가 있는 카테고리 삭제 실패"""
    token = await _get_admin_token(client)
    category_id = str(seed_data["category"].id)

    response = await client.delete(
        f"/api/categories/{category_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 400
