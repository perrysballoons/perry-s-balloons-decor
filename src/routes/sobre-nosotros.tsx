import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { gallery } from "@/lib/catalog";
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
          <p className="script text-2xl text-primary">{t("about.kicker")}</p>
          <h1 className="mt-2 text-4xl font-semibold md:text-5xl">{t("about.title")}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{t("about.intro")}</p>
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
        <div className="grid grid-cols-2 gap-3">
          {gallery.map((g) => (
            <img
              key={g.src}
              src={g.src}
              alt={g.alt}
              className="h-52 w-full rounded-3xl object-cover shadow-soft"
            />
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
