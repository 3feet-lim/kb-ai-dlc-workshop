"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  isAuthenticated,
  getToken,
  getStoreId,
  getTableId,
  setAuth,
  clearAuth,
  saveCredentials,
  getCredentials,
  type StoredCredentials,
} from "@/lib/auth";
import { tableLogin } from "@/lib/api";

export function useAuth() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    setLoading(false);
  }, []);

  const login = useCallback(
    async (storeCode: string, tableNumber: number, password: string) => {
      const res = await tableLogin({
        store_code: storeCode,
        table_number: tableNumber,
        password,
      });
      setAuth(res.access_token, res.store_id, res.table_id);
      saveCredentials({ store_code: storeCode, table_number: tableNumber, password });
      setAuthenticated(true);
      router.push("/menu");
    },
    [router]
  );

  const tryAutoLogin = useCallback(async () => {
    const creds = getCredentials();
    if (!creds) return false;
    try {
      await login(creds.store_code, creds.table_number, creds.password);
      return true;
    } catch {
      return false;
    }
  }, [login]);

  const logout = useCallback(() => {
    clearAuth();
    setAuthenticated(false);
    router.push("/login");
  }, [router]);

  return {
    authenticated,
    loading,
    storeId: getStoreId(),
    tableId: getTableId(),
    login,
    tryAutoLogin,
    logout,
  };
}
