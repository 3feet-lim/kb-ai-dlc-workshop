"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order_number") || "";
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      router.replace("/menu");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div
      data-testid="order-success-message"
      className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm w-full"
    >
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-xl font-bold mb-2">주문이 완료되었습니다</h1>
      <p className="text-3xl font-bold text-blue-600 mb-4">{orderNumber}</p>
      <p className="text-sm text-gray-500">
        {countdown}초 후 메뉴 화면으로 이동합니다.
      </p>
      <button
        data-testid="order-success-go-menu"
        onClick={() => router.replace("/menu")}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl min-h-[44px] hover:bg-blue-700 transition-colors"
      >
        메뉴로 바로 이동
      </button>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Suspense>
        <OrderSuccessContent />
      </Suspense>
    </div>
  );
}
