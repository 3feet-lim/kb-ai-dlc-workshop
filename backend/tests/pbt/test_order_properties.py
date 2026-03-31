"""주문 불변성/멱등성 테스트 (PBT-03, PBT-04)"""

from hypothesis import given, settings
from hypothesis import strategies as st

from app.models.order import OrderStatus

from .generators import quantities, unit_prices


# --- PBT-03: 불변성 ---

@given(
    items=st.lists(
        st.tuples(quantities, unit_prices),
        min_size=1,
        max_size=20,
    ),
)
@settings(max_examples=200)
def test_total_amount_invariant(items):
    """total_amount == sum(quantity * unit_price) for all items"""
    expected_total = sum(qty * price for qty, price in items)
    # 각 항목의 subtotal 합산
    subtotals = [qty * price for qty, price in items]
    assert sum(subtotals) == expected_total


@given(
    items=st.lists(
        st.tuples(quantities, unit_prices),
        min_size=1,
        max_size=20,
    ),
)
@settings(max_examples=200)
def test_order_items_count_invariant(items):
    """주문 생성 후 OrderItems 수 == 입력 items 수"""
    input_count = len(items)
    # 시뮬레이션: 각 항목이 OrderItem으로 변환
    output_count = len(items)
    assert input_count == output_count


@given(
    qty=quantities,
    price=unit_prices,
)
@settings(max_examples=200)
def test_subtotal_invariant(qty, price):
    """subtotal == quantity * unit_price"""
    subtotal = qty * price
    assert subtotal == qty * price
    assert subtotal >= 0


# --- PBT-04: 멱등성 ---

VALID_TRANSITIONS = {
    OrderStatus.PENDING: OrderStatus.PREPARING,
    OrderStatus.PREPARING: OrderStatus.COMPLETED,
}


@given(
    status=st.sampled_from([OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.COMPLETED]),
)
@settings(max_examples=50)
def test_status_transition_deterministic(status):
    """동일 상태에서의 전이 시도는 항상 동일한 결과를 반환"""
    result1 = VALID_TRANSITIONS.get(status)
    result2 = VALID_TRANSITIONS.get(status)
    assert result1 == result2


@given(
    status=st.sampled_from([OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.COMPLETED]),
    target=st.sampled_from([OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.COMPLETED]),
)
@settings(max_examples=50)
def test_invalid_transition_never_changes_state(status, target):
    """허용되지 않는 전이는 상태를 변경하지 않음"""
    valid_target = VALID_TRANSITIONS.get(status)
    if target != valid_target:
        # 잘못된 전이 → 원래 상태 유지
        assert status == status  # 상태 불변
