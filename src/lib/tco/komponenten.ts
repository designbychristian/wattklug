import type { Annahmen } from "./annahmen";
import type { Antriebsart, Einkommensklasse } from "./typen";

export function berechneFoerderung(
  eingabe: {
    antriebsart: Antriebsart;
    einkommensklasse: Einkommensklasse;
    haltedauerJahre: number;
  },
  annahmen: Annahmen,
): number {
  const { mindesthaltedauerMonate, betrag } = annahmen.foerderung;
  if (eingabe.haltedauerJahre * 12 < mindesthaltedauerMonate) return 0;

  const satz = betrag[eingabe.einkommensklasse];
  if (eingabe.antriebsart === "bev") return satz.bev;
  if (eingabe.antriebsart === "hybrid") return satz.hybrid;
  return 0;
}

export function berechneAnschaffungNetto(eingabe: {
  listenpreisBrutto: number;
  foerderung: number;
}): number {
  return eingabe.listenpreisBrutto - eingabe.foerderung;
}

export function berechneEnergiekosten(eingabe: {
  verbrauchJe100Km: number;
  jahresKm: number;
  energiepreis: number;
  haltedauerJahre: number;
  preissteigerungProzent?: number;
}): number {
  const jahresverbrauch = (eingabe.verbrauchJe100Km / 100) * eingabe.jahresKm;
  const steigerung = 1 + (eingabe.preissteigerungProzent ?? 0) / 100;

  let summe = 0;
  for (let jahr = 0; jahr < eingabe.haltedauerJahre; jahr++) {
    summe += jahresverbrauch * eingabe.energiepreis * steigerung ** jahr;
  }
  return summe;
}

export function berechneRestwert(
  eingabe: {
    listenpreisBrutto: number;
    antriebsart: Antriebsart;
    haltedauerJahre: number;
  },
  annahmen: Annahmen,
): number {
  if (eingabe.haltedauerJahre <= 0) return eingabe.listenpreisBrutto;

  const kurve = annahmen.wertverlust[eingabe.antriebsart];
  return (
    eingabe.listenpreisBrutto *
    (1 - kurve.jahr1) *
    (1 - kurve.folgejahre) ** (eingabe.haltedauerJahre - 1)
  );
}

export function berechneWertverlust(
  eingabe: {
    listenpreisBrutto: number;
    antriebsart: Antriebsart;
    haltedauerJahre: number;
  },
  annahmen: Annahmen,
): number {
  return eingabe.listenpreisBrutto - berechneRestwert(eingabe, annahmen);
}

export function berechneWartungskosten(eingabe: {
  wartungProJahr: number;
  haltedauerJahre: number;
}): number {
  return eingabe.wartungProJahr * eingabe.haltedauerJahre;
}

export function berechneVersicherungskosten(eingabe: {
  versicherungProJahr: number;
  haltedauerJahre: number;
}): number {
  return eingabe.versicherungProJahr * eingabe.haltedauerJahre;
}

export function berechneKfzSteuerProJahr(
  eingabe: {
    antriebsart: Antriebsart;
    hubraumCm3: number;
    co2GProKm: number;
  },
  annahmen: Annahmen,
): number {
  const { kfzSteuer } = annahmen;
  if (kfzSteuer.befreiteAntriebe.includes(eingabe.antriebsart)) return 0;

  const satz =
    eingabe.antriebsart === "diesel"
      ? kfzSteuer.hubraumsatzJe100Cm3.diesel
      : kfzSteuer.hubraumsatzJe100Cm3.otto;
  const hubraumbetrag = Math.ceil(eingabe.hubraumCm3 / 100) * satz;

  return Math.max(
    hubraumbetrag + berechneCo2Betrag(eingabe.co2GProKm, annahmen),
    kfzSteuer.mindeststeuerProJahr,
  );
}

function berechneCo2Betrag(co2GProKm: number, annahmen: Annahmen): number {
  const { co2FreibetragGProKm, co2Stufen } = annahmen.kfzSteuer;

  let betrag = 0;
  let untergrenze = co2FreibetragGProKm;
  for (const stufe of co2Stufen) {
    if (co2GProKm <= untergrenze) break;
    betrag += (Math.min(co2GProKm, stufe.bisGProKm) - untergrenze) * stufe.satzJeG;
    untergrenze = stufe.bisGProKm;
  }
  return betrag;
}

export function berechneThgErloes(
  eingabe: { antriebsart: Antriebsart; haltedauerJahre: number },
  annahmen: Annahmen,
): number {
  if (eingabe.antriebsart !== "bev") return 0;
  return annahmen.thgErloesProJahr * eingabe.haltedauerJahre;
}

export function berechneCo2Lebenszyklus(
  eingabe: {
    antriebsart: Antriebsart;
    jahresKm: number;
    haltedauerJahre: number;
  },
  annahmen: Annahmen,
): number {
  const herstellung = annahmen.co2.herstellungKg[eingabe.antriebsart];
  const betrieb =
    (annahmen.co2.betriebGProKm[eingabe.antriebsart] *
      eingabe.jahresKm *
      eingabe.haltedauerJahre) /
    1000;
  return herstellung + betrieb;
}
