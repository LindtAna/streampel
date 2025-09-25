// Importiert Bilddateien (im PNG-Format) aus dem Ordner @/assets/icons/
// Zentralisiert die Verwaltung von Icons und macht sie über ein einziges Objekt zugänglich

import arrow from "@/assets/icons/arrow.png";
import home from "@/assets/icons/home.png";
import logo from "@/assets/icons/logo.png";
import person from "@/assets/icons/person.png";
import play from "@/assets/icons/play.png";
import save from "@/assets/icons/save.png";
import search from "@/assets/icons/search.png";
import star from "@/assets/icons/star.png";

// Schlüssel (home, search, person usw.) => Namen der Icons
export const icons = {
  home,
  search,
  person,
  logo,
  save,
  star,
  play,
  arrow,
};