import { useEffect, useState } from "react";

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
