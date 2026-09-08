import type { Antriebsart, Fahrzeugklasse } from "./typen";

export type Klassenwert = {
  listenpreisBrutto: number;
  verbrauchJe100Km: number;
  co2GProKm: number;
  hubraumCm3: number;
  batterieKwh: number | null;
  wartungProJahr: number;
};

// Redaktionelle Platzhalter für Fahrzeuge/Klassen ohne recherchierte
// Modelldaten (siehe fahrzeuge.csv, Status-Spalte). Kein Herstellerwert.
//
// Hersteller-Primärquellen (volkswagen.de, cupraofficial.de) waren beim
// Anlegen dieser Tabelle über den Netzwerk-Egress dieser Umgebung nicht
// erreichbar; verlässliche Sekundärquellen für exakte UVP/WLTP-Werte je
// Modell standen nicht zur Verfügung. Deshalb: Klassenwerte statt
// erfundener Modellwerte, klar gekennzeichnet, vor Livegang durch
// recherchierte Herstellerangaben zu ersetzen.
//
// Methodik in TCO_calculator/parameter/klassenwerte.csv dokumentiert:
// Kompaktklasse-Referenzwerte aus tco-rechner-prototyp.jsx (dort als
// Beispieldaten deklariert), je Klasse mit einem Preis- und einem
// Verbrauchsfaktor skaliert. CO2 WLTP rechnerisch aus dem Verbrauch mit
// Standard-Emissionsfaktoren abgeleitet (Benzin 2,33 kg/l, Diesel
// 2,65 kg/l), keine offizielle Herstellerangabe.
export const KLASSENWERTE_V0_1: Record<
  Antriebsart,
  Record<Fahrzeugklasse, Klassenwert>
