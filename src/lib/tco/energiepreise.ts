import type { Antriebsart } from "./typen";

export type EnergiepreiseCache = {
  stand: string;
  strom: number; // EUR/kWh
  benzin: number; // EUR/l
  diesel: number; // EUR/l
  wasserstoff: number; // EUR/kg
};

// Startwerte aus TCO_calculator/parameter/energiepreise.csv. Im Betrieb
// stammen Strom- und Kraftstoffpreise aus einem täglich aktualisierten
// serverseitigen Cache (Tankerkönig, Bundesnetzagentur/SMARD; Pflichtenheft
// 9.3), Wasserstoff redaktionell/monatlich. Hier als statischer Startwert
// hinterlegt, bis die Cache-Anbindung an die externen APIs steht — kein
// Live-Abruf pro Nutzeranfrage, das gilt auch für den späteren Cache.
export const ENERGIEPREISE_CACHE_V0_1: EnergiepreiseCache = {
  stand: "2026-09-06",
  strom: 0.34,
  benzin: 1.79,
  diesel: 1.68,
  wasserstoff: 13.85,
};

// Hybrid/PHEV wird für die Energiekosten wie ein Benziner behandelt: der
// WLTP-Verbrauchswert in der Fahrzeugdatenbank bezieht sich auf den
// Kraftstoffanteil (Pflichtenheft 4.3, TUM-Kennzahlen zur WLTP/Real-Lücke
// bei PHEV in kennzahlen-tum-studie.md).
export function energiepreisFuer(antriebsart: Antriebsart, cache: EnergiepreiseCache): number {
  switch (antriebsart) {
    case "bev":
      return cache.strom;
    case "diesel":
      return cache.diesel;
    case "fcev":
      return cache.wasserstoff;
    case "benzin":
    case "hybrid":
      return cache.benzin;
  }
}
