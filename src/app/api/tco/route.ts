import { NextResponse } from "next/server";

import { ANNAHMEN_V0_1 } from "@/lib/tco/annahmen";
import type { TcoAntwort, TcoErgebnisZeile } from "@/lib/tco/api-typen";
import { validiereTcoAnfrage, type TcoAnfrage } from "@/lib/tco/eingabe";
import { ENERGIEPREISE_CACHE_V0_1, energiepreisFuer } from "@/lib/tco/energiepreise";
import { fahrzeugdatenFuerKlasse, FAHRZEUGE, resolveFahrzeugdaten, type Fahrzeug } from "@/lib/tco/fahrzeuge";
import { berechneBreakEven, berechneGesamtTco, berechneKumulierterVerlauf, type TcoEingabe } from "@/lib/tco/gesamt";
import { ANTRIEBSARTEN, type Antriebsart, type Fahrzeugdaten } from "@/lib/tco/typen";

// Berechnung serverseitig als API-Route (Pflichtenheft 9.2): jede
// Eingabeänderung im Client löst einen neuen POST hierher aus, der
// Berechnungsstand (Version der Annahmen) wird mit jedem Ergebnis
// mitgegeben (Pflichtenheft 9.6).
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ fehler: [{ feld: "body", meldung: "Kein gültiges JSON." }] }, { status: 400 });
  }

  const validiert = validiereTcoAnfrage(body);
  if ("fehler" in validiert) {
    return NextResponse.json({ fehler: validiert.fehler }, { status: 400 });
  }
  const anfrage = validiert.anfrage;

  const annahmen =
    anfrage.versicherungProJahr && Object.keys(anfrage.versicherungProJahr).length > 0
      ? {
          ...ANNAHMEN_V0_1,
          versicherungProJahr: { ...ANNAHMEN_V0_1.versicherungProJahr, ...anfrage.versicherungProJahr },
        }
      : ANNAHMEN_V0_1;

  const energiepreisCache = anfrage.energiepreise
    ? { ...ENERGIEPREISE_CACHE_V0_1, ...anfrage.energiepreise }
    : ENERGIEPREISE_CACHE_V0_1;

  const eingaben = new Map<Antriebsart, { fahrzeug: Fahrzeug | null; eingabe: TcoEingabe }>();
  for (const antriebsart of ANTRIEBSARTEN) {
    const { fahrzeug, daten } = fahrzeugdatenFuer(antriebsart, anfrage);
    const eingabe: TcoEingabe = {
      fahrzeugdaten: daten,
      jahresKm: anfrage.jahresKm,
      haltedauerJahre: anfrage.haltedauerJahre,
      einkommensklasse: anfrage.einkommensklasse,
      energiepreis: energiepreisFuer(antriebsart, energiepreisCache),
      preissteigerungProzent: anfrage.preissteigerungProzent,
      vignettenProJahr: anfrage.vignettenProJahr,
    };
    eingaben.set(antriebsart, { fahrzeug, eingabe });
  }

  const bevEingabe = eingaben.get("bev")!.eingabe;

  const ergebnisse: TcoErgebnisZeile[] = ANTRIEBSARTEN.map((antriebsart) => {
    const { fahrzeug, eingabe } = eingaben.get(antriebsart)!;
    const tco = berechneGesamtTco(eingabe, annahmen);
    const verlauf = berechneKumulierterVerlauf(eingabe, annahmen);
    const breakEvenVsBev =
      antriebsart === "bev" ? null : berechneBreakEven(bevEingabe, eingabe, annahmen, 15);

    return {
      antriebsart,
      fahrzeug: fahrzeug
        ? { id: fahrzeug.id, marke: fahrzeug.marke, modell: fahrzeug.modell, variante: fahrzeug.variante }
        : null,
      verbrauchJe100Km: eingabe.fahrzeugdaten.verbrauchJe100Km,
      tco,
      verlauf,
      breakEvenVsBev,
    };
  });

  const antwort: TcoAntwort = {
    berechnungsstand: {
      annahmenVersion: annahmen.version,
      annahmenStand: annahmen.stand,
      energiepreiseStand: energiepreisCache.stand,
    },
    klasse: anfrage.klasse,
    ergebnisse,
  };

  return NextResponse.json(antwort);
}

function fahrzeugdatenFuer(
  antriebsart: Antriebsart,
  anfrage: TcoAnfrage,
): { fahrzeug: Fahrzeug | null; daten: Fahrzeugdaten } {
  const gewaehlteId = anfrage.fahrzeugIds?.[antriebsart];
  const fahrzeug = gewaehlteId
    ? FAHRZEUGE.find((f) => f.id === gewaehlteId)
    : FAHRZEUGE.find((f) => f.antriebsart === antriebsart && f.klasse === anfrage.klasse);

  if (fahrzeug) {
    return { fahrzeug, daten: resolveFahrzeugdaten(fahrzeug) };
  }
  return { fahrzeug: null, daten: fahrzeugdatenFuerKlasse(antriebsart, anfrage.klasse) };
}
