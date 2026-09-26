import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/sobre-nosotros")({
  head: () => ({
    meta: [
      { title: "Sobre Nosotros — Perry's Balloons" },
      {
        name: "description",
        content:
          "Perry's Balloons diseña arcos, columnas y backdrops personalizados para fiestas y eventos en Miami, FL.",
      },
      { property: "og:title", content: "Sobre Nosotros — Perry's Balloons" },
      {
        property: "og:description",
        content: "Diseños personalizados con amor y estilo para tus celebraciones en Miami.",
      },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useLang();

  return (
    <SiteLayout>
      <section className="surface-party">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-24">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">{t("about.kicker")}</p>
          <h1 className="mt-2 text-4xl font-semibold md:text-5xl">{t("about.title")}</h1>
          <p className="mt-5 text-lg text-secondary-foreground/70">{t("about.intro")}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold">{t("about.h2")}</h2>
          <ul className="mt-6 space-y-4 text-muted-foreground">
            <li>
              🎀 <strong className="text-foreground">{t("about.l1t")}</strong> {t("about.l1d")}
            </li>
            <li>
              💗 <strong className="text-foreground">{t("about.l2t")}</strong> {t("about.l2d")}
            </li>
            <li>
              🎈 <strong className="text-foreground">{t("about.l3t")}</strong> {t("about.l3d")}
            </li>
            <li>
              📍 <strong className="text-foreground">{t("about.l4t")}</strong> {t("about.l4d")}
            </li>
          </ul>
          <Link
            to="/contacto"
            className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-soft"
          >
            {t("about.cta")}
          </Link>
        </div>
        <div className="relative min-h-80 overflow-hidden border border-primary/30 bg-background p-5 md:min-h-[26rem]">
          <div className="absolute -right-10 -top-10 size-48 rounded-full bg-primary/80" />
          <div className="absolute -bottom-16 -left-12 size-56 rounded-full bg-secondary" />
          <div className="absolute left-1/2 top-1/2 h-48 w-28 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[50%] border-8 border-primary bg-card shadow-soft md:h-64 md:w-40" />
          <div className="absolute bottom-10 left-10 h-24 w-16 -rotate-12 rounded-[50%] border-8 border-secondary-foreground/20 bg-secondary md:h-32 md:w-24" />
          <div className="absolute right-12 top-24 h-28 w-20 rotate-12 rounded-[50%] border-8 border-primary/40 bg-muted md:h-40 md:w-28" />
          <div className="absolute bottom-6 left-1/2 h-20 w-px -translate-x-1/2 bg-primary/50" />
        </div>
      </section>
    </SiteLayout>
  );
}
