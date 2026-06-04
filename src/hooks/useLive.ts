import { useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getResolvedApiUrl } from "../lib/api/client";

// Existing simulation helpers (for fallback/compatibility)
export function useLiveNumber(initial: number, { min, max, step = 0.1, intervalMs = 1500 }: { min: number; max: number; step?: number; intervalMs?: number }) {
  const [v, setV] = useState(initial);
  useEffect(() => {
    const id = setInterval(() => {
      setV((prev) => {
        const delta = (Math.random() - 0.5) * step * 2;
        const next = prev + delta;
        if (next < min) return min + Math.random() * step;
        if (next > max) return max - Math.random() * step;
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [min, max, step, intervalMs]);
  return v;
}

export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// WebSocket Live updates hook
export function useWebSocket() {
  const queryClient = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const backoffRef = useRef<number>(1000); // Start reconnect interval at 1s
  const maxBackoff = 16000; // Max reconnect interval 16s

  useEffect(() => {
    let isMounted = true;

    function connect() {
      // Determine WebSocket URL from VITE_API_URL
      const apiUrl = getResolvedApiUrl();
      const wsUrl = apiUrl.replace(/^http/, "ws") + "/ws";
      
      console.log("Connexion WebSocket à :", wsUrl);
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connecté avec succès !");
        backoffRef.current = 1000; // Reset reconnect timer on success
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const { type, data } = message;

          if (!type || !data) return;

          console.log(`[WS Event] Recu type: ${type}`, data);

          switch (type) {
            case "sensor":
              queryClient.setQueryData(["sensors"], (prev: any) => {
                return prev ? { ...prev, ...data } : data;
              });
              break;
            case "room":
              queryClient.setQueryData(["rooms"], (prev: any) => {
                if (!Array.isArray(prev)) return [data];
                return prev.map((r: any) => (r.id === data.id || r.name === data.name ? { ...r, ...data } : r));
              });
              // Also update specific rooms cache if needed
              break;
            case "activity":
              queryClient.setQueryData(["activities"], (prev: any) => {
                if (!Array.isArray(prev)) return [data];
                return [data, ...prev].slice(0, 50);
              });
              break;
            case "alert":
              queryClient.setQueryData(["alerts"], (prev: any) => {
                if (!Array.isArray(prev)) return [data];
                return [data, ...prev].slice(0, 50);
              });
              break;
            case "energy":
              queryClient.setQueryData(["energy"], (prev: any) => {
                return prev ? { ...prev, ...data } : data;
              });
              break;
            case "door":
              queryClient.setQueryData(["doors"], (prev: any) => {
                if (!Array.isArray(prev)) return [data];
                return prev.map((d: any) => (d.id === data.id || d.name === data.name ? { ...d, ...data } : d));
              });
              break;
            case "window":
              queryClient.setQueryData(["windows"], (prev: any) => {
                if (!Array.isArray(prev)) return [data];
                return prev.map((w: any) => (w.id === data.id || w.name === data.name ? { ...w, ...data } : w));
              });
              break;
            default:
              console.log("Type d'événement WebSocket inconnu:", type);
          }
        } catch (err) {
          console.error("Erreur de parsing du message WebSocket:", err);
        }
      };

      ws.onclose = (e) => {
        console.log(`WebSocket fermé (${e.code}). Tentative de reconnexion...`);
        socketRef.current = null;
        if (isMounted) {
          scheduleReconnect();
        }
      };

      ws.onerror = (err) => {
        console.error("Erreur WebSocket:", err);
        ws.close();
      };
    }

    function scheduleReconnect() {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      const delay = backoffRef.current;
      // Exponential backoff
      backoffRef.current = Math.min(delay * 2, maxBackoff);

      console.log(`Planification de la reconnexion WebSocket dans ${delay}ms`);
      reconnectTimeoutRef.current = window.setTimeout(() => {
        connect();
      }, delay);
    }

    connect();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [queryClient]);
}
