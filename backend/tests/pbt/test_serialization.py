"""직렬화 라운드트립 테스트 (PBT-02)"""

import uuid
from datetime import datetime, timezone

from hypothesis import given, settings
from hypothesis import strategies as st

from app.models.order import OrderStatus
from app.schemas.menu import MenuCreateRequest, MenuResponse
from app.schemas.order import OrderItemResponse, OrderResponse

from .generators import menu_names, menu_prices, quantities, sort_orders, unit_prices


@given(
    name=menu_names,
    price=menu_prices,
    sort_order=sort_orders,
)
@settings(max_examples=100)
def test_menu_create_request_roundtrip(name, price, sort_order):
    """MenuCreateRequest → dict → MenuCreateRequest 라운드트립"""
    category_id = uuid.uuid4()
    original = MenuCreateRequest(
        category_id=category_id, name=name, price=price, sort_order=sort_order
    )
    data = original.model_dump()
    restored = MenuCreateRequest.model_validate(data)
    assert original == restored


@given(
    name=menu_names,
    price=menu_prices,
)
@settings(max_examples=100)
def test_menu_response_roundtrip(name, price):
    """MenuResponse → JSON dict → MenuResponse 라운드트립"""
    response = MenuResponse(
        id=uuid.uuid4(),
        store_id=uuid.uuid4(),
        category_id=uuid.uuid4(),
        name=name,
        price=price,
        description=None,
        image_url=None,
        sort_order=0,
        is_available=True,
        created_at=datetime.now(timezone.utc),
    )
    data = response.model_dump(mode="json")
    restored = MenuResponse.model_validate(data)
    assert response.name == restored.name
    assert response.price == restored.price


@given(
    menu_name=menu_names,
    quantity=quantities,
    unit_price=unit_prices,
)
@settings(max_examples=100)
def test_order_item_response_roundtrip(menu_name, quantity, unit_price):
    """OrderItemResponse → JSON dict → OrderItemResponse 라운드트립"""
    subtotal = quantity * unit_price
    item = OrderItemResponse(
        id=uuid.uuid4(),
        menu_id=uuid.uuid4(),
        menu_name=menu_name,
        quantity=quantity,
        unit_price=unit_price,
        subtotal=subtotal,
    )
    data = item.model_dump(mode="json")
    restored = OrderItemResponse.model_validate(data)
    assert item.menu_name == restored.menu_name
    assert item.quantity == restored.quantity
    assert item.unit_price == restored.unit_price
    assert item.subtotal == restored.subtotal


@given(
    items=st.lists(
        st.tuples(menu_names, quantities, unit_prices),
        min_size=1,
        max_size=10,
    ),
)
@settings(max_examples=50)
def test_order_response_roundtrip(items):
    """OrderResponse → JSON dict → OrderResponse 라운드트립"""
    order_items = []
    total = 0
    for name, qty, price in items:
        subtotal = qty * price
        total += subtotal
        order_items.append(OrderItemResponse(
            id=uuid.uuid4(),
            menu_id=uuid.uuid4(),
            menu_name=name,
            quantity=qty,
            unit_price=price,
            subtotal=subtotal,
        ))

    order = OrderResponse(
        id=uuid.uuid4(),
        store_id=uuid.uuid4(),
        table_id=uuid.uuid4(),
        session_id=uuid.uuid4(),
        order_number="#001",
        status=OrderStatus.PENDING,
        total_amount=total,
        items=order_items,
        created_at=datetime.now(timezone.utc),
    )
    data = order.model_dump(mode="json")
    restored = OrderResponse.model_validate(data)
    assert order.total_amount == restored.total_amount
    assert len(order.items) == len(restored.items)
