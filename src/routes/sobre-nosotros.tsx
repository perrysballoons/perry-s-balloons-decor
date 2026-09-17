import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { gallery } from "@/lib/catalog";

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
  return (
    <SiteLayout>
      <section className="surface-party">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-24">
          <p className="script text-2xl text-primary">Nuestra historia</p>
          <h1 className="mt-2 text-4xl font-semibold md:text-5xl">
            Decoramos con amor cada celebración ✨
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Perry's Balloons nació del gusto por convertir espacios simples en escenarios que la
            gente recuerda. Desde Miami, FL diseñamos arcos orgánicos, columnas, muros y backdrops
            temáticos hechos a la medida de cada familia.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold">Lo que nos distingue</h2>
          <ul className="mt-6 space-y-4 text-muted-foreground">
            <li>
              🎀 <strong className="text-foreground">Diseño personalizado:</strong> elegimos juntos
              colores, tema y tamaño.
            </li>
            <li>
              💗 <strong className="text-foreground">Detalles cuidados:</strong> globos de calidad,
              follaje, letras luminosas y accesorios.
            </li>
            <li>
              🎈 <strong className="text-foreground">Montaje incluido:</strong> llegamos, montamos y
              dejamos todo listo para las fotos.
            </li>
            <li>
              📍 <strong className="text-foreground">Miami y alrededores:</strong> servicio a
              domicilio, salones y parques.
            </li>
          </ul>
          <Link
            to="/contacto"
            className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-soft"
          >
            Cotizar mi fiesta
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
