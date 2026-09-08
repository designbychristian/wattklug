"use client";

import { useEffect, useRef, useState } from "react";

import type { TcoAntwort, TcoFehlerAntwort } from "@/lib/tco/api-typen";
import { ENERGIEPREISE_CACHE_V0_1 } from "@/lib/tco/energiepreise";

import Eingabe, { type EingabeState } from "./Eingabe";
import Ergebnis from "./Ergebnis";
import LeadCta from "./LeadCta";

const STANDARD: EingabeState = {
  klasse: "kompaktklasse",
  jahresKm: 15000,
  haltedauerJahre: 6,
  einkommensklasse: "ueber80",
  energiepreise: {
    strom: ENERGIEPREISE_CACHE_V0_1.strom,
    benzin: ENERGIEPREISE_CACHE_V0_1.benzin,
    diesel: ENERGIEPREISE_CACHE_V0_1.diesel,
    wasserstoff: ENERGIEPREISE_CACHE_V0_1.wasserstoff,
  },
  preissteigerungProzent: 0,
  vignettenProJahr: 0,
};

export default function Rechner() {
  const [eingabe, setEingabe] = useState<EingabeState>(STANDARD);
  const [antwort, setAntwort] = useState<TcoAntwort | null>(null);
  const [laden, setLaden] = useState(true);
  const [fehler, setFehler] = useState<string | null>(null);
  const abbruch = useRef<AbortController | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      abbruch.current?.abort();
      const controller = new AbortController();
      abbruch.current = controller;
      setLaden(true);

      fetch("/api/tco", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          klasse: eingabe.klasse,
          jahresKm: eingabe.jahresKm,
          haltedauerJahre: eingabe.haltedauerJahre,
          einkommensklasse: eingabe.einkommensklasse,
          energiepreise: eingabe.energiepreise,
          preissteigerungProzent: eingabe.preissteigerungProzent,
          vignettenProJahr: eingabe.vignettenProJahr > 0 ? eingabe.vignettenProJahr : undefined,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const daten = (await res.json()) as TcoFehlerAntwort;
            throw new Error(daten.fehler?.[0]?.meldung ?? "Berechnung fehlgeschlagen.");
          }
          return (await res.json()) as TcoAntwort;
        })
        .then((daten) => {
          setAntwort(daten);
          setFehler(null);
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setFehler(err instanceof Error ? err.message : "Berechnung fehlgeschlagen.");
        })
        .finally(() => setLaden(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [eingabe]);

  return (
    <div className="flex flex-wrap items-start gap-6">
      <div className="min-w-[290px] flex-[1_1_300px]">
        <div className="sticky top-4">
          <Eingabe wert={eingabe} onChange={setEingabe} />
        </div>
      </div>
      <div className="min-w-[300px] flex-[2_1_440px]">
        <Ergebnis antwort={antwort} laden={laden} fehler={fehler} haltedauerJahre={eingabe.haltedauerJahre} />
        <LeadCta />
      </div>
    </div>
  );
}
