import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel de administración — Perry's Balloons" },
      { name: "description", content: "Gestión interna de Perry's Balloons." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Panel de administración — Perry's Balloons" },
      { property: "og:description", content: "Gestión interna de Perry's Balloons." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { t, lang, setLang } = useLang();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const tab =
    "rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-primary";
  const tabActive = "bg-primary text-primary-foreground hover:text-primary-foreground";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-4">
          <h1 className="font-display text-xl font-semibold">{t("admin.panel")}</h1>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <div className="inline-flex overflow-hidden rounded-full border border-border text-xs font-bold">
              {(["es", "en"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 uppercase ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Link to="/" className="text-muted-foreground underline">
              {t("admin.viewSite")}
            </Link>
            <button onClick={signOut} className="font-semibold text-primary">
              {t("admin.signout")}
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 px-5 pb-3">
          <Link to="/admin" activeOptions={{ exact: true }} className={tab} activeProps={{ className: tabActive }}>
            {t("admin.tabDecorations")}
          </Link>
          <Link to="/admin/categorias" className={tab} activeProps={{ className: tabActive }}>
            {t("admin.tabCategories")}
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <Outlet />
      </main>
    </div>
  );
}
