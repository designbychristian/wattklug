import {
  ANTRIEBSARTEN,
  EINKOMMENSKLASSEN,
  FAHRZEUGKLASSEN,
  type Antriebsart,
  type Einkommensklasse,
  type Fahrzeugklasse,
} from "./typen";
import { findFahrzeug } from "./fahrzeuge";

export type EnergiepreisUebersteuerung = Partial<{
  strom: number;
  benzin: number;
  diesel: number;
  wasserstoff: number;
}>;

export type TcoAnfrage = {
  klasse: Fahrzeugklasse;
  jahresKm: number;
  haltedauerJahre: number;
  einkommensklasse: Einkommensklasse;
  energiepreise?: EnergiepreisUebersteuerung;
  preissteigerungProzent?: number;
  versicherungProJahr?: Partial<Record<Antriebsart, number>>;
  vignettenProJahr?: number;
  fahrzeugIds?: Partial<Record<Antriebsart, string>>;
};

export type ValidierungsFehler = { feld: string; meldung: string };

const ENERGIETRAEGER = ["strom", "benzin", "diesel", "wasserstoff"] as const;

function istPositiveZahl(wert: unknown): wert is number {
  return typeof wert === "number" && Number.isFinite(wert) && wert > 0;
}

// Validiert und normalisiert einen rohen JSON-Request-Body zur Stufe-1/2-
// Eingabe des Rechners (Pflichtenheft 3.2/3.3). Gibt entweder eine typisierte
// Anfrage oder eine Liste von Feldfehlern zurück — nie beides.
export function validiereTcoAnfrage(
  body: unknown,
): { anfrage: TcoAnfrage } | { fehler: ValidierungsFehler[] } {
  const fehler: ValidierungsFehler[] = [];

  if (typeof body !== "object" || body === null) {
    return { fehler: [{ feld: "body", meldung: "Anfrage muss ein JSON-Objekt sein." }] };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.klasse !== "string" || !FAHRZEUGKLASSEN.includes(b.klasse as Fahrzeugklasse)) {
    fehler.push({ feld: "klasse", meldung: `Muss eine von: ${FAHRZEUGKLASSEN.join(", ")} sein.` });
  }

  if (!istPositiveZahl(b.jahresKm) || b.jahresKm > 200000) {
    fehler.push({ feld: "jahresKm", meldung: "Muss eine Zahl zwischen 0 und 200000 sein." });
  }

  if (
    typeof b.haltedauerJahre !== "number" ||
    !Number.isInteger(b.haltedauerJahre) ||
    b.haltedauerJahre < 1 ||
    b.haltedauerJahre > 15
  ) {
    fehler.push({ feld: "haltedauerJahre", meldung: "Muss eine ganze Zahl zwischen 1 und 15 sein." });
  }

  let einkommensklasse: Einkommensklasse = "ueber80";
  if (b.einkommensklasse !== undefined) {
    if (
      typeof b.einkommensklasse !== "string" ||
      !EINKOMMENSKLASSEN.includes(b.einkommensklasse as Einkommensklasse)
    ) {
      fehler.push({
        feld: "einkommensklasse",
        meldung: `Muss eine von: ${EINKOMMENSKLASSEN.join(", ")} sein.`,
      });
    } else {
      einkommensklasse = b.einkommensklasse as Einkommensklasse;
    }
  }

  let energiepreise: EnergiepreisUebersteuerung | undefined;
  if (b.energiepreise !== undefined) {
    if (typeof b.energiepreise !== "object" || b.energiepreise === null) {
      fehler.push({ feld: "energiepreise", meldung: "Muss ein Objekt sein." });
    } else {
      energiepreise = {};
      const eingereicht = b.energiepreise as Record<string, unknown>;
      for (const key of Object.keys(eingereicht)) {
        if (!ENERGIETRAEGER.includes(key as (typeof ENERGIETRAEGER)[number])) {
          fehler.push({ feld: `energiepreise.${key}`, meldung: "Unbekannter Energieträger." });
          continue;
        }
        const wert = eingereicht[key];
        if (!istPositiveZahl(wert)) {
          fehler.push({ feld: `energiepreise.${key}`, meldung: "Muss eine positive Zahl sein." });
          continue;
        }
        energiepreise[key as (typeof ENERGIETRAEGER)[number]] = wert;
      }
    }
  }

  let preissteigerungProzent: number | undefined;
  if (b.preissteigerungProzent !== undefined) {
    if (
      typeof b.preissteigerungProzent !== "number" ||
      !Number.isFinite(b.preissteigerungProzent) ||
      b.preissteigerungProzent < -20 ||
      b.preissteigerungProzent > 50
    ) {
      fehler.push({ feld: "preissteigerungProzent", meldung: "Muss eine Zahl zwischen -20 und 50 sein." });
    } else {
      preissteigerungProzent = b.preissteigerungProzent;
    }
  }

  let versicherungProJahr: Partial<Record<Antriebsart, number>> | undefined;
  if (b.versicherungProJahr !== undefined) {
    if (typeof b.versicherungProJahr !== "object" || b.versicherungProJahr === null) {
      fehler.push({ feld: "versicherungProJahr", meldung: "Muss ein Objekt sein." });
    } else {
      versicherungProJahr = {};
      const eingereicht = b.versicherungProJahr as Record<string, unknown>;
      for (const key of Object.keys(eingereicht)) {
        if (!ANTRIEBSARTEN.includes(key as Antriebsart)) {
          fehler.push({ feld: `versicherungProJahr.${key}`, meldung: "Unbekannte Antriebsart." });
          continue;
        }
        const wert = eingereicht[key];
        if (!istPositiveZahl(wert)) {
          fehler.push({ feld: `versicherungProJahr.${key}`, meldung: "Muss eine positive Zahl sein." });
          continue;
        }
        versicherungProJahr[key as Antriebsart] = wert;
      }
    }
  }

  let vignettenProJahr: number | undefined;
  if (b.vignettenProJahr !== undefined) {
    if (typeof b.vignettenProJahr !== "number" || !Number.isFinite(b.vignettenProJahr) || b.vignettenProJahr < 0) {
      fehler.push({ feld: "vignettenProJahr", meldung: "Muss eine Zahl >= 0 sein." });
    } else {
      vignettenProJahr = b.vignettenProJahr;
    }
  }

  let fahrzeugIds: Partial<Record<Antriebsart, string>> | undefined;
  if (b.fahrzeugIds !== undefined) {
    if (typeof b.fahrzeugIds !== "object" || b.fahrzeugIds === null) {
      fehler.push({ feld: "fahrzeugIds", meldung: "Muss ein Objekt sein." });
    } else {
      fahrzeugIds = {};
      const eingereicht = b.fahrzeugIds as Record<string, unknown>;
      const angefragteKlasse = b.klasse as Fahrzeugklasse;
      for (const key of Object.keys(eingereicht)) {
        if (!ANTRIEBSARTEN.includes(key as Antriebsart)) {
          fehler.push({ feld: `fahrzeugIds.${key}`, meldung: "Unbekannte Antriebsart." });
          continue;
        }
        const wert = eingereicht[key];
        if (typeof wert !== "string") {
          fehler.push({ feld: `fahrzeugIds.${key}`, meldung: "Muss eine Fahrzeug-ID sein." });
          continue;
        }
        const fahrzeug = findFahrzeug(wert);
        if (!fahrzeug) {
          fehler.push({ feld: `fahrzeugIds.${key}`, meldung: `Unbekannte Fahrzeug-ID "${wert}".` });
        } else if (fahrzeug.antriebsart !== key) {
          fehler.push({
            feld: `fahrzeugIds.${key}`,
            meldung: `Fahrzeug "${wert}" hat die Antriebsart "${fahrzeug.antriebsart}", nicht "${key}".`,
          });
        } else if (fahrzeug.klasse !== angefragteKlasse) {
          fehler.push({
            feld: `fahrzeugIds.${key}`,
            meldung: `Fahrzeug "${wert}" gehört zur Klasse "${fahrzeug.klasse}", nicht "${angefragteKlasse}".`,
          });
        } else {
          fahrzeugIds[key as Antriebsart] = wert;
        }
      }
    }
  }

  if (fehler.length > 0) return { fehler };

  return {
    anfrage: {
      klasse: b.klasse as Fahrzeugklasse,
      jahresKm: b.jahresKm as number,
      haltedauerJahre: b.haltedauerJahre as number,
      einkommensklasse,
      energiepreise,
      preissteigerungProzent,
      versicherungProJahr,
      vignettenProJahr,
      fahrzeugIds,
    },
  };
}
