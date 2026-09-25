import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import { SiteLayout } from "@/components/SiteLayout";
import logoAsset from "@/assets/perrys-balloons-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Acceso administrador — Perry's Balloons" },
      { name: "description", content: "Área privada de administración de Perry's Balloons." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Acceso administrador — Perry's Balloons" },
      { property: "og:description", content: "Área privada de Perry's Balloons." },
    ],
  }),
  component: AuthPage,
});

export function usernameToEmail(username: string) {
  const u = username.trim();
  if (u.includes("@")) return u.toLowerCase();
  const safe = u.toLowerCase().replace(/[^a-z0-9._-]/g, "");
  return `${safe}@perrysballoons.app`;
}

function AuthPage() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({
      email: usernameToEmail(user),
      password: pass,
    });
    setLoading(false);
    if (err) {
      setError(t("auth.error"));
      return;
    }
    navigate({ to: "/admin" });
  };

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-5 py-20">
        <div className="border border-border bg-card p-8 shadow-soft">
          <img src={logoAsset.url} alt="Perry's Balloons" className="mx-auto mb-7 h-20 w-auto" />
          <h1 className="font-display text-2xl font-semibold">{t("auth.title")}</h1>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold">{t("auth.user")}</label>
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                required
                autoComplete="username"
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">{t("auth.pass")}</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                autoComplete="current-password"
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
              />
            </div>
            {error && <p className="text-sm font-semibold text-destructive">{error}</p>}
            <button
              disabled={loading}
              className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground shadow-soft disabled:opacity-50"
            >
              {loading ? t("auth.loading") : t("auth.signin")}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
