import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { WHATSAPP_NUMBER } from "@/lib/catalog";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Perry's Balloons" },
      {
        name: "description",
        content:
          "Escríbenos por WhatsApp para cotizar tu decoración de globos en Miami, FL. Respuesta rápida y diseños a tu medida.",
      },
      { property: "og:title", content: "Contacto — Perry's Balloons" },
      {
        property: "og:description",
        content: "Cotiza tu decoración de fiesta en Miami, FL por WhatsApp.",
      },
    ],
  }),
  component: Contacto,
});

function Contacto() {
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [mensaje, setMensaje] = useState("");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const texto = [
      "¡Hola Perry's Balloons! 🎈",
      nombre && `Soy ${nombre}.`,
      fecha && `Mi evento es el ${fecha}.`,
      mensaje,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`, "_blank");
  };

  return (
    <SiteLayout>
      <section className="surface-party">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-20">
          <p className="script text-2xl text-primary">Hablemos</p>
          <h1 className="mt-2 text-4xl font-semibold md:text-5xl">Cuéntanos de tu fiesta</h1>
          <p className="mt-4 text-muted-foreground">
            Respondemos por WhatsApp con ideas, disponibilidad y precio final.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr]">
        <form
          onSubmit={enviar}
          className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-soft"
        >
          <div>
            <label className="text-sm font-semibold">Tu nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              maxLength={80}
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Fecha del evento</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">¿Qué necesitas?</label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
              rows={5}
              maxLength={800}
              placeholder="Tema, colores, lugar, cantidad de invitados..."
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
            />
          </div>
          <button className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]">
            Enviar por WhatsApp
          </button>
        </form>

        <div className="space-y-4 text-muted-foreground">
          <div className="rounded-3xl bg-secondary/50 p-6">
            <h2 className="font-display text-xl text-foreground">Escríbenos</h2>
            <p className="mt-2">
              WhatsApp:{" "}
              <a className="font-semibold text-primary" href={`https://wa.me/${WHATSAPP_NUMBER}`}>
                +1 {WHATSAPP_NUMBER.slice(1, 4)} {WHATSAPP_NUMBER.slice(4, 7)}{" "}
                {WHATSAPP_NUMBER.slice(7)}
              </a>
            </p>
            <p className="mt-1">📍 Miami, FL y alrededores</p>
          </div>
          <div className="rounded-3xl bg-secondary/50 p-6">
            <h2 className="font-display text-xl text-foreground">Reservas</h2>
            <p className="mt-2">
              Recomendamos reservar con 2 semanas de anticipación. Para fechas cercanas,
              escríbenos igual y buscamos la forma 💗
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
