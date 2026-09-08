"use client";

import { useId, useState } from "react";

import { km } from "@/lib/format";
import { EINKOMMENSKLASSE_LABEL, FAHRZEUGKLASSE_LABEL } from "@/lib/tco/labels";
import { EINKOMMENSKLASSEN, FAHRZEUGKLASSEN, type Einkommensklasse, type Fahrzeugklasse } from "@/lib/tco/typen";

export type EnergiepreisFelder = {
  strom: number;
  benzin: number;
  diesel: number;
  wasserstoff: number;
};

export type EingabeState = {
  klasse: Fahrzeugklasse;
  jahresKm: number;
  haltedauerJahre: number;
  einkommensklasse: Einkommensklasse;
  energiepreise: EnergiepreisFelder;
  preissteigerungProzent: number;
  vignettenProJahr: number;
};

type Props = {
  wert: EingabeState;
  onChange: (naechster: EingabeState) => void;
};

function Feld({
  label,
  hinweis,
  children,
}: {
  label: string;
  hinweis?: string;
  children: React.ReactNode;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="mb-4 block">
      <span className="mb-1.5 flex items-center gap-1 text-[13px] text-body">
        {label}
        {hinweis && <Hinweis text={hinweis} />}
      </span>
      <span id={id}>{children}</span>
    </label>
  );
}

function Hinweis({ text }: { text: string }) {
  const [an, setAn] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setAn((v) => !v)}
        aria-label="Annahme anzeigen"
        className={`flex h-[15px] w-[15px] items-center justify-center rounded-full border text-[10px] leading-none ${
          an ? "border-moss bg-moss text-white" : "border-slate text-muted"
        }`}
      >
        i
      </button>
      {an && (
        <span className="absolute bottom-[150%] left-1/2 z-40 w-56 -translate-x-1/2 rounded-md bg-ink px-2.5 py-2 text-left text-xs leading-relaxed font-normal text-[#EDF0EC]">
          {text}
        </span>
      )}
    </span>
  );
}

const inputCss =
  "w-full rounded-[5px] border border-line bg-surface px-2.5 py-2 text-[15px] text-ink";

