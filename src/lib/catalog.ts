import kpop from "@/assets/deco-kpop.json";
import azul from "@/assets/deco-azul.json";
import havana from "@/assets/deco-havana.json";
import tropical from "@/assets/deco-tropical.json";

export type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  tag: string;
};

export const WHATSAPP_NUMBER = "17865551234"; // Reemplazar por el número real

export const gallery = [
  { src: kpop.url, alt: "Set temático con arco, globos lila y letra luminosa" },
  { src: azul.url, alt: "Backdrop azul con guirnalda de globos y salvavidas" },
  { src: havana.url, alt: "Decoración Havana Night con muro verde y globos rojos" },
  { src: tropical.url, alt: "Arco tropical con globos fucsia, turquesa y naranja" },
];

export const catalog: Item[] = [
  {
    id: "arco-organico",
    name: "Arco orgánico de globos",
    description: "Guirnalda de globos en tus colores, 8–10 pies, con detalles y follaje.",
    price: 250,
    image: tropical.url,
    tag: "Más pedido",
  },
  {
    id: "backdrop-tematico",
    name: "Backdrop temático",
    description: "Panel impreso o personalizado con el nombre y tema del festejado.",
    price: 350,
    image: kpop.url,
    tag: "Personalizado",
  },
  {
    id: "set-completo",
    name: "Set completo de cumpleaños",
    description: "Backdrop, arco de globos, cilindros y tarima. Montaje incluido.",
    price: 600,
    image: azul.url,
    tag: "Todo incluido",
  },
  {
    id: "muro-flores",
    name: "Muro verde o de flores",
    description: "Pared decorativa con letrero neón o letras doradas a elección.",
    price: 300,
    image: havana.url,
    tag: "Elegante",
  },
  {
    id: "columnas",
    name: "Columnas de globos (par)",
    description: "Dos columnas para la entrada o los laterales del área principal.",
    price: 120,
    image: azul.url,
    tag: "Entrada",
  },
  {
    id: "letra-luminosa",
    name: "Letra o número luminoso",
    description: "Marquesina iluminada de 4 pies, rellena con globos si lo deseas.",
    price: 90,
    image: kpop.url,
    tag: "Add-on",
  },
];
