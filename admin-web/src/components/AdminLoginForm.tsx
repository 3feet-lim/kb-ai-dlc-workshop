"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setToken } from "@/lib/auth";

interface LoginResponse {
  access_token: string;
}

export default function AdminLoginForm() {
  const router = useRouter();
  const [storeCode, setStoreCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.postNoAuth<LoginResponse>("/auth/admin-login", {
        store_code: storeCode,
        username,
        password,
      });
      setToken(res.access_token);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form" data-testid="admin-login-form">
      <h1>매장 관리자 로그인</h1>
      {error && (
        <p className="error-message" role="alert" data-testid="login-error">
          {error}
        </p>
      )}
      <label htmlFor="storeCode">매장 식별자</label>
      <input
        id="storeCode"
        type="text"
        value={storeCode}
        onChange={(e) => setStoreCode(e.target.value)}
        required
        autoComplete="organization"
        data-testid="login-store-code-input"
      />

      <label htmlFor="username">사용자명</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoComplete="username"
        data-testid="login-username-input"
      />

      <label htmlFor="password">비밀번호</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        data-testid="login-password-input"
      />

      <button type="submit" disabled={loading} data-testid="login-submit-button">
        {loading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
