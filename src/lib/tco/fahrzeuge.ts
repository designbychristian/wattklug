import { KLASSENWERTE_V0_1 } from "./klassenwerte";
import type {
  Antriebsart,
  Datenlage,
  Fahrzeugdaten,
  FahrzeugdatenFeld,
  FahrzeugdatenHerkunft,
  Fahrzeugklasse,
} from "./typen";

// Modellstammdaten. Quelle: TCO_calculator/parameter/fahrzeuge.csv (redaktioneller
// Arbeitsstand). Nur recherchierte, belegte Werte stehen hier — leere Felder sind
// bewusst leer und werden von resolveFahrzeugdaten() über die Klassenwerte
// (klassenwerte.ts) aufgefüllt, niemals mit erfundenen Zahlen ersetzt.
export type Fahrzeug = {
  id: string;
  marke: string;
  modell: string;
  variante: string;
  antriebsart: Antriebsart;
  klasse: Fahrzeugklasse;
  listenpreisBrutto: number | null;
  verbrauchJe100Km: number | null;
  co2GProKm: number | null;
  hubraumCm3: number | null;
  batterieKwh: number | null;
  wartungProJahr: number | null;
  quelle: string | null;
  abrufdatum: string | null;
};

export const FAHRZEUGE: Fahrzeug[] = [
  {
    id: "vw-golf", marke: "VW", modell: "Golf", variante: "1.5 eTSI 116 PS DSG",
    antriebsart: "benzin", klasse: "kompaktklasse",
    listenpreisBrutto: null, verbrauchJe100Km: null, co2GProKm: null,
    hubraumCm3: null, batterieKwh: null, wartungProJahr: null,
    quelle: null, abrufdatum: null,
  },
  {
    id: "vw-troc", marke: "VW", modell: "T-Roc", variante: "1.5 eTSI 150 PS DSG",
    antriebsart: "benzin", klasse: "kompaktSuv",
    listenpreisBrutto: null, verbrauchJe100Km: null, co2GProKm: null,
    hubraumCm3: null, batterieKwh: null, wartungProJahr: null,
    quelle: null, abrufdatum: null,
  },
  {
    id: "vw-tiguan", marke: "VW", modell: "Tiguan", variante: "2.0 TDI 150 PS DSG",
    antriebsart: "diesel", klasse: "kompaktSuv",
    listenpreisBrutto: null, verbrauchJe100Km: null, co2GProKm: null,
    hubraumCm3: null, batterieKwh: null, wartungProJahr: null,
    quelle: null, abrufdatum: null,
  },
  {
    id: "vw-tayron", marke: "VW", modell: "Tayron", variante: "1.5 eTSI 150 PS DSG",
    antriebsart: "benzin", klasse: "mittelklasseSuv",
    listenpreisBrutto: null, verbrauchJe100Km: null, co2GProKm: null,
    hubraumCm3: null, batterieKwh: null, wartungProJahr: null,
    quelle: null, abrufdatum: null,
  },
  {
    id: "vw-passat", marke: "VW", modell: "Passat Variant", variante: "2.0 TDI 150 PS DSG",
    antriebsart: "diesel", klasse: "mittelklasse",
    listenpreisBrutto: null, verbrauchJe100Km: null, co2GProKm: null,
    hubraumCm3: null, batterieKwh: null, wartungProJahr: null,
    quelle: null, abrufdatum: null,
  },
  {
    id: "vw-polo", marke: "VW", modell: "Polo", variante: "1.0 TSI 95 PS",
    antriebsart: "benzin", klasse: "kleinwagen",
    listenpreisBrutto: null, verbrauchJe100Km: null, co2GProKm: null,
    hubraumCm3: null, batterieKwh: null, wartungProJahr: null,
    quelle: null, abrufdatum: null,
  },
  {
    id: "vw-tcross", marke: "VW", modell: "T-Cross", variante: "1.0 TSI 115 PS",
    antriebsart: "benzin", klasse: "kleinSuv",
    listenpreisBrutto: null, verbrauchJe100Km: null, co2GProKm: null,
    hubraumCm3: null, batterieKwh: null, wartungProJahr: null,
    quelle: null, abrufdatum: null,
  },
  {
    id: "vw-taigo", marke: "VW", modell: "Taigo", variante: "1.0 TSI 95 PS",
    antriebsart: "benzin", klasse: "kleinSuv",
    listenpreisBrutto: null, verbrauchJe100Km: null, co2GProKm: null,
    hubraumCm3: null, batterieKwh: null, wartungProJahr: null,
    quelle: null, abrufdatum: null,
  },
  {
    id: "vw-id3", marke: "VW", modell: "ID.3 Neo", variante: "Pro 58 kWh, 140 kW",
    antriebsart: "bev", klasse: "kompaktklasse",
    listenpreisBrutto: 33995, verbrauchJe100Km: null, co2GProKm: 0,
    hubraumCm3: 0, batterieKwh: 58, wartungProJahr: null,
    quelle: "Listenpreis, Batteriegrößen und Leistungsstufen: InsideEVs, VW ID.3 Neo Daten und Preise, 16.04.2026; bestätigt durch InsideEVs Marktübersicht Elektro-Kompaktwagen, 25.03.2026",
    abrufdatum: "06.09.2026",
  },
  {
    id: "vw-id4", marke: "VW", modell: "ID.4", variante: "Pro 77 kWh",
    antriebsart: "bev", klasse: "kompaktSuv",
    listenpreisBrutto: null, verbrauchJe100Km: null, co2GProKm: 0,
    hubraumCm3: 0, batterieKwh: 77, wartungProJahr: null,
    quelle: "Batteriekapazität netto laut Wikipedia (Volkswagen ID.4), Bandbreite 52-77 kWh nutzbar; UVP noch offen",
    abrufdatum: "06.09.2026",
  },
  {
    id: "vw-id7", marke: "VW", modell: "ID.7", variante: "Pro 77 kWh",
    antriebsart: "bev", klasse: "mittelklasse",
    listenpreisBrutto: null, verbrauchJe100Km: null, co2GProKm: null,
    hubraumCm3: null, batterieKwh: null, wartungProJahr: null,
    quelle: null, abrufdatum: null,
  },
  {
    id: "cupra-born", marke: "Cupra", modell: "Born", variante: "58 kWh, 150 kW",
    antriebsart: "bev", klasse: "kompaktklasse",
    listenpreisBrutto: null, verbrauchJe100Km: null, co2GProKm: null,
    hubraumCm3: null, batterieKwh: null, wartungProJahr: null,
    quelle: "Batteriebandbreite 45-77 kWh laut Wikipedia (Cupra Born); Variante und UVP noch zu bestätigen",
    abrufdatum: "06.09.2026",
  },
  {
    id: "cupra-formentor", marke: "Cupra", modell: "Formentor", variante: "1.5 e-Hybrid 204 PS DSG",
    antriebsart: "hybrid", klasse: "kompaktSuv",
    listenpreisBrutto: null, verbrauchJe100Km: null, co2GProKm: null,
    hubraumCm3: 1498, batterieKwh: null, wartungProJahr: null,
    quelle: "Motorisierung 1.5 TSI PHEV laut Wikipedia (Cupra Terramar, baugleicher Antrieb im Konzern); Werte modellspezifisch noch zu prüfen",
    abrufdatum: "06.09.2026",
  },
];

