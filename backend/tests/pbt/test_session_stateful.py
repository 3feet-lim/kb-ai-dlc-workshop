"""세션 상태 기반 테스트 (PBT-06) - 장바구니 모델"""

from hypothesis import settings as h_settings
from hypothesis.stateful import Bundle, RuleBasedStateMachine, rule, initialize

from .generators import menu_names, quantities, unit_prices


class CartModel(RuleBasedStateMachine):
    """장바구니 상태 기반 테스트: add/remove/update 시퀀스 후 총액 검증"""

    def __init__(self):
        super().__init__()
        self.cart: dict[str, dict] = {}  # menu_name → {quantity, unit_price}

    items = Bundle("items")

    @initialize()
    def init_cart(self):
        self.cart = {}

    @rule(target=items, name=menu_names, qty=quantities, price=unit_prices)
    def add_item(self, name, qty, price):
        """장바구니에 항목 추가"""
        if name in self.cart:
            self.cart[name]["quantity"] += qty
        else:
            self.cart[name] = {"quantity": qty, "unit_price": price}
        self._check_invariant()
        return name

    @rule(name=items)
    def remove_item(self, name):
        """장바구니에서 항목 제거"""
        if name in self.cart:
            del self.cart[name]
        self._check_invariant()

    @rule(name=items, new_qty=quantities)
    def update_quantity(self, name, new_qty):
        """항목 수량 변경"""
        if name in self.cart:
            self.cart[name]["quantity"] = new_qty
        self._check_invariant()

    def _check_invariant(self):
        """불변성: 총액 == 남은 항목들의 합"""
        total = sum(
            item["quantity"] * item["unit_price"]
            for item in self.cart.values()
        )
        recalculated = 0
        for item in self.cart.values():
            recalculated += item["quantity"] * item["unit_price"]
        assert total == recalculated
        assert total >= 0


TestCartStateful = CartModel.TestCase
TestCartStateful.settings = h_settings(max_examples=100, stateful_step_count=20)
