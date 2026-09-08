import { describe, expect, it } from "vitest";

import { ANNAHMEN_V0_1 as A } from "./annahmen";
import { findFahrzeug, resolveFahrzeugdaten } from "./fahrzeuge";
import { berechneBreakEven, berechneGesamtTco, berechneKumulierterVerlauf } from "./gesamt";
import type { TcoEingabe } from "./gesamt";

const id3 = resolveFahrzeugdaten(findFahrzeug("vw-id3")!);
const golf = resolveFahrzeugdaten(findFahrzeug("vw-golf")!);

const bevEingabe: TcoEingabe = {
  fahrzeugdaten: id3,
  jahresKm: 15000,
  haltedauerJahre: 6,
  einkommensklasse: "ueber80",
  energiepreis: 0.34,
};

const benzinEingabe: TcoEingabe = {
  fahrzeugdaten: golf,
  jahresKm: 15000,
  haltedauerJahre: 6,
  einkommensklasse: "ueber80",
  energiepreis: 1.79,
};

describe("berechneGesamtTco", () => {
  it("summiert alle Komponenten gemäß Pflichtenheft 4.11", () => {
    const ergebnis = berechneGesamtTco(bevEingabe, A);

    const erwartet =
      ergebnis.anschaffungNetto +
      ergebnis.energiekosten +
      ergebnis.wertverlust +
      ergebnis.wartung +
      ergebnis.versicherung +
      ergebnis.kfzSteuerGesamt +
      ergebnis.vignetten -
      ergebnis.thgErloes;

    expect(ergebnis.gesamt).toBeCloseTo(erwartet, 6);
  });

  it("zieht die Förderung ein einziges Mal über die Anschaffung ab", () => {
    const mitFoerderung = berechneGesamtTco(
      { ...bevEingabe, einkommensklasse: "bis40" },
      A,
    );
    expect(mitFoerderung.foerderung).toBe(6000);
    expect(mitFoerderung.anschaffungNetto).toBe(id3.listenpreisBrutto - 6000);
  });

  it("setzt die Kfz-Steuer für BEV auf null", () => {
    expect(berechneGesamtTco(bevEingabe, A).kfzSteuerGesamt).toBe(0);
  });

  it("berücksichtigt den THG-Erlös nur für BEV", () => {
    expect(berechneGesamtTco(bevEingabe, A).thgErloes).toBe(A.thgErloesProJahr * 6);
    expect(berechneGesamtTco(benzinEingabe, A).thgErloes).toBe(0);
  });

  it("rechnet optionale Vignettenkosten über die Haltedauer ein", () => {
    const ohne = berechneGesamtTco(bevEingabe, A);
    const mit = berechneGesamtTco({ ...bevEingabe, vignettenProJahr: 100 }, A);
    expect(mit.vignetten).toBe(600);
    expect(mit.gesamt).toBeCloseTo(ohne.gesamt + 600, 6);
  });

  it("berechnet Cent pro Kilometer aus Gesamtkosten und Gesamtfahrleistung", () => {
    const ergebnis = berechneGesamtTco(bevEingabe, A);
    expect(ergebnis.centProKm).toBeCloseTo((ergebnis.gesamt / (15000 * 6)) * 100, 6);
  });

  it("reicht die Datenlage des Fahrzeugs durch", () => {
    expect(berechneGesamtTco(bevEingabe, A).datenlage).toBe(id3.datenlage);
    expect(berechneGesamtTco(benzinEingabe, A).datenlage).toBe(golf.datenlage);
  });
});

describe("berechneKumulierterVerlauf", () => {
  it("liefert einen aufsteigenden Eintrag je Haltejahr", () => {
    const verlauf = berechneKumulierterVerlauf(bevEingabe, A);
    expect(verlauf).toHaveLength(6);
    expect(verlauf.map((v) => v.jahr)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(verlauf[5].kumuliert).toBeCloseTo(berechneGesamtTco(bevEingabe, A).gesamt, 6);
  });

  it("ist monoton steigend, weil laufende Kosten nie negativ sind", () => {
    const verlauf = berechneKumulierterVerlauf({ ...bevEingabe, haltedauerJahre: 10 }, A);
    for (let i = 1; i < verlauf.length; i++) {
      expect(verlauf[i].kumuliert).toBeGreaterThanOrEqual(verlauf[i - 1].kumuliert);
    }
  });
});

describe("berechneBreakEven", () => {
  it("findet das erste Jahr, ab dem BEV günstiger ist als der Vergleichsantrieb", () => {
    const ergebnis = berechneBreakEven(bevEingabe, benzinEingabe, A, 15);
    expect(ergebnis.jahr).not.toBeNull();
    expect(ergebnis.jahr).toBeGreaterThan(0);

    if (ergebnis.jahr !== null) {
      const bevJahr = berechneGesamtTco({ ...bevEingabe, haltedauerJahre: ergebnis.jahr }, A);
      const benzinJahr = berechneGesamtTco({ ...benzinEingabe, haltedauerJahre: ergebnis.jahr }, A);
      expect(bevJahr.gesamt).toBeLessThan(benzinJahr.gesamt);
    }
  });

  it("meldet keinen Schnittpunkt, wenn die Referenz nie günstiger wird", () => {
    // Ein BEV mit unrealistisch hohem Anschaffungspreis wird innerhalb von
    // 15 Jahren nicht günstiger als ein Benziner.
    const teuresBev: TcoEingabe = {
      ...bevEingabe,
      fahrzeugdaten: { ...id3, listenpreisBrutto: 500000 },
    };
    const ergebnis = berechneBreakEven(teuresBev, benzinEingabe, A, 15);
    expect(ergebnis.jahr).toBeNull();
    expect(ergebnis.guenstigerOhneSchnittpunkt).toBe(false);
  });
});