export function findFahrzeug(id: string): Fahrzeug | undefined {
  return FAHRZEUGE.find((f) => f.id === id);
}

export function fahrzeugeFuerKlasse(klasse: Fahrzeugklasse): Fahrzeug[] {
  return FAHRZEUGE.filter((f) => f.klasse === klasse);
}

function datenlageAus(herkunft: FahrzeugdatenHerkunft): Datenlage {
  const werte = Object.values(herkunft);
  if (werte.every((h) => h === "modell")) return "gut";
  if (werte.every((h) => h === "klassenschaetzung")) return "duenn";
  return "teilweise";
}

// Führt Modelldaten und Klassenwerte je Feld zusammen: recherchierte
// Modellwerte haben Vorrang, fehlende Felder werden aus der Klassenwerte-
// Tabelle für Antriebsart × Fahrzeugklasse aufgefüllt (Pflichtenheft 3.4).
export function resolveFahrzeugdaten(fahrzeug: Fahrzeug): Fahrzeugdaten {
  const klassenwert = KLASSENWERTE_V0_1[fahrzeug.antriebsart][fahrzeug.klasse];

  const herkunft = {} as FahrzeugdatenHerkunft;
  const uebernehmen = <K extends FahrzeugdatenFeld>(
    feldname: K,
    modellwert: number | null,
    klassenwertWert: number | null,
  ): number => {
    if (modellwert !== null) {
      herkunft[feldname] = "modell";
      return modellwert;
    }
    herkunft[feldname] = "klassenschaetzung";
    return klassenwertWert ?? 0;
  };

  const listenpreisBrutto = uebernehmen("listenpreisBrutto", fahrzeug.listenpreisBrutto, klassenwert.listenpreisBrutto);
  const verbrauchJe100Km = uebernehmen("verbrauchJe100Km", fahrzeug.verbrauchJe100Km, klassenwert.verbrauchJe100Km);
  const co2GProKm = uebernehmen("co2GProKm", fahrzeug.co2GProKm, klassenwert.co2GProKm);
  const hubraumCm3 = uebernehmen("hubraumCm3", fahrzeug.hubraumCm3, klassenwert.hubraumCm3);
  const wartungProJahr = uebernehmen("wartungProJahr", fahrzeug.wartungProJahr, klassenwert.wartungProJahr);

  let batterieKwh: number | null;
  if (fahrzeug.batterieKwh !== null) {
    herkunft.batterieKwh = "modell";
    batterieKwh = fahrzeug.batterieKwh;
  } else {
    herkunft.batterieKwh = "klassenschaetzung";
    batterieKwh = klassenwert.batterieKwh;
  }

  return {
    antriebsart: fahrzeug.antriebsart,
    listenpreisBrutto,
    verbrauchJe100Km,
    co2GProKm,
    hubraumCm3,
    batterieKwh,
    wartungProJahr,
    herkunft,
    datenlage: datenlageAus(herkunft),
  };
}