export default function Eingabe({ wert, onChange }: Props) {
  const [erweitertOffen, setErweitertOffen] = useState(false);

  const setzen = <K extends keyof EingabeState>(feld: K, wertNeu: EingabeState[K]) =>
    onChange({ ...wert, [feld]: wertNeu });

  const setzenEnergiepreis = <K extends keyof EnergiepreisFelder>(feld: K, wertNeu: number) =>
    onChange({ ...wert, energiepreise: { ...wert.energiepreise, [feld]: wertNeu } });

  return (
    <section className="rounded-lg border border-line bg-surface p-5">
      <h2 className="mb-4 text-[15px] font-semibold text-ink">Ihre Angaben</h2>

      <Feld label="Fahrzeugklasse">
        <select
          className={inputCss}
          value={wert.klasse}
          onChange={(e) => setzen("klasse", e.target.value as Fahrzeugklasse)}
        >
          {FAHRZEUGKLASSEN.map((k) => (
            <option key={k} value={k}>
              {FAHRZEUGKLASSE_LABEL[k]}
            </option>
          ))}
        </select>
      </Feld>

      <Feld label="Fahrleistung pro Jahr">
        <div className="flex items-center gap-2.5">
          <input
            type="range"
            min={5000}
            max={40000}
            step={1000}
            value={wert.jahresKm}
            onChange={(e) => setzen("jahresKm", Number(e.target.value))}
            className="flex-1"
            aria-label="Fahrleistung pro Jahr in Kilometern"
          />
          <span className="min-w-[74px] text-right text-sm text-ink">{km(wert.jahresKm)} km</span>
        </div>
      </Feld>

      <Feld label="Haltedauer">
        <div className="flex items-center gap-2.5">
          <input
            type="range"
            min={1}
            max={15}
            step={1}
            value={wert.haltedauerJahre}
            onChange={(e) => setzen("haltedauerJahre", Number(e.target.value))}
            className="flex-1"
            aria-label="Haltedauer in Jahren"
          />
          <span className="min-w-[74px] text-right text-sm text-ink">
            {wert.haltedauerJahre} {wert.haltedauerJahre === 1 ? "Jahr" : "Jahre"}
          </span>
        </div>
      </Feld>

      <button
        type="button"
        onClick={() => setErweitertOffen((v) => !v)}
        className="mt-1 w-full rounded-[5px] border border-line px-0 py-2 text-[13.5px] text-moss"
      >
        {erweitertOffen ? "Erweiterte Angaben schließen" : "Erweiterte Angaben"}
      </button>

      {erweitertOffen && (
        <div className="mt-5 border-t border-line pt-4">
          <Feld
            label="Haushaltseinkommen (für Förderung)"
            hinweis="Sozialer Klimabonus, gültig seit Mai 2026: Basisförderung 3.000 € (BEV) bzw. 1.500 € (PHEV), zzgl. Sozial- und Kinderbonus, max. 6.000 €. Mindesthaltedauer 36 Monate."
          >
            <select
              className={inputCss}
              value={wert.einkommensklasse}
              onChange={(e) => setzen("einkommensklasse", e.target.value as Einkommensklasse)}
            >
              {EINKOMMENSKLASSEN.map((k) => (
                <option key={k} value={k}>
                  {EINKOMMENSKLASSE_LABEL[k]}
                </option>
              ))}
            </select>
          </Feld>

          <Feld
            label="Strompreis (€/kWh)"
            hinweis="Vorbelegt mit dem bundesweiten Haushaltsdurchschnitt aus SMARD-/Bundesnetzagentur-Daten. Wer überwiegend zu Hause lädt, zahlt meist weniger."
          >
            <input
              type="number"
              step={0.01}
              min={0}
              className={inputCss}
              value={wert.energiepreise.strom}
              onChange={(e) => setzenEnergiepreis("strom", Number(e.target.value))}
            />
          </Feld>
          <Feld
            label="Benzinpreis (€/l)"
            hinweis="Tagesdurchschnitt aus Tankerkönig-Daten. Enthält bereits den CO₂-Preis nach BEHG (2026: 55–65 €/t, rund 15–19 ct/l) — er wird deshalb nicht separat ausgewiesen."
          >
            <input
              type="number"
              step={0.01}
              min={0}
              className={inputCss}
              value={wert.energiepreise.benzin}
              onChange={(e) => setzenEnergiepreis("benzin", Number(e.target.value))}
            />
          </Feld>
          <Feld
            label="Dieselpreis (€/l)"
            hinweis="Tagesdurchschnitt aus Tankerkönig-Daten, inklusive CO₂-Preis nach BEHG."
          >
            <input
              type="number"
              step={0.01}
              min={0}
              className={inputCss}
              value={wert.energiepreise.diesel}
              onChange={(e) => setzenEnergiepreis("diesel", Number(e.target.value))}
            />
          </Feld>
          <Feld
            label="Wasserstoffpreis (€/kg)"
            hinweis="Redaktionell gepflegter Wert: für Wasserstoff steht keine offene Preis-Schnittstelle zur Verfügung. Die Tankstellendichte ist regional sehr unterschiedlich."
          >
            <input
              type="number"
              step={0.05}
              min={0}
              className={inputCss}
              value={wert.energiepreise.wasserstoff}
              onChange={(e) => setzenEnergiepreis("wasserstoff", Number(e.target.value))}
            />
          </Feld>
          <Feld
            label="Jährliche Preissteigerung (%)"
            hinweis="Standard ist 0 % — es wird mit heutigen Preisen gerechnet. Wer eine Verteuerung erwartet, kann sie hier auf alle Energiekosten anwenden."
          >
            <input
              type="number"
              step={0.5}
              className={inputCss}
              value={wert.preissteigerungProzent}
              onChange={(e) => setzen("preissteigerungProzent", Number(e.target.value))}
            />
          </Feld>
          <Feld
            label="Auslands-Vignetten (€/Jahr, optional)"
            hinweis="In Deutschland existiert keine Pkw-Maut. Nur relevant bei regelmäßigen Fahrten ins vignettenpflichtige Ausland."
          >
            <input
              type="number"
              step={5}
              min={0}
              className={inputCss}
              value={wert.vignettenProJahr}
              onChange={(e) => setzen("vignettenProJahr", Number(e.target.value))}
            />
          </Feld>
        </div>
      )}
    </section>
  );
}
