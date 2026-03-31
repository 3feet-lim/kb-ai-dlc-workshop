"""도메인 생성기 (PBT-07) - Hypothesis strategies"""

import uuid

from hypothesis import strategies as st

# --- 기본 도메인 값 ---

store_ids = st.builds(uuid.uuid4)
table_ids = st.builds(uuid.uuid4)
menu_ids = st.builds(uuid.uuid4)
order_ids = st.builds(uuid.uuid4)

menu_names = st.text(
    alphabet=st.characters(whitelist_categories=("L", "N", "Z")),
    min_size=1,
    max_size=100,
).filter(lambda s: s.strip() != "")

menu_prices = st.integers(min_value=0, max_value=1_000_000)

quantities = st.integers(min_value=1, max_value=100)

unit_prices = st.integers(min_value=0, max_value=1_000_000)

descriptions = st.one_of(
    st.none(),
    st.text(min_size=0, max_size=500),
)

sort_orders = st.integers(min_value=0, max_value=1000)

category_names = st.text(
    alphabet=st.characters(whitelist_categories=("L", "N", "Z")),
    min_size=1,
    max_size=50,
).filter(lambda s: s.strip() != "")

# --- 복합 도메인 객체 ---

order_items_data = st.fixed_dictionaries({
    "menu_id": st.builds(lambda: str(uuid.uuid4())),
    "menu_name": menu_names,
    "quantity": quantities,
    "unit_price": unit_prices,
})

order_items_lists = st.lists(order_items_data, min_size=1, max_size=20)
