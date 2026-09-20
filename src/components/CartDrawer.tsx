import { useState } from "react";
import { useCart } from "@/lib/cart";
import { WHATSAPP_NUMBER } from "@/lib/catalog";
import { useLang } from "@/lib/i18n";

export function CartDrawer() {
  const { open, setOpen, items, total, setQty, remove, clear } = useCart();
  const { t, lang, pick } = useLang();
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [lugar, setLugar] = useState("");
  const [notas, setNotas] = useState("");

  if (!open) return null;

  const enviar = () => {
    const lineas = items.map(
      (l) => `• ${l.qty} x ${pick(l.nameEs, l.nameEn)} ($${l.qty * l.price})`,
    );
    const es = [
      "¡Hola Perry's Balloons! 🎈 Quiero pedir una decoración:",
      "",
      ...lineas,
      "",
      `Estimado: $${total}`,
      nombre && `Nombre: ${nombre}`,
      fecha && `Fecha del evento: ${fecha}`,
      lugar && `Lugar: ${lugar}`,
      notas && `Detalles: ${notas}`,
    ];
    const en = [
      "Hi Perry's Balloons! 🎈 I'd like to order a decoration:",
      "",
      ...lineas,
      "",
      `Estimate: $${total}`,
      nombre && `Name: ${nombre}`,
      fecha && `Event date: ${fecha}`,
      lugar && `Location: ${lugar}`,
      notas && `Details: ${notas}`,
    ];
    const texto = (lang === "en" ? en : es).filter(Boolean).join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-lg font-semibold">{t("cart.title")}</h2>
          <button onClick={() => setOpen(false)} className="text-sm text-muted-foreground">
            {t("cart.close")}
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {items.length === 0 && <p className="text-sm text-muted-foreground">{t("cart.empty")}</p>}
          {items.map((l) => (
            <div key={l.id} className="flex gap-3 rounded-2xl border border-border p-3">
              <img
                src={l.image}
                alt={pick(l.nameEs, l.nameEn)}
                className="size-16 rounded-xl object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold">{pick(l.nameEs, l.nameEn)}</p>
                <p className="text-sm text-muted-foreground">
                  {t("home.from")} ${l.price}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => setQty(l.id, l.qty - 1)}
                    className="size-7 rounded-full bg-secondary font-bold"
                  >
                    –
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{l.qty}</span>
                  <button
                    onClick={() => setQty(l.id, l.qty + 1)}
                    className="size-7 rounded-full bg-secondary font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={() => remove(l.id)}
                    className="ml-auto text-xs text-muted-foreground underline"
                  >
                    {t("cart.remove")}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {items.length > 0 && (
            <div className="space-y-3 pt-2">
              <input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder={t("cart.name")}
                maxLength={80}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                type="date"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
              <input
                value={lugar}
                onChange={(e) => setLugar(e.target.value)}
                placeholder={t("cart.place")}
                maxLength={120}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder={t("cart.notes")}
                maxLength={500}
                rows={3}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          )}
        </div>

        <div className="space-y-3 border-t border-border px-5 py-4">
          <div className="flex items-center justify-between font-display text-lg">
            <span>{t("cart.estimate")}</span>
            <span className="text-primary">${total}</span>
          </div>
          <p className="text-xs text-muted-foreground">{t("cart.disclaimer")}</p>
          <button
            disabled={items.length === 0}
            onClick={enviar}
            className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground shadow-soft transition-transform hover:scale-[1.02] disabled:opacity-40"
          >
            {t("cart.send")}
          </button>
          {items.length > 0 && (
            <button onClick={clear} className="w-full text-xs text-muted-foreground underline">
              {t("cart.clear")}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}
