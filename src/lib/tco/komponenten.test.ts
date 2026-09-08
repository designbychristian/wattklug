import { describe, expect, it } from "vitest";

import { ANNAHMEN_V0_1 as A } from "./annahmen";
import {
  berechneAnschaffungNetto,
  berechneCo2Lebenszyklus,
  berechneEnergiekosten,
  berechneFoerderung,
  berechneKfzSteuerProJahr,
  berechneRestwert,
  berechneThgErloes,
  berechneVersicherungskosten,
  berechneWartungskosten,
  berechneWertverlust,
} from "./komponenten";

describe("Förderung", () => {
  it("gewährt den Satz der Einkommensklasse für BEV", () => {
    expect(
      berechneFoerderung(
        { antriebsart: "bev", einkommensklasse: "bis40", haltedauerJahre: 3 },
        A,
      ),
    ).toBe(6000);
  });

  it("gewährt PHEV den halben Satz", () => {
    expect(
      berechneFoerderung(
        { antriebsart: "hybrid", einkommensklasse: "bis60", haltedauerJahre: 5 },
        A,
      ),
    ).toBe(2250);
  });

  it("entfällt unterhalb der Mindesthaltedauer von 36 Monaten", () => {
    expect(
      berechneFoerderung(
        { antriebsart: "bev", einkommensklasse: "bis40", haltedauerJahre: 2 },
        A,
      ),
    ).toBe(0);
  });

  it("entfällt oberhalb der Einkommensgrenze", () => {
    expect(
      berechneFoerderung(
        { antriebsart: "bev", einkommensklasse: "ueber80", haltedauerJahre: 6 },
        A,
      ),
    ).toBe(0);
  });

  it("entfällt für Verbrenner", () => {
    expect(
      berechneFoerderung(
        { antriebsart: "diesel", einkommensklasse: "bis40", haltedauerJahre: 6 },
        A,
      ),
    ).toBe(0);
  });
});

describe("Anschaffung", () => {
  it("zieht die Förderung vom Bruttolistenpreis ab", () => {
    expect(
      berechneAnschaffungNetto({ listenpreisBrutto: 40000, foerderung: 6000 }),
    ).toBe(34000);
  });
});

describe("Energiekosten", () => {
  it("rechnet Verbrauch je 100 km auf die Jahresfahrleistung hoch", () => {
    expect(
      berechneEnergiekosten({
        verbrauchJe100Km: 17.5,
        jahresKm: 15000,
        energiepreis: 0.34,
        haltedauerJahre: 1,
      }),
    ).toBeCloseTo(892.5, 2);
  });

  it("hält den Preis ohne Steigerungsannahme konstant", () => {
    expect(
      berechneEnergiekosten({
        verbrauchJe100Km: 17.5,
        jahresKm: 15000,
        energiepreis: 0.34,
        haltedauerJahre: 2,
      }),
    ).toBeCloseTo(1785, 2);
  });

  it("wendet die Preissteigerung exponentiell auf den Ausgangspreis an", () => {
    expect(
      berechneEnergiekosten({
        verbrauchJe100Km: 17.5,
        jahresKm: 15000,
        energiepreis: 0.34,
        haltedauerJahre: 2,
        preissteigerungProzent: 10,
      }),
    ).toBeCloseTo(1874.25, 2);
  });

  it("ist bei null Jahren null", () => {
    expect(
      berechneEnergiekosten({
        verbrauchJe100Km: 17.5,
        jahresKm: 15000,
        energiepreis: 0.34,
        haltedauerJahre: 0,
      }),
    ).toBe(0);
  });
});

