import type { Annahmen } from "./annahmen";
import {
  berechneAnschaffungNetto,
  berechneCo2Lebenszyklus,
  berechneEnergiekosten,
  berechneFoerderung,
  berechneKfzSteuerProJahr,
  berechneThgErloes,
  berechneVersicherungskosten,
  berechneWartungskosten,
  berechneWertverlust,
} from "./komponenten";
import type { Datenlage, Einkommensklasse, Fahrzeugdaten } from "./typen";

export type TcoEingabe = {
  fahrzeugdaten: Fahrzeugdaten;
  jahresKm: number;
  haltedauerJahre: number;
  einkommensklasse: Einkommensklasse;
  energiepreis: number;
  preissteigerungProzent?: number;
  vignettenProJahr?: number;
};

export type TcoErgebnis = {
  antriebsart: Fahrzeugdaten["antriebsart"];
  foerderung: number;
  anschaffungNetto: number;
  energiekosten: number;
  wertverlust: number;
  wartung: number;
  versicherung: number;
  kfzSteuerGesamt: number;
  thgErloes: number;
  vignetten: number;
  gesamt: number;
  centProKm: number;
  co2LebenszyklusKg: number;
  datenlage: Datenlage;
};

// Fasst alle Kostenkomponenten zur Gesamt-TCO zusammen (Pflichtenheft 4.11):
//
//   TCO = Anschaffung(netto) + Energiekosten + Wertverlust + Wartung
//       + Versicherung + Kfz-Steuer + Vignetten (optional) − THG-Erlös
//
export function berechneGesamtTco(eingabe: TcoEingabe, annahmen: Annahmen): TcoErgebnis {
  const { fahrzeugdaten, jahresKm, haltedauerJahre, einkommensklasse, energiepreis, preissteigerungProzent, vignettenProJahr } = eingabe;
  const { antriebsart } = fahrzeugdaten;

  const foerderung = berechneFoerderung({ antriebsart, einkommensklasse, haltedauerJahre }, annahmen);
  const anschaffungNetto = berechneAnschaffungNetto({
    listenpreisBrutto: fahrzeugdaten.listenpreisBrutto,
    foerderung,
  });
  const energiekosten = berechneEnergiekosten({
    verbrauchJe100Km: fahrzeugdaten.verbrauchJe100Km,
    jahresKm,
    energiepreis,
    haltedauerJahre,
    preissteigerungProzent,
  });
  const wertverlust = berechneWertverlust(
    { listenpreisBrutto: fahrzeugdaten.listenpreisBrutto, antriebsart, haltedauerJahre },
    annahmen,
  );
  const wartung = berechneWartungskosten({
    wartungProJahr: fahrzeugdaten.wartungProJahr,
    haltedauerJahre,
  });
  const versicherung = berechneVersicherungskosten({
    versicherungProJahr: annahmen.versicherungProJahr[antriebsart],
    haltedauerJahre,
  });
  const kfzSteuerGesamt =
    berechneKfzSteuerProJahr(
      { antriebsart, hubraumCm3: fahrzeugdaten.hubraumCm3, co2GProKm: fahrzeugdaten.co2GProKm },
      annahmen,
    ) * haltedauerJahre;
  const thgErloes = berechneThgErloes({ antriebsart, haltedauerJahre }, annahmen);
  const vignetten = (vignettenProJahr ?? 0) * haltedauerJahre;

  const gesamt =
    anschaffungNetto + energiekosten + wertverlust + wartung + versicherung + kfzSteuerGesamt + vignetten - thgErloes;

  const gefahreneKm = jahresKm * haltedauerJahre;
  const centProKm = gefahreneKm > 0 ? (gesamt / gefahreneKm) * 100 : 0;

  const co2LebenszyklusKg = berechneCo2Lebenszyklus({ antriebsart, jahresKm, haltedauerJahre }, annahmen);

  return {
    antriebsart,
    foerderung,
    anschaffungNetto,
    energiekosten,
    wertverlust,
    wartung,
    versicherung,
    kfzSteuerGesamt,
    thgErloes,
    vignetten,
    gesamt,
    centProKm,
    co2LebenszyklusKg,
    datenlage: fahrzeugdaten.datenlage,
  };
}

// Jährlicher kumulierter Kostenverlauf (Pflichtenheft 5.3), Grundlage der
// Break-even-Berechnung.
export function berechneKumulierterVerlauf(
  eingabe: TcoEingabe,
  annahmen: Annahmen,
): { jahr: number; kumuliert: number }[] {
  const verlauf: { jahr: number; kumuliert: number }[] = [];
  for (let jahr = 1; jahr <= eingabe.haltedauerJahre; jahr++) {
    const ergebnis = berechneGesamtTco({ ...eingabe, haltedauerJahre: jahr }, annahmen);
    verlauf.push({ jahr, kumuliert: ergebnis.gesamt });
  }
  return verlauf;
}

export type BreakEvenErgebnis = {
  // Erstes Jahr, ab dem die Referenz (typischerweise BEV) kumuliert günstiger
  // ist als der Vergleichsantrieb. null, wenn das innerhalb von maxJahre nicht eintritt.
  jahr: number | null;
  // Wenn jahr === null: ist die Referenz am Ende des Betrachtungszeitraums
  // trotzdem günstiger (nur ohne Schnittpunkt innerhalb von maxJahre)?
  guenstigerOhneSchnittpunkt: boolean;
};

// Break-even paarweise: ab welchem Jahr ist referenzEingabe kumuliert
// günstiger als vergleichEingabe? (Pflichtenheft 5.4, im UI z. B. Referenz = BEV)
export function berechneBreakEven(
  referenzEingabe: TcoEingabe,
  vergleichEingabe: TcoEingabe,
  annahmen: Annahmen,
  maxJahre = 15,
): BreakEvenErgebnis {
  for (let jahr = 1; jahr <= maxJahre; jahr++) {
    const referenz = berechneGesamtTco({ ...referenzEingabe, haltedauerJahre: jahr }, annahmen);
    const vergleich = berechneGesamtTco({ ...vergleichEingabe, haltedauerJahre: jahr }, annahmen);
    if (referenz.gesamt < vergleich.gesamt) {
      return { jahr, guenstigerOhneSchnittpunkt: false };
    }
  }
  const referenzAmEnde = berechneGesamtTco({ ...referenzEingabe, haltedauerJahre: maxJahre }, annahmen);
  const vergleichAmEnde = berechneGesamtTco({ ...vergleichEingabe, haltedauerJahre: maxJahre }, annahmen);
  return { jahr: null, guenstigerOhneSchnittpunkt: referenzAmEnde.gesamt < vergleichAmEnde.gesamt };
}
