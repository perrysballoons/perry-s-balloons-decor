import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/SiteLayout";
import { useCart } from "@/lib/cart";
import { useLang } from "@/lib/i18n";
import { categoriesQuery, publicDecorationsQuery } from "@/lib/decorations";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Perry's Balloons — Decoraciones para fiestas en Miami" },
      {
        name: "description",
        content:
          "Arcos, columnas y backdrops personalizados para cumpleaños, graduaciones y navidad en Miami, FL. Arma tu pedido y envíalo por WhatsApp.",
      },
      { property: "og:title", content: "Perry's Balloons — Decoraciones para fiestas en Miami" },
      {
        property: "og:description",
        content: "Diseños personalizados con amor y estilo. Arcos, columnas y decoraciones únicas.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { add } = useCart();
  const { t, pick } = useLang();
  const [cat, setCat] = useState<string | null>(null);

  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: decorations = [], isLoading } = useQuery(publicDecorationsQuery);

  const shown = cat ? decorations.filter((d) => d.category_id === cat) : decorations;

  return (
    <SiteLayout>
      <section className="surface-party">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-14 md:grid-cols-[0.9fr_1.1fr] md:py-20">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">{t("home.location")}</p>
            <h1 className="mt-5 text-4xl leading-tight font-medium md:text-6xl">
              {t("home.title")}
            </h1>
            <p className="mt-5 max-w-md text-lg text-secondary-foreground/70">{t("home.subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#decoraciones"
                className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-soft transition-transform hover:scale-105"
              >
                {t("home.cta1")}
              </a>
              <Link
                to="/contacto"
                className="rounded-full border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {t("home.cta2")}
              </Link>
            </div>
          </div>
          <div className="relative min-h-80 overflow-hidden border border-primary/30 bg-background p-5 md:min-h-[26rem]">
            <div className="absolute -right-10 -top-10 size-48 rounded-full bg-primary/80" />
            <div className="absolute -bottom-16 -left-12 size-56 rounded-full bg-secondary" />
            <div className="absolute left-1/2 top-1/2 h-48 w-28 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[50%] border-8 border-primary bg-card shadow-soft md:h-64 md:w-40" />
            <div className="absolute bottom-10 left-10 h-24 w-16 -rotate-12 rounded-[50%] border-8 border-secondary-foreground/20 bg-secondary md:h-32 md:w-24" />
            <div className="absolute right-12 top-24 h-28 w-20 rotate-12 rounded-[50%] border-8 border-primary/40 bg-muted md:h-40 md:w-28" />
            <div className="absolute bottom-6 left-1/2 h-20 w-px -translate-x-1/2 bg-primary/50" />
          </div>
        </div>
      </section>

      <section id="decoraciones" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-semibold md:text-4xl">{t("home.decoTitle")}</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">{t("home.decoSubtitle")}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => setCat(null)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              cat === null ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            {t("home.all")}
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                cat === c.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {pick(c.name_es, c.name_en)}
            </button>
          ))}
        </div>

        {isLoading && <p className="mt-8 text-muted-foreground">{t("home.loading")}</p>}
        {!isLoading && shown.length === 0 && (
          <p className="mt-8 text-muted-foreground">{t("home.empty")}</p>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((item) => (
            <article
              key={item.id}
               className="group flex flex-col overflow-hidden border border-border bg-card shadow-soft"
            >
              <img
                src={item.image_url}
                alt={pick(item.name_es, item.name_en)}
                 className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="flex flex-1 flex-col p-5">
                {pick(item.tag_es, item.tag_en) && (
                  <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                    {pick(item.tag_es, item.tag_en)}
                  </span>
                )}
                <h3 className="mt-3 text-xl font-semibold">{pick(item.name_es, item.name_en)}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">
                  {pick(item.description_es, item.description_en)}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-lg">
                    {t("home.from")} ${item.price}
                  </span>
                  <button
                    onClick={() =>
                      add({
                        id: item.id,
                        nameEs: item.name_es,
                        nameEn: item.name_en,
                        price: item.price,
                        image: item.image_url,
                      })
                    }
                    className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
                  >
                    {t("home.add")}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="grid gap-8 border-y border-primary/30 bg-secondary p-8 text-secondary-foreground md:grid-cols-3">
          {[
            [t("home.step1"), t("home.step1d")],
            [t("home.step2"), t("home.step2d")],
            [t("home.step3"), t("home.step3d")],
          ].map(([title, desc]) => (
            <div key={title}>
              <h3 className="font-display text-xl">{title}</h3>
               <p className="mt-1 text-sm text-secondary-foreground/65">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
