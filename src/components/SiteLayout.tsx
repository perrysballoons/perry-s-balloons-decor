import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { CartDrawer } from "./CartDrawer";
import { WHATSAPP_NUMBER } from "@/lib/catalog";
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

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed right-5 bottom-5 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
      >
        <svg viewBox="0 0 32 32" className="size-7 fill-current" aria-hidden="true">
          <path d="M16.1 3C9.4 3 4 8.4 4 15.1c0 2.1.6 4.2 1.6 6L4 29l8.1-1.6c1.7.9 3.7 1.4 5.7 1.4h.1c6.7 0 12.1-5.4 12.1-12.1C29.9 8.4 24.5 3 18 3h-1.9zm6.9 17.1c-.3.8-1.7 1.6-2.4 1.7-.6.1-1.4.1-2.3-.1-.5-.2-1.2-.4-2.1-.8-3.7-1.6-6.1-5.4-6.3-5.6-.2-.3-1.5-2-1.5-3.8s.9-2.7 1.3-3.1c.3-.4.7-.5 1-.5h.7c.2 0 .5-.1.8.6.3.8 1.1 2.6 1.2 2.8.1.2.1.4 0 .6-.1.3-.2.4-.4.7-.2.2-.4.5-.6.7-.2.2-.4.4-.2.8.2.4 1 1.7 2.2 2.7 1.5 1.4 2.8 1.8 3.2 2 .4.2.6.1.9-.1.2-.3 1-1.2 1.3-1.6.3-.4.5-.3.9-.2.4.1 2.2 1 2.6 1.2.4.2.6.3.7.5.1.2.1 1-.3 1.8z" />
        </svg>
      </a>
    </div>
  );
}
