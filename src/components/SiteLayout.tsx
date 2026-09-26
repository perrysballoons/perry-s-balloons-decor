import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { CartDrawer } from "./CartDrawer";
import logoAsset from "@/assets/perrys-balloons-logo.png";

export function SiteLayout({ children }: { children: ReactNode }) {
  const { count, setOpen } = useCart();
  const { t, lang, setLang } = useLang();

  const nav = [
    { to: "/", label: t("nav.home") },
    { to: "/sobre-nosotros", label: t("nav.about") },
    { to: "/contacto", label: t("nav.contact") },
  ] as const;

  const LangSwitch = () => (
    <div className="inline-flex overflow-hidden rounded-full border border-border text-xs font-bold">
      {(["es", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-3 py-1.5 uppercase transition-colors ${
            lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-primary/35 bg-background/95 text-foreground backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-3">
          <Link to="/" className="shrink-0" aria-label="Perry's Balloons">
            <img src={logoAsset} alt="Perry's Balloons" className="h-12 w-auto md:h-14" />
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
          <div className="ml-auto flex items-center gap-3 md:ml-0">
            <LangSwitch />
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition-transform hover:scale-105"
            >
              {t("nav.order")}
              <span className="grid size-6 place-items-center rounded-full bg-primary-foreground/25 text-xs">
                {count}
              </span>
            </button>
          </div>
        </div>
        <nav className="flex justify-center gap-6 border-t border-primary/20 px-5 py-2 text-sm font-semibold md:hidden">
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

      <footer className="mt-24 border-t border-primary/30 bg-muted text-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <img src={logoAsset} alt="Perry's Balloons" className="h-12 w-auto self-start" />
          <p>{t("footer.tagline")}</p>
          <p className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} Perry's Balloons</span>
            <Link to="/auth" className="underline">
              {t("nav.admin")}
            </Link>
          </p>
        </div>
      </footer>

      <CartDrawer />
    </div>
  );
}