// Reine Klassenschätzung ohne Modellbezug — für Stufe 1 des Eingabeflusses
// (Pflichtenheft 3.3), wenn nur eine Fahrzeugklasse statt eines konkreten
// Modells gewählt wurde.
export function fahrzeugdatenFuerKlasse(
  antriebsart: Antriebsart,
  klasse: Fahrzeugklasse,
): Fahrzeugdaten {
  const klassenwert = KLASSENWERTE_V0_1[antriebsart][klasse];
  const herkunft: FahrzeugdatenHerkunft = {
    listenpreisBrutto: "klassenschaetzung",
    verbrauchJe100Km: "klassenschaetzung",
    co2GProKm: "klassenschaetzung",
    hubraumCm3: "klassenschaetzung",
    batterieKwh: "klassenschaetzung",
    wartungProJahr: "klassenschaetzung",
  };
  return {
    antriebsart,
    listenpreisBrutto: klassenwert.listenpreisBrutto,
    verbrauchJe100Km: klassenwert.verbrauchJe100Km,
    co2GProKm: klassenwert.co2GProKm,
    hubraumCm3: klassenwert.hubraumCm3,
    batterieKwh: klassenwert.batterieKwh,
    wartungProJahr: klassenwert.wartungProJahr,
    herkunft,
    datenlage: "duenn",
  };
}
