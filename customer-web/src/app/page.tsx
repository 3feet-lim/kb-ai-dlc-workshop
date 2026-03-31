"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getCredentials } from "@/lib/auth";
import { tableLogin } from "@/lib/api";
import { setAuth } from "@/lib/auth";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    async function init() {
      // Already authenticated
      if (isAuthenticated()) {
        router.replace("/menu");
        return;
      }

      // Try auto-login with saved credentials
      const creds = getCredentials();
      if (creds) {
        try {
          const res = await tableLogin({
            store_code: creds.store_code,
            table_number: creds.table_number,
            password: creds.password,
          });
          setAuth(res.access_token, res.store_id, res.table_id);
          router.replace("/menu");
          return;
        } catch {
          // Auto-login failed, go to login page
        }
      }

      router.replace("/login");
    }
    init();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-gray-400">로딩 중...</span>
    </div>
  );
}
