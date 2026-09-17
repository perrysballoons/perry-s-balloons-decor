import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { catalog, type Item } from "./catalog";

type Line = { id: string; qty: number };
type CartCtx = {
  lines: Line[];
  items: (Line & { item: Item })[];
  count: number;
  total: number;
  add: (id: string) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "perrys-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const value = useMemo<CartCtx>(() => {
    const items = lines
      .map((l) => ({ ...l, item: catalog.find((c) => c.id === l.id)! }))
      .filter((l) => l.item);
    return {
      lines,
      items,
      count: items.reduce((n, l) => n + l.qty, 0),
      total: items.reduce((n, l) => n + l.qty * l.item.price, 0),
      add: (id) => {
        setLines((p) =>
          p.some((l) => l.id === id)
            ? p.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
            : [...p, { id, qty: 1 }],
        );
        setOpen(true);
      },
      remove: (id) => setLines((p) => p.filter((l) => l.id !== id)),
      setQty: (id, qty) =>
        setLines((p) =>
          qty <= 0 ? p.filter((l) => l.id !== id) : p.map((l) => (l.id === id ? { ...l, qty } : l)),
        ),
      clear: () => setLines([]),
      open,
      setOpen,
    };
  }, [lines, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart fuera de CartProvider");
  return c;
}
