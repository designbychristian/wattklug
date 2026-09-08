const EUR = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const KM = new Intl.NumberFormat("de-DE");

export function eur(wert: number): string {
  return EUR.format(wert);
}

export function km(wert: number): string {
  return KM.format(wert);
}

export function zahl(wert: number, nachkommastellen = 1): string {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: nachkommastellen,
    maximumFractionDigits: nachkommastellen,
  }).format(wert);
}
