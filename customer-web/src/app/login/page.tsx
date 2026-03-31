"use client";

import { useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const { login } = useAuth();
  const [storeCode, setStoreCode] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(storeCode, Number(tableNumber), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        data-testid="table-login-form"
        className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6 space-y-4"
      >
        <h1 className="text-xl font-bold text-center mb-2">테이블 설정</h1>

        {error && (
          <div
            data-testid="login-error"
            role="alert"
            className="bg-red-50 text-red-600 text-sm p-3 rounded-lg"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="storeCode" className="block text-sm font-medium text-gray-700 mb-1">
            매장 코드
          </label>
          <input
            id="storeCode"
            data-testid="login-store-code"
            type="text"
            value={storeCode}
            onChange={(e) => setStoreCode(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="매장 코드 입력"
          />
        </div>

        <div>
          <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">
            테이블 번호
          </label>
          <input
            id="tableNumber"
            data-testid="login-table-number"
            type="number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            required
            min={1}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="테이블 번호 입력"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <input
            id="password"
            data-testid="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="비밀번호 입력"
          />
        </div>

        <button
          type="submit"
          data-testid="login-submit-button"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl min-h-[44px] hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
