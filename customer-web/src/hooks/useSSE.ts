"use client";

import { useEffect, useRef, useCallback } from "react";
import { getSSEUrl } from "@/lib/api";
import { getStoreId, getTableId } from "@/lib/auth";

interface UseSSEOptions {
  onNewOrder?: (data: Record<string, unknown>) => void;
  onStatusChanged?: (data: Record<string, unknown>) => void;
  onOrderDeleted?: (data: Record<string, unknown>) => void;
  onSessionEnded?: (data: Record<string, unknown>) => void;
}

export function useSSE(options: UseSSEOptions) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const connect = useCallback(() => {
    const storeId = getStoreId();
    const tableId = getTableId();
    if (!storeId || !tableId) return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const url = getSSEUrl(storeId, tableId);
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "new_order":
            optionsRef.current.onNewOrder?.(data);
            break;
          case "status_changed":
            optionsRef.current.onStatusChanged?.(data);
            break;
          case "order_deleted":
            optionsRef.current.onOrderDeleted?.(data);
            break;
          case "session_ended":
            optionsRef.current.onSessionEnded?.(data);
            break;
        }
      } catch {
        // ignore parse errors
      }
    };

    es.onerror = () => {
      // EventSource auto-reconnects by default
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      eventSourceRef.current?.close();
    };
  }, [connect]);

  return { reconnect: connect };
}
