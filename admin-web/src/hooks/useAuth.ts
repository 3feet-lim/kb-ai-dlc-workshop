"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, isTokenExpired, removeToken, getStoreIdFromToken } from "@/lib/auth";

export function useAuth() {
  const router = useRouter();
  const [storeId, setStoreId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token || isTokenExpired(token)) {
      removeToken();
      router.replace("/login");
      return;
    }
    setStoreId(getStoreIdFromToken(token));
    setLoading(false);
  }, [router]);

  const logout = () => {
    removeToken();
    router.replace("/login");
  };

  return { storeId, loading, logout };
}
