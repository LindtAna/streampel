// Importiert Bilddateien (im PNG-Format) aus dem Ordner @/assets/images/
// Zentralisiert die Verwaltung von Bilder und macht sie über ein einziges Objekt zugänglich

import bg from "@/assets/images/bg.png";
import tabsbarbutton from "@/assets/images/tabsbarbutton.png";
import noPoster from "@/assets/images/noposter.png";
import rankingGradient from "@/assets/images/rankingGradient.png";


// Schlüssel (bg, highlight usw.) => Namen der Bilder
export const images = {
  bg,
  tabsbarbutton,
  rankingGradient,
  noPoster
};
