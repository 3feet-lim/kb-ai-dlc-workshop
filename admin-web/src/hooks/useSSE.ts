"use client";

import { useEffect, useRef, useCallback } from "react";
import { API_BASE } from "@/lib/api";
import { getToken } from "@/lib/auth";

interface SSEOptions {
  storeId: string | null;
  onEvent: (event: MessageEvent) => void;
}

export function useSSE({ storeId, onEvent }: SSEOptions) {
  const esRef = useRef<EventSource | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const connect = useCallback(() => {
    if (!storeId) return;
    const token = getToken();
    if (!token) return;

    esRef.current?.close();

    const url = `${API_BASE}/sse/orders?store_id=${storeId}&token=${token}`;
    const es = new EventSource(url);

    es.onmessage = (e) => onEventRef.current(e);
    es.onerror = () => {
      es.close();
      setTimeout(connect, 3000);
    };

    esRef.current = es;
  }, [storeId]);

  useEffect(() => {
    connect();
    return () => esRef.current?.close();
  }, [connect]);
}
