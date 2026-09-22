import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/lib/i18n";
import { adminDecorationsQuery, categoriesQuery, type Category } from "@/lib/decorations";

export const Route = createFileRoute("/_authenticated/admin/categorias")({
  component: AdminCategories,
});

type Form = Omit<Category, "id"> & { id?: string };

const empty: Form = { slug: "", name_es: "", name_en: "", sort_order: 0 };

function slugify(v: string) {
  return v
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function AdminCategories() {
  const { t, pick } = useLang();
  const qc = useQueryClient();
  const [form, setForm] = useState<Form | null>(null);
  const [error, setError] = useState("");

  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: decorations = [] } = useQuery(adminDecorationsQuery);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["categories"] });
    qc.invalidateQueries({ queryKey: ["decorations"] });
  };

  const save = useMutation({
    mutationFn: async (f: Form) => {
      const payload = {
        slug: f.slug || slugify(f.name_es || f.name_en),
        name_es: f.name_es,
        name_en: f.name_en,
        sort_order: f.sort_order,
      };
      const { error: err } = f.id
        ? await supabase.from("categories").update(payload).eq("id", f.id)
        : await supabase.from("categories").insert(payload);
      if (err) throw err;
    },
    onSuccess: () => {
      setError("");
      setForm(null);
      invalidate();
    },
    onError: (e: Error) => setError(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error: err } = await supabase.from("categories").delete().eq("id", id);
      if (err) throw err;
    },
    onSuccess: invalidate,
    onError: (e: Error) => setError(e.message),
  });

  const field = (label: string, key: "name_es" | "name_en" | "slug" | "sort_order", type = "text") => (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <input
        type={type}
        value={String(form?.[key] ?? "")}
        onChange={(e) =>
          setForm((f) =>
            f ? { ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value } : f,
          )
        }
        className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
      />
    </div>
  );

  return (
    <>
      <button
        onClick={() => {
          setError("");
          setForm({ ...empty });
        }}
        className="rounded-full bg-primary px-5 py-2.5 font-bold text-primary-foreground shadow-soft"
      >
        + {t("admin.newCategory")}
      </button>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      {form && (
        <div className="mt-6 grid gap-4 rounded-3xl border border-border bg-card p-6 md:grid-cols-2">
          {field(t("admin.nameEs"), "name_es")}
          {field(t("admin.nameEn"), "name_en")}
          {field(t("admin.slug"), "slug")}
          {field(t("admin.order"), "sort_order", "number")}
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

      <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
        {categories.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">{t("admin.catEmpty")}</p>
        )}
        {categories.map((c) => (
          <div
            key={c.id}
            className="flex flex-wrap items-center gap-3 border-b border-border/60 px-5 py-4 last:border-0"
          >
            <div>
              <p className="font-semibold">{pick(c.name_es, c.name_en)}</p>
              <p className="text-xs text-muted-foreground">
                {c.slug} · {decorations.filter((d) => d.category_id === c.id).length}{" "}
                {t("admin.decoCount")}
              </p>
            </div>
            <div className="ml-auto flex gap-3 text-sm font-semibold">
              <button
                onClick={() => {
                  setError("");
                  setForm({ ...c });
                }}
                className="text-primary"
              >
                {t("admin.edit")}
              </button>
              <button
                onClick={() => {
                  if (confirm(t("admin.confirmCat"))) del.mutate(c.id);
                }}
                className="text-muted-foreground"
              >
                {t("admin.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
