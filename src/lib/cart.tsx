import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  nameEs: string;
  nameEn: string;
  price: number;
  image: string;
};

type Line = CartItem & { qty: number };

type CartCtx = {
  items: Line[];
  count: number;
  total: number;
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "perrys-cart-v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<CartCtx>(
    () => ({
      items,
      count: items.reduce((n, l) => n + l.qty, 0),
      total: items.reduce((n, l) => n + l.qty * l.price, 0),
      add: (item) => {
        setItems((p) =>
          p.some((l) => l.id === item.id)
            ? p.map((l) => (l.id === item.id ? { ...l, ...item, qty: l.qty + 1 } : l))
            : [...p, { ...item, qty: 1 }],
        );
        setOpen(true);
      },
      remove: (id) => setItems((p) => p.filter((l) => l.id !== id)),
      setQty: (id, qty) =>
        setItems((p) =>
          qty <= 0 ? p.filter((l) => l.id !== id) : p.map((l) => (l.id === id ? { ...l, qty } : l)),
        ),
      clear: () => setItems([]),
      open,
      setOpen,
    }),
    [items, open],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart fuera de CartProvider");
  return c;
}
