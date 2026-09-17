import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { CartDrawer } from "./CartDrawer";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/sobre-nosotros", label: "Sobre Nosotros" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const { count, setOpen } = useCart();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4">
          <Link to="/" className="font-display text-xl font-semibold tracking-tight">
            Perry's <span className="text-primary">Balloons</span>
          </Link>
          <nav className="ml-auto hidden gap-6 text-sm font-semibold md:flex">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="text-muted-foreground transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setOpen(true)}
            className="ml-auto inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition-transform hover:scale-105 md:ml-0"
          >
            Mi pedido
            <span className="grid size-6 place-items-center rounded-full bg-primary-foreground/25 text-xs">
              {count}
            </span>
          </button>
        </div>
        <nav className="flex justify-center gap-6 border-t border-border/60 px-5 py-2 text-sm font-semibold md:hidden">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-muted-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <footer className="mt-24 border-t border-border/60 bg-secondary/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p className="font-display text-base text-foreground">Perry's Balloons</p>
          <p>📍 Miami, FL · Decoraciones para fiestas y eventos</p>
          <p>© {new Date().getFullYear()} Perry's Balloons</p>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}
