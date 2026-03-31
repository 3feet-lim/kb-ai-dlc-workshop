"""주문 테스트 (US-04, US-05, US-09) - Example-Based"""

import pytest
from httpx import AsyncClient


async def _get_table_token(client: AsyncClient) -> str:
    resp = await client.post("/api/auth/table-login", json={
        "store_code": "TEST", "table_number": 1, "password": "1234",
    })
    return resp.json()["access_token"]


async def _get_admin_token(client: AsyncClient) -> str:
    resp = await client.post("/api/auth/admin-login", json={
        "store_code": "TEST", "username": "testadmin", "password": "pass123",
    })
    return resp.json()["access_token"]


@pytest.mark.asyncio
async def test_create_order(client: AsyncClient, seed_data):
    """주문 생성 성공"""
    token = await _get_table_token(client)
    menu_id = str(seed_data["menu"].id)

    response = await client.post(
        "/api/orders",
        json={"items": [{"menu_id": menu_id, "quantity": 2}]},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["total_amount"] == 20000
    assert len(data["items"]) == 1
    assert data["items"][0]["quantity"] == 2
    assert data["status"] == "PENDING"


@pytest.mark.asyncio
async def test_create_order_empty_items(client: AsyncClient, seed_data):
    """주문 생성 실패 - 빈 항목"""
    token = await _get_table_token(client)
    response = await client.post(
        "/api/orders",
        json={"items": []},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_update_order_status(client: AsyncClient, seed_data):
    """주문 상태 변경: PENDING → PREPARING"""
    table_token = await _get_table_token(client)
    admin_token = await _get_admin_token(client)
    menu_id = str(seed_data["menu"].id)

    # 주문 생성
    resp = await client.post(
        "/api/orders",
        json={"items": [{"menu_id": menu_id, "quantity": 1}]},
        headers={"Authorization": f"Bearer {table_token}"},
    )
    order_id = resp.json()["id"]

    # 상태 변경
    resp = await client.patch(
        f"/api/orders/{order_id}/status",
        json={"status": "PREPARING"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "PREPARING"


@pytest.mark.asyncio
async def test_invalid_status_transition(client: AsyncClient, seed_data):
    """잘못된 상태 전이: PENDING → COMPLETED"""
    table_token = await _get_table_token(client)
    admin_token = await _get_admin_token(client)
    menu_id = str(seed_data["menu"].id)

    resp = await client.post(
        "/api/orders",
        json={"items": [{"menu_id": menu_id, "quantity": 1}]},
        headers={"Authorization": f"Bearer {table_token}"},
    )
    order_id = resp.json()["id"]

    resp = await client.patch(
        f"/api/orders/{order_id}/status",
        json={"status": "COMPLETED"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_delete_order(client: AsyncClient, seed_data):
    """주문 삭제"""
    table_token = await _get_table_token(client)
    admin_token = await _get_admin_token(client)
    menu_id = str(seed_data["menu"].id)

    resp = await client.post(
        "/api/orders",
        json={"items": [{"menu_id": menu_id, "quantity": 1}]},
        headers={"Authorization": f"Bearer {table_token}"},
    )
    order_id = resp.json()["id"]

    resp = await client.delete(
        f"/api/orders/{order_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert resp.status_code == 204
