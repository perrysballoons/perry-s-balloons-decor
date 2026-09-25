import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { WHATSAPP_NUMBER } from "@/lib/catalog";
import { useLang } from "@/lib/i18n";

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
  const { t, lang } = useLang();
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [mensaje, setMensaje] = useState("");

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    const parts =
      lang === "en"
        ? [
            "Hi Perry's Balloons! 🎈",
            nombre && `I'm ${nombre}.`,
            fecha && `My event is on ${fecha}.`,
            mensaje,
          ]
        : [
            "¡Hola Perry's Balloons! 🎈",
            nombre && `Soy ${nombre}.`,
            fecha && `Mi evento es el ${fecha}.`,
            mensaje,
          ];
    const texto = parts.filter(Boolean).join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`, "_blank");
  };

  return (
    <SiteLayout>
      <section className="surface-party">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center md:py-20">
          <p className="text-xs font-bold tracking-[0.2em] text-primary uppercase">{t("contact.kicker")}</p>
          <h1 className="mt-2 text-4xl font-semibold md:text-5xl">{t("contact.title")}</h1>
          <p className="mt-4 text-secondary-foreground/70">{t("contact.subtitle")}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr]">
        <form
          onSubmit={enviar}
          className="space-y-4 border border-border bg-card p-6 shadow-soft"
        >
          <div>
            <label className="text-sm font-semibold">{t("contact.name")}</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              maxLength={80}
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">{t("contact.date")}</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">{t("contact.need")}</label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
              rows={5}
              maxLength={800}
              placeholder={t("contact.placeholder")}
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2"
            />
          </div>
          <button className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02]">
            {t("contact.send")}
          </button>
        </form>

        <div className="space-y-4 text-muted-foreground">
           <div className="border-l-2 border-primary bg-muted p-6">
            <h2 className="font-display text-xl text-foreground">{t("contact.writeUs")}</h2>
            <p className="mt-2">
              WhatsApp:{" "}
              <a className="font-semibold text-primary" href={`https://wa.me/${WHATSAPP_NUMBER}`}>
                +1 {WHATSAPP_NUMBER.slice(1, 4)} {WHATSAPP_NUMBER.slice(4, 7)}{" "}
                {WHATSAPP_NUMBER.slice(7)}
              </a>
            </p>
            <p className="mt-1">{t("contact.area")}</p>
          </div>
           <div className="border-l-2 border-primary bg-muted p-6">
            <h2 className="font-display text-xl text-foreground">{t("contact.bookings")}</h2>
            <p className="mt-2">{t("contact.bookingsText")}</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