describe("Wertverlust", () => {
  const fahrzeug = { listenpreisBrutto: 40000, antriebsart: "bev" as const };

  it("wendet im ersten Jahr die Jahr-1-Rate an", () => {
    expect(berechneRestwert({ ...fahrzeug, haltedauerJahre: 1 }, A)).toBeCloseTo(28800, 2);
    expect(berechneWertverlust({ ...fahrzeug, haltedauerJahre: 1 }, A)).toBeCloseTo(11200, 2);
  });

  it("wendet danach die Folgerate auf den jeweiligen Restwert an", () => {
    expect(berechneRestwert({ ...fahrzeug, haltedauerJahre: 3 }, A)).toBeCloseTo(21798.72, 2);
    expect(berechneWertverlust({ ...fahrzeug, haltedauerJahre: 3 }, A)).toBeCloseTo(18201.28, 2);
  });

  it("ist bei null Jahren null", () => {
    expect(berechneWertverlust({ ...fahrzeug, haltedauerJahre: 0 }, A)).toBe(0);
  });

  it("nutzt je Antriebsart eine eigene Kurve", () => {
    const benzin = berechneWertverlust(
      { listenpreisBrutto: 40000, antriebsart: "benzin", haltedauerJahre: 1 },
      A,
    );
    expect(benzin).toBeCloseTo(9600, 2);
  });
});

describe("Wartung und Versicherung", () => {
  it("summiert die Wartungspauschale über die Haltedauer", () => {
    expect(berechneWartungskosten({ wartungProJahr: 420, haltedauerJahre: 6 })).toBe(2520);
  });

  it("summiert die Versicherungsprämie über die Haltedauer", () => {
    expect(
      berechneVersicherungskosten({ versicherungProJahr: 720, haltedauerJahre: 6 }),
    ).toBe(4320);
  });
});

describe("Kfz-Steuer", () => {
  it("summiert Hubraum- und progressiven CO₂-Betrag für Benziner", () => {
    // 15 × 2,00 € Hubraum + 20 g × 2,00 € + 15 g × 2,20 €
    expect(
      berechneKfzSteuerProJahr(
        { antriebsart: "benzin", hubraumCm3: 1498, co2GProKm: 130 },
        A,
      ),
    ).toBeCloseTo(103, 2);
  });

  it("rechnet Diesel mit dem höheren Hubraumsatz", () => {
    // 20 × 9,50 € Hubraum + 40 € + 44 € + 25 € CO₂
    expect(
      berechneKfzSteuerProJahr(
        { antriebsart: "diesel", hubraumCm3: 1968, co2GProKm: 145 },
        A,
      ),
    ).toBeCloseTo(299, 2);
  });

  it("staffelt bis in die oberste CO₂-Stufe", () => {
    expect(
      berechneKfzSteuerProJahr(
        { antriebsart: "benzin", hubraumCm3: 3000, co2GProKm: 200 },
        A,
      ),
    ).toBeCloseTo(340, 2);
  });

  it("erhebt unterhalb des CO₂-Freibetrags nur den Hubraumbetrag", () => {
    expect(
      berechneKfzSteuerProJahr(
        { antriebsart: "benzin", hubraumCm3: 999, co2GProKm: 95 },
        A,
      ),
    ).toBeCloseTo(20, 2);
  });

  it("greift auf die Mindeststeuer zurück", () => {
    expect(
      berechneKfzSteuerProJahr(
        { antriebsart: "benzin", hubraumCm3: 700, co2GProKm: 90 },
        A,
      ),
    ).toBe(16);
  });

  it("befreit BEV und FCEV", () => {
    expect(
      berechneKfzSteuerProJahr({ antriebsart: "bev", hubraumCm3: 0, co2GProKm: 0 }, A),
    ).toBe(0);
    expect(
      berechneKfzSteuerProJahr({ antriebsart: "fcev", hubraumCm3: 0, co2GProKm: 0 }, A),
    ).toBe(0);
  });
});

describe("THG-Quote", () => {
  it("wird nur für BEV angesetzt", () => {
    expect(berechneThgErloes({ antriebsart: "bev", haltedauerJahre: 6 }, A)).toBe(1050);
    expect(berechneThgErloes({ antriebsart: "hybrid", haltedauerJahre: 6 }, A)).toBe(0);
    expect(berechneThgErloes({ antriebsart: "benzin", haltedauerJahre: 6 }, A)).toBe(0);
  });
});

describe("CO₂-Lebenszyklus", () => {
  it("addiert Herstellung und Betrieb über die Fahrleistung", () => {
    expect(
      berechneCo2Lebenszyklus(
        { antriebsart: "bev", jahresKm: 15000, haltedauerJahre: 6 },
        A,
      ),
    ).toBeCloseTo(15020, 2);
  });
});