> = {
  bev: {
    kleinwagen: { listenpreisBrutto: 30240, verbrauchJe100Km: 14.9, co2GProKm: 0, hubraumCm3: 0, batterieKwh: 49, wartungProJahr: 302 },
    kleinSuv: { listenpreisBrutto: 35700, verbrauchJe100Km: 16.1, co2GProKm: 0, hubraumCm3: 0, batterieKwh: 53, wartungProJahr: 357 },
    kompaktklasse: { listenpreisBrutto: 42000, verbrauchJe100Km: 17.5, co2GProKm: 0, hubraumCm3: 0, batterieKwh: 58, wartungProJahr: 420 },
    kompaktSuv: { listenpreisBrutto: 46200, verbrauchJe100Km: 18.6, co2GProKm: 0, hubraumCm3: 0, batterieKwh: 61, wartungProJahr: 462 },
    mittelklasse: { listenpreisBrutto: 53760, verbrauchJe100Km: 20.1, co2GProKm: 0, hubraumCm3: 0, batterieKwh: 67, wartungProJahr: 538 },
    mittelklasseSuv: { listenpreisBrutto: 57960, verbrauchJe100Km: 21.4, co2GProKm: 0, hubraumCm3: 0, batterieKwh: 71, wartungProJahr: 580 },
  },
  benzin: {
    kleinwagen: { listenpreisBrutto: 24840, verbrauchJe100Km: 5.8, co2GProKm: 135, hubraumCm3: 999, batterieKwh: null, wartungProJahr: 490 },
    kleinSuv: { listenpreisBrutto: 29325, verbrauchJe100Km: 6.3, co2GProKm: 147, hubraumCm3: 999, batterieKwh: null, wartungProJahr: 578 },
    kompaktklasse: { listenpreisBrutto: 34500, verbrauchJe100Km: 6.8, co2GProKm: 158, hubraumCm3: 1498, batterieKwh: null, wartungProJahr: 680 },
    kompaktSuv: { listenpreisBrutto: 37950, verbrauchJe100Km: 7.2, co2GProKm: 168, hubraumCm3: 1498, batterieKwh: null, wartungProJahr: 748 },
    mittelklasse: { listenpreisBrutto: 44160, verbrauchJe100Km: 7.8, co2GProKm: 182, hubraumCm3: 1498, batterieKwh: null, wartungProJahr: 870 },
    mittelklasseSuv: { listenpreisBrutto: 47610, verbrauchJe100Km: 8.3, co2GProKm: 193, hubraumCm3: 1498, batterieKwh: null, wartungProJahr: 938 },
  },
  diesel: {
    kleinwagen: { listenpreisBrutto: 26784, verbrauchJe100Km: 4.6, co2GProKm: 122, hubraumCm3: 1968, batterieKwh: null, wartungProJahr: 533 },
    kleinSuv: { listenpreisBrutto: 31620, verbrauchJe100Km: 5.0, co2GProKm: 132, hubraumCm3: 1968, batterieKwh: null, wartungProJahr: 629 },
    kompaktklasse: { listenpreisBrutto: 37200, verbrauchJe100Km: 5.4, co2GProKm: 143, hubraumCm3: 1968, batterieKwh: null, wartungProJahr: 740 },
    kompaktSuv: { listenpreisBrutto: 40920, verbrauchJe100Km: 5.7, co2GProKm: 151, hubraumCm3: 1968, batterieKwh: null, wartungProJahr: 814 },
    mittelklasse: { listenpreisBrutto: 47616, verbrauchJe100Km: 6.2, co2GProKm: 164, hubraumCm3: 1968, batterieKwh: null, wartungProJahr: 947 },
    mittelklasseSuv: { listenpreisBrutto: 51336, verbrauchJe100Km: 6.6, co2GProKm: 175, hubraumCm3: 1968, batterieKwh: null, wartungProJahr: 1021 },
  },
  hybrid: {
    kleinwagen: { listenpreisBrutto: 30096, verbrauchJe100Km: 3.6, co2GProKm: 84, hubraumCm3: 1498, batterieKwh: null, wartungProJahr: 547 },
    kleinSuv: { listenpreisBrutto: 35530, verbrauchJe100Km: 3.9, co2GProKm: 91, hubraumCm3: 1498, batterieKwh: null, wartungProJahr: 646 },
    kompaktklasse: { listenpreisBrutto: 41800, verbrauchJe100Km: 4.2, co2GProKm: 98, hubraumCm3: 1498, batterieKwh: null, wartungProJahr: 760 },
    kompaktSuv: { listenpreisBrutto: 45980, verbrauchJe100Km: 4.5, co2GProKm: 105, hubraumCm3: 1498, batterieKwh: null, wartungProJahr: 836 },
    mittelklasse: { listenpreisBrutto: 53504, verbrauchJe100Km: 4.8, co2GProKm: 112, hubraumCm3: 1498, batterieKwh: null, wartungProJahr: 973 },
    mittelklasseSuv: { listenpreisBrutto: 57684, verbrauchJe100Km: 5.1, co2GProKm: 119, hubraumCm3: 1498, batterieKwh: null, wartungProJahr: 1049 },
  },
  // Klassenunabhängiger Richtwert: für FCEV existiert im VW-Konzern kein
  // Serienmodell, eine Klassenstaffelung wäre nicht durch reale Fahrzeuge
  // gedeckt (Pflichtenheft 3.1, CLAUDE.md).
  fcev: {
    kleinwagen: { listenpreisBrutto: 68000, verbrauchJe100Km: 0.95, co2GProKm: 0, hubraumCm3: 0, batterieKwh: null, wartungProJahr: 690 },
    kleinSuv: { listenpreisBrutto: 68000, verbrauchJe100Km: 0.95, co2GProKm: 0, hubraumCm3: 0, batterieKwh: null, wartungProJahr: 690 },
    kompaktklasse: { listenpreisBrutto: 68000, verbrauchJe100Km: 0.95, co2GProKm: 0, hubraumCm3: 0, batterieKwh: null, wartungProJahr: 690 },
    kompaktSuv: { listenpreisBrutto: 68000, verbrauchJe100Km: 0.95, co2GProKm: 0, hubraumCm3: 0, batterieKwh: null, wartungProJahr: 690 },
    mittelklasse: { listenpreisBrutto: 68000, verbrauchJe100Km: 0.95, co2GProKm: 0, hubraumCm3: 0, batterieKwh: null, wartungProJahr: 690 },
    mittelklasseSuv: { listenpreisBrutto: 68000, verbrauchJe100Km: 0.95, co2GProKm: 0, hubraumCm3: 0, batterieKwh: null, wartungProJahr: 690 },
  },
};
