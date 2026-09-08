export type Antriebsart = "bev" | "benzin" | "diesel" | "hybrid" | "fcev";

export type Einkommensklasse = "bis40" | "bis60" | "bis80" | "ueber80";

export type Datenlage = "gut" | "duenn";

export type Fahrzeugdaten = {
  antriebsart: Antriebsart;
  listenpreisBrutto: number;
  verbrauchJe100Km: number;
  co2GProKm: number;
  hubraumCm3: number;
  wartungProJahr: number;
  versicherungProJahr: number;
  datenlage: Datenlage;
};
