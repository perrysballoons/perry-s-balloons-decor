import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import { adminDecorationsQuery, categoriesQuery, type Decoration } from "@/lib/decorations";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel de decoraciones — Perry's Balloons" },
      { name: "description", content: "Gestión interna de decoraciones de Perry's Balloons." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Panel de decoraciones — Perry's Balloons" },
      { property: "og:description", content: "Gestión interna de Perry's Balloons." },
    ],
  }),
  component: Admin,
});

type Form = Omit<Decoration, "id"> & { id?: string };

const empty: Form = {
  category_id: null,
  name_es: "",
  name_en: "",
  description_es: "",
  description_en: "",
  tag_es: "",
  tag_en: "",
  price: 0,
  image_url: "",
  is_active: true,
  sort_order: 0,
};

function Admin() {
  const { t, pick, lang, setLang } = useLang();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [form, setForm] = useState<Form | null>(null);

  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: decorations = [] } = useQuery(adminDecorationsQuery);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["decorations"] });

  const save = useMutation({
    mutationFn: async (f: Form) => {
      const payload = {
        category_id: f.category_id,
        name_es: f.name_es,
        name_en: f.name_en,
        description_es: f.description_es,
        description_en: f.description_en,
        tag_es: f.tag_es,
        tag_en: f.tag_en,
        price: f.price,
        image_url: f.image_url,
        is_active: f.is_active,
        sort_order: f.sort_order,
      };
      const { error } = f.id
        ? await supabase.from("decorations").update(payload).eq("id", f.id)
        : await supabase.from("decorations").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      setForm(null);
      invalidate();
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("decorations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const field = (
    label: string,
    key: keyof Form,
    type: "text" | "number" | "textarea" = "text",
  ) => (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={3}
          value={String(form?.[key] ?? "")}
          onChange={(e) => setForm((f) => (f ? { ...f, [key]: e.target.value } : f))}
          className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
      ) : (
        <input
          type={type}
          value={String(form?.[key] ?? "")}
          onChange={(e) =>
            setForm((f) =>
              f
                ? { ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }
                : f,
            )
          }
          className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-4">
          <h1 className="font-display text-xl font-semibold">{t("admin.title")}</h1>
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
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        <button
          onClick={() => setForm({ ...empty })}
          className="rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground shadow-soft"
        >
          + {t("admin.new")}
        </button>

        {form && (
          <div className="mt-6 grid gap-4 rounded-3xl border border-border bg-card p-6 md:grid-cols-2">
            {field(t("admin.nameEs"), "name_es")}
            {field(t("admin.nameEn"), "name_en")}
            {field(t("admin.descEs"), "description_es", "textarea")}
            {field(t("admin.descEn"), "description_en", "textarea")}
            {field(t("admin.tagEs"), "tag_es")}
            {field(t("admin.tagEn"), "tag_en")}
            {field(t("admin.price"), "price", "number")}
            {field(t("admin.order"), "sort_order", "number")}
            <div className="md:col-span-2">{field(t("admin.image"), "image_url")}</div>
            <div>
              <label className="text-sm font-semibold">{t("admin.category")}</label>
              <select
                value={form.category_id ?? ""}
                onChange={(e) =>
                  setForm((f) => (f ? { ...f, category_id: e.target.value || null } : f))
                }
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {pick(c.name_es, c.name_en)}
                  </option>
                ))}
              </select>
            </div>
            <label className="mt-6 flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => (f ? { ...f, is_active: e.target.checked } : f))}
              />
              {t("admin.active")}
            </label>
            <div className="flex gap-3 md:col-span-2">
              <button
                onClick={() => save.mutate(form)}
                disabled={save.isPending}
                className="rounded-full bg-primary px-6 py-2.5 font-bold text-primary-foreground disabled:opacity-50"
              >
                {t("admin.save")}
              </button>
              <button
                onClick={() => setForm(null)}
                className="rounded-full border border-border px-6 py-2.5 font-bold"
              >
                {t("admin.cancel")}
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decorations.map((d) => (
            <article
              key={d.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card"
            >
              {d.image_url && (
                <img
                  src={d.image_url}
                  alt={pick(d.name_es, d.name_en)}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-4">
                <p className="font-semibold">{pick(d.name_es, d.name_en)}</p>
                <p className="text-sm text-muted-foreground">
                  ${d.price} ·{" "}
                  {pick(
                    categories.find((c) => c.id === d.category_id)?.name_es,
                    categories.find((c) => c.id === d.category_id)?.name_en,
                  ) || "—"}
                </p>
                {!d.is_active && (
                  <span className="mt-2 w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold">
                    {t("admin.hidden")}
                  </span>
                )}
                <div className="mt-4 flex gap-3 text-sm font-semibold">
                  <button onClick={() => setForm({ ...d })} className="text-primary">
                    {t("admin.edit")}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(t("admin.confirm"))) del.mutate(d.id);
                    }}
                    className="text-muted-foreground"
                  >
                    {t("admin.delete")}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
