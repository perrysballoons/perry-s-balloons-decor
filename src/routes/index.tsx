import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { catalog, gallery } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Perry's Balloons — Decoraciones para fiestas en Miami" },
      {
        name: "description",
        content:
          "Arcos, columnas y backdrops personalizados para cumpleaños y eventos en Miami, FL. Arma tu pedido y envíalo por WhatsApp.",
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

  return (
    <SiteLayout>
      <section className="surface-party">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="script text-2xl text-primary">Miami, FL 📍</p>
            <h1 className="mt-2 text-4xl leading-tight font-semibold md:text-6xl">
              Transformo momentos en recuerdos inolvidables 🎈
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              🎀 Diseños personalizados con amor y estilo. 💗 Arcos, columnas y decoraciones únicas
              para tu celebración.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#decoraciones"
                className="rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-soft transition-transform hover:scale-105"
              >
                Armar mi pedido
              </a>
              <Link
                to="/contacto"
                className="rounded-full border border-primary px-6 py-3 font-bold text-primary"
              >
                Hablar con Perry
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((g, i) => (
              <img
                key={g.src}
                src={g.src}
                alt={g.alt}
                className={`w-full rounded-3xl object-cover shadow-soft ${i % 2 ? "h-56 md:h-72" : "h-44 md:h-56"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="decoraciones" className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="text-3xl font-semibold md:text-4xl">Elige tus decoraciones</h2>
        <p className="mt-2 max-w-xl text-muted-foreground">
          Marca lo que quieras para tu fiesta y envíanos el pedido por WhatsApp. Todo se personaliza
          en tus colores y tema.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft"
            >
              <img src={item.image} alt={item.name} className="h-48 w-full object-cover" />
              <div className="flex flex-1 flex-col p-5">
                <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                  {item.tag}
                </span>
                <h3 className="mt-3 text-xl font-semibold">{item.name}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{item.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-lg">Desde ${item.price}</span>
                  <button
                    onClick={() => add(item.id)}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="grid gap-6 rounded-3xl bg-secondary/50 p-8 md:grid-cols-3">
          {[
            ["1. Elige", "Marca las decoraciones que quieres para tu evento."],
            ["2. Envía", "Tu pedido llega directo a nuestro WhatsApp con los detalles."],
            ["3. Celebra", "Nosotros montamos todo el día de tu fiesta."],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="font-display text-xl">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
