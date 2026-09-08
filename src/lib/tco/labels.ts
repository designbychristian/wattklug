import type { Antriebsart, Datenlage, Einkommensklasse, Fahrzeugklasse } from "./typen";

export const ANTRIEBSART_LABEL: Record<Antriebsart, string> = {
  bev: "Elektro",
  benzin: "Benzin",
  diesel: "Diesel",
  hybrid: "Plug-in-Hybrid",
  fcev: "Brennstoffzelle",
};

export const ANTRIEBSART_KURZ: Record<Antriebsart, string> = {
  bev: "BEV",
  benzin: "Benzin",
  diesel: "Diesel",
  hybrid: "PHEV",
  fcev: "FCEV",
};

export const VERBRAUCH_EINHEIT: Record<Antriebsart, string> = {
  bev: "kWh/100 km",
  benzin: "l/100 km",
  diesel: "l/100 km",
  hybrid: "l/100 km",
  fcev: "kg H₂/100 km",
};

export const FAHRZEUGKLASSE_LABEL: Record<Fahrzeugklasse, string> = {
  kleinwagen: "Kleinwagen",
  kleinSuv: "Klein-SUV",
  kompaktklasse: "Kompaktklasse",
  kompaktSuv: "Kompakt-SUV",
  mittelklasse: "Mittelklasse",
  mittelklasseSuv: "Mittelklasse-SUV",
};

export const EINKOMMENSKLASSE_LABEL: Record<Einkommensklasse, string> = {
  bis40: "bis 40.000 € zvE",
  bis60: "40.000 – 60.000 € zvE",
  bis80: "60.000 – 80.000 € zvE",
  ueber80: "über 80.000 € zvE",
};

export const DATENLAGE_LABEL: Record<Datenlage, string> = {
  gut: "Modelldaten",
  teilweise: "teils geschätzt",
  duenn: "Klassenschätzung",
};
