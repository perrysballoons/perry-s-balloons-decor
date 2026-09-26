import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "es" | "en";

const KEY = "perrys-lang";

const dict = {
  es: {
    "nav.home": "Inicio",
    "nav.about": "Sobre Nosotros",
    "nav.contact": "Contacto",
    "nav.order": "Mi pedido",
    "nav.admin": "Admin",
    "home.location": "Miami, FL 📍",
    "home.title": "Transformo momentos en recuerdos inolvidables 🎈",
    "home.subtitle":
      "🎀 Diseños personalizados con amor y estilo. 💗 Arcos, columnas y decoraciones únicas para tu celebración.",
    "home.cta1": "Armar mi pedido",
    "home.cta2": "Hablar con Perry",
    "home.decoTitle": "Elige tus decoraciones",
    "home.decoSubtitle":
      "Marca lo que quieras para tu fiesta y envíanos el pedido por WhatsApp. Todo se personaliza en tus colores y tema.",
    "home.all": "Todas",
    "home.empty": "Pronto publicaremos decoraciones en esta categoría.",
    "home.loading": "Cargando decoraciones...",
    "home.from": "Desde",
    "home.add": "Agregar",
    "home.step1": "1. Elige",
    "home.step1d": "Marca las decoraciones que quieres para tu evento.",
    "home.step2": "2. Envía",
    "home.step2d": "Tu pedido llega directo a nuestro WhatsApp con los detalles.",
    "home.step3": "3. Celebra",
    "home.step3d": "Nosotros montamos todo el día de tu fiesta.",
    "cart.title": "Mi pedido",
    "cart.close": "Cerrar",
    "cart.empty": "Aún no has agregado decoraciones. Elige las que quieras en el inicio 🎈",
    "cart.remove": "Quitar",
    "cart.name": "Tu nombre",
    "cart.place": "Lugar del evento",
    "cart.notes": "Colores, tema, detalles...",
    "cart.estimate": "Estimado",
    "cart.disclaimer": "El precio final se confirma por WhatsApp según tamaño, colores y montaje.",
    "cart.send": "Enviar pedido por WhatsApp",
    "cart.clear": "Vaciar pedido",
    "about.kicker": "Nuestra historia",
    "about.title": "Decoramos con amor cada celebración ✨",
    "about.intro":
      "Perry's Balloons nació del gusto por convertir espacios simples en escenarios que la gente recuerda. Desde Miami, FL diseñamos arcos orgánicos, columnas, muros y backdrops temáticos hechos a la medida de cada familia.",
    "about.h2": "Lo que nos distingue",
    "about.l1t": "Diseño personalizado:",
    "about.l1d": "elegimos juntos colores, tema y tamaño.",
    "about.l2t": "Detalles cuidados:",
    "about.l2d": "globos de calidad, follaje, letras luminosas y accesorios.",
    "about.l3t": "Montaje incluido:",
    "about.l3d": "llegamos, montamos y dejamos todo listo para las fotos.",
    "about.l4t": "Miami y alrededores:",
    "about.l4d": "servicio a domicilio, salones y parques.",
    "about.cta": "Cotizar mi fiesta",
    "contact.kicker": "Hablemos",
    "contact.title": "Cuéntanos de tu fiesta",
    "contact.subtitle": "Respondemos por WhatsApp con ideas, disponibilidad y precio final.",
    "contact.name": "Tu nombre",
    "contact.email": "Correo",
    "contact.phone": "Teléfono",
    "contact.oneRequired": "Deja al menos un contacto: correo o teléfono.",
    "contact.date": "Fecha del evento",
    "contact.need": "¿Qué necesitas?",
    "contact.placeholder": "Tema, colores, lugar, cantidad de invitados...",
    "contact.send": "Enviar mensaje",
    "contact.sending": "Enviando...",
    "contact.sent": "¡Mensaje enviado! Te respondemos pronto 💗",
    "contact.error": "No se pudo enviar. Escríbenos por WhatsApp.",
    "contact.writeUs": "Escríbenos",
    "contact.area": "📍 Miami, FL y alrededores",
    "contact.bookings": "Reservas",
    "contact.bookingsText":
      "Recomendamos reservar con 2 semanas de anticipación. Para fechas cercanas, escríbenos igual y buscamos la forma 💗",
    "footer.tagline": "📍 Miami, FL · Decoraciones para fiestas y eventos",
    "auth.title": "Acceso administrador",
    "auth.user": "Usuario",
    "auth.pass": "Contraseña",
    "auth.signin": "Entrar",
    "auth.error": "Usuario o contraseña incorrectos.",
    "auth.loading": "Entrando...",
    "admin.title": "Panel de decoraciones",
    "admin.new": "Nueva decoración",
    "admin.edit": "Editar",
    "admin.delete": "Eliminar",
    "admin.save": "Guardar",
    "admin.cancel": "Cancelar",
    "admin.signout": "Cerrar sesión",
    "admin.category": "Categoría",
    "admin.price": "Precio",
    "admin.image": "URL de la imagen",
    "admin.active": "Visible en el sitio",
    "admin.order": "Orden",
    "admin.nameEs": "Nombre (ES)",
    "admin.nameEn": "Nombre (EN)",
    "admin.descEs": "Descripción (ES)",
    "admin.descEn": "Descripción (EN)",
    "admin.tagEs": "Etiqueta (ES)",
    "admin.tagEn": "Etiqueta (EN)",
    "admin.confirm": "¿Eliminar esta decoración?",
    "admin.viewSite": "Ver sitio",
    "admin.hidden": "Oculta",
    "admin.panel": "Panel de administración",
    "admin.tabDecorations": "Decoraciones",
    "admin.tabCategories": "Categorías",
    "admin.catTitle": "Categorías",
    "admin.newCategory": "Nueva categoría",
    "admin.slug": "Identificador (slug)",
    "admin.confirmCat": "¿Eliminar esta categoría? Las decoraciones quedarán sin categoría.",
    "admin.catEmpty": "Aún no hay categorías.",
    "admin.decoCount": "decoraciones",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About Us",
    "nav.contact": "Contact",
    "nav.order": "My order",
    "nav.admin": "Admin",
    "home.location": "Miami, FL 📍",
    "home.title": "I turn moments into unforgettable memories 🎈",
    "home.subtitle":
      "🎀 Custom designs made with love and style. 💗 Arches, columns and unique decorations for your celebration.",
    "home.cta1": "Build my order",
    "home.cta2": "Chat with Perry",
    "home.decoTitle": "Choose your decorations",
    "home.decoSubtitle":
      "Pick what you want for your party and send us the order on WhatsApp. Everything is customized in your colors and theme.",
    "home.all": "All",
    "home.empty": "We'll publish decorations for this category soon.",
    "home.loading": "Loading decorations...",
    "home.from": "From",
    "home.add": "Add",
    "home.step1": "1. Choose",
    "home.step1d": "Pick the decorations you want for your event.",
    "home.step2": "2. Send",
    "home.step2d": "Your order goes straight to our WhatsApp with all the details.",
    "home.step3": "3. Celebrate",
    "home.step3d": "We set everything up on the day of your party.",
    "cart.title": "My order",
    "cart.close": "Close",
    "cart.empty": "You haven't added decorations yet. Pick your favorites on the home page 🎈",
    "cart.remove": "Remove",
    "cart.name": "Your name",
    "cart.place": "Event location",
    "cart.notes": "Colors, theme, details...",
    "cart.estimate": "Estimate",
    "cart.disclaimer": "Final price is confirmed on WhatsApp based on size, colors and setup.",
    "cart.send": "Send order on WhatsApp",
    "cart.clear": "Clear order",
    "about.kicker": "Our story",
    "about.title": "We decorate every celebration with love ✨",
    "about.intro":
      "Perry's Balloons was born from the joy of turning simple spaces into scenes people remember. From Miami, FL we design organic arches, columns, walls and themed backdrops made to measure for every family.",
    "about.h2": "What makes us different",
    "about.l1t": "Custom design:",
    "about.l1d": "we choose colors, theme and size together.",
    "about.l2t": "Careful details:",
    "about.l2d": "quality balloons, greenery, light-up letters and accessories.",
    "about.l3t": "Setup included:",
    "about.l3d": "we arrive, set up and leave everything ready for photos.",
    "about.l4t": "Miami and nearby:",
    "about.l4d": "service at homes, venues and parks.",
    "about.cta": "Get a quote",
    "contact.kicker": "Let's talk",
    "contact.title": "Tell us about your party",
    "contact.subtitle": "We reply on WhatsApp with ideas, availability and the final price.",
    "contact.name": "Your name",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.oneRequired": "Leave at least one way to reach you: email or phone.",
    "contact.date": "Event date",
    "contact.need": "What do you need?",
    "contact.placeholder": "Theme, colors, venue, number of guests...",
    "contact.send": "Send message",
    "contact.sending": "Sending...",
    "contact.sent": "Message sent! We'll reply soon 💗",
    "contact.error": "Couldn't send. Message us on WhatsApp.",
    "contact.writeUs": "Write to us",
    "contact.area": "📍 Miami, FL and nearby",
    "contact.bookings": "Bookings",
    "contact.bookingsText":
      "We recommend booking 2 weeks in advance. For closer dates, message us anyway and we'll find a way 💗",
    "footer.tagline": "📍 Miami, FL · Party and event decorations",
    "auth.title": "Admin sign in",
    "auth.user": "Username",
    "auth.pass": "Password",
    "auth.signin": "Sign in",
    "auth.error": "Wrong username or password.",
    "auth.loading": "Signing in...",
    "admin.title": "Decorations panel",
    "admin.new": "New decoration",
    "admin.edit": "Edit",
    "admin.delete": "Delete",
    "admin.save": "Save",
    "admin.cancel": "Cancel",
    "admin.signout": "Sign out",
    "admin.category": "Category",
    "admin.price": "Price",
    "admin.image": "Image URL",
    "admin.active": "Visible on the site",
    "admin.order": "Order",
    "admin.nameEs": "Name (ES)",
    "admin.nameEn": "Name (EN)",
    "admin.descEs": "Description (ES)",
    "admin.descEn": "Description (EN)",
    "admin.tagEs": "Tag (ES)",
    "admin.tagEn": "Tag (EN)",
    "admin.confirm": "Delete this decoration?",
    "admin.viewSite": "View site",
    "admin.hidden": "Hidden",
    "admin.panel": "Admin panel",
    "admin.tabDecorations": "Decorations",
    "admin.tabCategories": "Categories",
    "admin.catTitle": "Categories",
    "admin.newCategory": "New category",
    "admin.slug": "Identifier (slug)",
    "admin.confirmCat": "Delete this category? Its decorations will have no category.",
    "admin.catEmpty": "No categories yet.",
    "admin.decoCount": "decorations",
  },
} as const;

export type TKey = keyof (typeof dict)["es"];

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
  pick: (es: string | null | undefined, en: string | null | undefined) => string;
};

const LangCtx = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang: (l) => {
        setLangState(l);
        try {
          localStorage.setItem(KEY, l);
        } catch {
          /* ignore */
        }
      },
      t: (k) => dict[lang][k] ?? k,
      pick: (es, en) => (lang === "en" ? en || es || "" : es || en || ""),
    }),
    [lang],
  );

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useLang() {
  const c = useContext(LangCtx);
  if (!c) throw new Error("useLang fuera de LangProvider");
  return c;
}
