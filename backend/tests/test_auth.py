"""인증 테스트 (US-01, US-06) - Example-Based"""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_admin_login_success(client: AsyncClient, seed_data):
    """관리자 로그인 성공"""
    response = await client.post("/api/auth/admin-login", json={
        "store_code": "TEST",
        "username": "testadmin",
        "password": "pass123",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_admin_login_wrong_password(client: AsyncClient, seed_data):
    """관리자 로그인 실패 - 잘못된 비밀번호"""
    response = await client.post("/api/auth/admin-login", json={
        "store_code": "TEST",
        "username": "testadmin",
        "password": "wrongpass",
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_admin_login_wrong_store(client: AsyncClient, seed_data):
    """관리자 로그인 실패 - 존재하지 않는 매장"""
    response = await client.post("/api/auth/admin-login", json={
        "store_code": "NONEXIST",
        "username": "testadmin",
        "password": "pass123",
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_table_login_success(client: AsyncClient, seed_data):
    """테이블 로그인 성공"""
    response = await client.post("/api/auth/table-login", json={
        "store_code": "TEST",
        "table_number": 1,
        "password": "1234",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


@pytest.mark.asyncio
async def test_table_login_wrong_password(client: AsyncClient, seed_data):
    """테이블 로그인 실패 - 잘못된 비밀번호"""
    response = await client.post("/api/auth/table-login", json={
        "store_code": "TEST",
        "table_number": 1,
        "password": "wrong",
    })
    assert response.status_code == 401
