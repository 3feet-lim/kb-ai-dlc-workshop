"""테이블 테스트 (US-08, US-10) - Example-Based"""

import pytest
from httpx import AsyncClient


async def _get_admin_token(client: AsyncClient) -> str:
    resp = await client.post("/api/auth/admin-login", json={
        "store_code": "TEST", "username": "testadmin", "password": "pass123",
    })
    return resp.json()["access_token"]


@pytest.mark.asyncio
async def test_create_table(client: AsyncClient, seed_data):
    """테이블 생성"""
    token = await _get_admin_token(client)
    response = await client.post(
        "/api/tables",
        json={"table_number": 99, "password": "secret"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    assert response.json()["table_number"] == 99


@pytest.mark.asyncio
async def test_create_duplicate_table(client: AsyncClient, seed_data):
    """중복 테이블 번호 생성 실패"""
    token = await _get_admin_token(client)
    response = await client.post(
        "/api/tables",
        json={"table_number": 1, "password": "secret"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_get_tables(client: AsyncClient, seed_data):
    """테이블 목록 조회"""
    token = await _get_admin_token(client)
    response = await client.get(
        "/api/tables",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert len(response.json()) >= 1
