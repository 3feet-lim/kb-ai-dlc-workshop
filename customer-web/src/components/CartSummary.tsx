"use client";

interface Props {
  totalAmount: number;
}

export default function CartSummary({ totalAmount }: Props) {
  return (
    <div
      data-testid="cart-summary"
      className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center"
    >
      <span className="text-gray-700 font-medium">총 금액</span>
      <span className="text-xl font-bold text-blue-600">
        {totalAmount.toLocaleString()}원
      </span>
    </div>
  );
}
