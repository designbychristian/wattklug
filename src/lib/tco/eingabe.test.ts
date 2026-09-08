import { describe, expect, it } from "vitest";

import { validiereTcoAnfrage } from "./eingabe";

const gueltig = {
  klasse: "kompaktklasse",
  jahresKm: 15000,
  haltedauerJahre: 6,
};

describe("validiereTcoAnfrage", () => {
  it("akzeptiert eine minimale gültige Anfrage mit Standard-Einkommensklasse", () => {
    const ergebnis = validiereTcoAnfrage(gueltig);
    expect("anfrage" in ergebnis).toBe(true);
    if ("anfrage" in ergebnis) {
      expect(ergebnis.anfrage.einkommensklasse).toBe("ueber80");
    }
  });

  it("lehnt einen nicht-objektartigen Body ab", () => {
    const ergebnis = validiereTcoAnfrage("keine anfrage");
    expect("fehler" in ergebnis).toBe(true);
  });

  it("lehnt eine unbekannte Fahrzeugklasse ab", () => {
    const ergebnis = validiereTcoAnfrage({ ...gueltig, klasse: "luxusklasse" });
    expect("fehler" in ergebnis).toBe(true);
    if ("fehler" in ergebnis) {
      expect(ergebnis.fehler.some((f) => f.feld === "klasse")).toBe(true);
    }
  });

  it("lehnt eine Haltedauer außerhalb von 1-15 Jahren ab", () => {
    const zuLang = validiereTcoAnfrage({ ...gueltig, haltedauerJahre: 16 });
    expect("fehler" in zuLang).toBe(true);

    const null_ = validiereTcoAnfrage({ ...gueltig, haltedauerJahre: 0 });
    expect("fehler" in null_).toBe(true);
  });

  it("lehnt negative Jahreskilometer ab", () => {
    const ergebnis = validiereTcoAnfrage({ ...gueltig, jahresKm: -100 });
    expect("fehler" in ergebnis).toBe(true);
  });

  it("übernimmt gültige Energiepreis-Übersteuerungen", () => {
    const ergebnis = validiereTcoAnfrage({ ...gueltig, energiepreise: { strom: 0.3 } });
    expect("anfrage" in ergebnis).toBe(true);
    if ("anfrage" in ergebnis) {
      expect(ergebnis.anfrage.energiepreise?.strom).toBe(0.3);
    }
  });

  it("lehnt einen unbekannten Energieträger ab", () => {
    const ergebnis = validiereTcoAnfrage({ ...gueltig, energiepreise: { kohle: 1 } });
    expect("fehler" in ergebnis).toBe(true);
  });

  it("akzeptiert eine passende Fahrzeug-ID für Antriebsart und Klasse", () => {
    const ergebnis = validiereTcoAnfrage({ ...gueltig, fahrzeugIds: { bev: "vw-id3" } });
    expect("anfrage" in ergebnis).toBe(true);
  });

  it("lehnt eine Fahrzeug-ID mit falscher Antriebsart ab", () => {
    const ergebnis = validiereTcoAnfrage({ ...gueltig, fahrzeugIds: { benzin: "vw-id3" } });
    expect("fehler" in ergebnis).toBe(true);
  });

  it("lehnt eine Fahrzeug-ID aus einer anderen Klasse ab", () => {
    const ergebnis = validiereTcoAnfrage({ ...gueltig, klasse: "kleinwagen", fahrzeugIds: { bev: "vw-id3" } });
    expect("fehler" in ergebnis).toBe(true);
  });

  it("lehnt eine unbekannte Fahrzeug-ID ab", () => {
    const ergebnis = validiereTcoAnfrage({ ...gueltig, fahrzeugIds: { bev: "does-not-exist" } });
    expect("fehler" in ergebnis).toBe(true);
  });

  it("sammelt mehrere Fehler statt beim ersten abzubrechen", () => {
    const ergebnis = validiereTcoAnfrage({ klasse: "?", jahresKm: -1, haltedauerJahre: 99 });
    expect("fehler" in ergebnis).toBe(true);
    if ("fehler" in ergebnis) {
      expect(ergebnis.fehler.length).toBeGreaterThanOrEqual(3);
    }
  });
});
