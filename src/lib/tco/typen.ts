export const ANTRIEBSARTEN = ["bev", "benzin", "diesel", "hybrid", "fcev"] as const;
export type Antriebsart = (typeof ANTRIEBSARTEN)[number];

export const EINKOMMENSKLASSEN = ["bis40", "bis60", "bis80", "ueber80"] as const;
export type Einkommensklasse = (typeof EINKOMMENSKLASSEN)[number];

export const FAHRZEUGKLASSEN = [
  "kleinwagen",
  "kleinSuv",
  "kompaktklasse",
  "kompaktSuv",
  "mittelklasse",
  "mittelklasseSuv",
] as const;
export type Fahrzeugklasse = (typeof FAHRZEUGKLASSEN)[number];

// gut: alle Felder aus der Modelldatenbank · teilweise: Mischung aus
// Modell- und Klassenschätzwerten · duenn: vollständig klassengeschätzt
// (z. B. FCEV, für das im Konzern kein Serienmodell existiert).
export type Datenlage = "gut" | "teilweise" | "duenn";

export type FahrzeugdatenFeld =
  | "listenpreisBrutto"
  | "verbrauchJe100Km"
  | "co2GProKm"
  | "hubraumCm3"
  | "batterieKwh"
  | "wartungProJahr";

export type FahrzeugdatenHerkunft = Record<
  FahrzeugdatenFeld,
  "modell" | "klassenschaetzung"
>;

export type Fahrzeugdaten = {
  antriebsart: Antriebsart;
  listenpreisBrutto: number;
  verbrauchJe100Km: number;
  co2GProKm: number;
  hubraumCm3: number;
  batterieKwh: number | null;
  wartungProJahr: number;
  datenlage: Datenlage;
  herkunft: FahrzeugdatenHerkunft;
};
