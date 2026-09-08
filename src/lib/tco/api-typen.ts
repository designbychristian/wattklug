import type { BreakEvenErgebnis, TcoErgebnis } from "./gesamt";
import type { Antriebsart, Fahrzeugklasse } from "./typen";

// Vertrag zwischen POST /api/tco und dem Client — an einer Stelle
// definiert, damit Route und UI nicht auseinanderlaufen.
export type TcoErgebnisZeile = {
  antriebsart: Antriebsart;
  fahrzeug: { id: string; marke: string; modell: string; variante: string } | null;
  verbrauchJe100Km: number;
  tco: TcoErgebnis;
  verlauf: { jahr: number; kumuliert: number }[];
  breakEvenVsBev: BreakEvenErgebnis | null;
};

export type TcoAntwort = {
  berechnungsstand: {
    annahmenVersion: string;
    annahmenStand: string;
    energiepreiseStand: string;
  };
  klasse: Fahrzeugklasse;
  ergebnisse: TcoErgebnisZeile[];
};

export type TcoFehlerAntwort = {
  fehler: { feld: string; meldung: string }[];
};
