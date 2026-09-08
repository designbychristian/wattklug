import type { Antriebsart, Einkommensklasse } from "./typen";

export type Wertverlustkurve = { jahr1: number; folgejahre: number };

export type Co2Stufe = { bisGProKm: number; satzJeG: number };

export type Annahmen = {
  version: string;
  stand: string;
  wertverlust: Record<Antriebsart, Wertverlustkurve>;
  thgErloesProJahr: number;
  foerderung: {
    mindesthaltedauerMonate: number;
    betrag: Record<Einkommensklasse, { bev: number; hybrid: number }>;
  };
  kfzSteuer: {
    hubraumsatzJe100Cm3: { otto: number; diesel: number };
    co2FreibetragGProKm: number;
    co2Stufen: Co2Stufe[];
    mindeststeuerProJahr: number;
    befreiteAntriebe: Antriebsart[];
  };
  co2: {
    herstellungKg: Record<Antriebsart, number>;
    betriebGProKm: Record<Antriebsart, number>;
  };
};

// Quellen und Belegstand je Größe: TCO_calculator/parameter/pauschalen.csv.
// Änderungen an Werten erfordern eine neue Version, damit Ergebnisse
// reproduzierbar bleiben (Pflichtenheft 9.6).
export const ANNAHMEN_V0_1: Annahmen = {
  version: "0.1",
  stand: "2026-09-06",

  wertverlust: {
    bev: { jahr1: 0.28, folgejahre: 0.13 },
    benzin: { jahr1: 0.24, folgejahre: 0.12 },
    diesel: { jahr1: 0.25, folgejahre: 0.12 },
    hybrid: { jahr1: 0.27, folgejahre: 0.13 },
    fcev: { jahr1: 0.34, folgejahre: 0.16 },
  },

  thgErloesProJahr: 175,

  foerderung: {
    mindesthaltedauerMonate: 36,
    betrag: {
      bis40: { bev: 6000, hybrid: 3000 },
      bis60: { bev: 4500, hybrid: 2250 },
      bis80: { bev: 3000, hybrid: 1500 },
      ueber80: { bev: 0, hybrid: 0 },
    },
  },

  // KraftStG für Erstzulassungen ab 2021: Hubraumbetrag je angefangene 100 cm³
  // zzgl. progressivem CO₂-Betrag oberhalb des Freibetrags.
  kfzSteuer: {
    hubraumsatzJe100Cm3: { otto: 2.0, diesel: 9.5 },
    co2FreibetragGProKm: 95,
    co2Stufen: [
      { bisGProKm: 115, satzJeG: 2.0 },
      { bisGProKm: 135, satzJeG: 2.2 },
      { bisGProKm: 155, satzJeG: 2.5 },
      { bisGProKm: 175, satzJeG: 2.9 },
      { bisGProKm: 195, satzJeG: 3.4 },
      { bisGProKm: Infinity, satzJeG: 4.0 },
    ],
    mindeststeuerProJahr: 16,
    // FCEV gelten kraftfahrzeugsteuerlich als reine Elektrofahrzeuge.
    // Redaktionell gesetzt, da Pflichtenheft 4.7 die Prüfung offen lässt.
    befreiteAntriebe: ["bev", "fcev"],
  },

  co2: {
    herstellungKg: {
      bev: 9800,
      benzin: 6200,
      diesel: 6400,
      hybrid: 8100,
      fcev: 10400,
    },
    betriebGProKm: {
      bev: 58,
      benzin: 165,
      diesel: 148,
      hybrid: 112,
      fcev: 132,
    },
  },
};
