import { describe, expect, it } from "vitest";

import {
  fahrzeugdatenFuerKlasse,
  fahrzeugeFuerKlasse,
  findFahrzeug,
  resolveFahrzeugdaten,
} from "./fahrzeuge";
import { KLASSENWERTE_V0_1 } from "./klassenwerte";

describe("resolveFahrzeugdaten", () => {
  it("übernimmt recherchierte Modellwerte unverändert", () => {
    const id3 = findFahrzeug("vw-id3")!;
    const daten = resolveFahrzeugdaten(id3);

    expect(daten.listenpreisBrutto).toBe(33995);
    expect(daten.batterieKwh).toBe(58);
    expect(daten.co2GProKm).toBe(0);
    expect(daten.herkunft.listenpreisBrutto).toBe("modell");
    expect(daten.herkunft.batterieKwh).toBe("modell");
  });

  it("füllt fehlende Felder aus den Klassenwerten der passenden Antriebsart/Klasse", () => {
    const id3 = findFahrzeug("vw-id3")!;
    const daten = resolveFahrzeugdaten(id3);
    const klassenwert = KLASSENWERTE_V0_1.bev.kompaktklasse;

    expect(daten.wartungProJahr).toBe(klassenwert.wartungProJahr);
    expect(daten.herkunft.wartungProJahr).toBe("klassenschaetzung");
  });

  it("markiert ein vollständig unrecherchiertes Modell als 'teilweise' nur wenn ein Feld modellbasiert ist", () => {
    const formentor = findFahrzeug("cupra-formentor")!;
    const daten = resolveFahrzeugdaten(formentor);

    expect(daten.herkunft.hubraumCm3).toBe("modell");
    expect(daten.herkunft.listenpreisBrutto).toBe("klassenschaetzung");
    expect(daten.datenlage).toBe("teilweise");
  });

  it("markiert ein Modell ohne jeden recherchierten Wert als 'duenn'", () => {
    const golf = findFahrzeug("vw-golf")!;
    const daten = resolveFahrzeugdaten(golf);

    expect(daten.datenlage).toBe("duenn");
    expect(daten.listenpreisBrutto).toBe(KLASSENWERTE_V0_1.benzin.kompaktklasse.listenpreisBrutto);
  });
});

describe("fahrzeugdatenFuerKlasse", () => {
  it("liefert reine Klassenschätzung ohne Modellbezug", () => {
    const daten = fahrzeugdatenFuerKlasse("diesel", "mittelklasse");

    expect(daten.datenlage).toBe("duenn");
    expect(Object.values(daten.herkunft).every((h) => h === "klassenschaetzung")).toBe(true);
    expect(daten.listenpreisBrutto).toBe(KLASSENWERTE_V0_1.diesel.mittelklasse.listenpreisBrutto);
  });

  it("gibt für FCEV denselben klassenunabhängigen Richtwert unabhängig von der Klasse zurück", () => {
    const klein = fahrzeugdatenFuerKlasse("fcev", "kleinwagen");
    const mittel = fahrzeugdatenFuerKlasse("fcev", "mittelklasseSuv");

    expect(klein.listenpreisBrutto).toBe(mittel.listenpreisBrutto);
    expect(klein.verbrauchJe100Km).toBe(mittel.verbrauchJe100Km);
  });
});

describe("Fahrzeugdatenbank", () => {
  it("findet ein Fahrzeug über seine ID", () => {
    expect(findFahrzeug("vw-tiguan")?.modell).toBe("Tiguan");
    expect(findFahrzeug("unbekannt")).toBeUndefined();
  });

  it("filtert Fahrzeuge nach Klasse", () => {
    const kompaktSuv = fahrzeugeFuerKlasse("kompaktSuv");
    expect(kompaktSuv.map((f) => f.id).sort()).toEqual(
      ["cupra-formentor", "vw-id4", "vw-tiguan", "vw-troc"].sort(),
    );
  });
});
