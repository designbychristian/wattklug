import { eur, zahl } from "@/lib/format";
import type { TcoAntwort, TcoErgebnisZeile } from "@/lib/tco/api-typen";
import { ANTRIEBSART_LABEL, DATENLAGE_LABEL, VERBRAUCH_EINHEIT } from "@/lib/tco/labels";

type Props = {
  antwort: TcoAntwort | null;
  laden: boolean;
  fehler: string | null;
  haltedauerJahre: number;
};

export default function Ergebnis({ antwort, laden, fehler, haltedauerJahre }: Props) {
  if (fehler) {
    return (
      <section className="rounded-lg border border-line bg-surface p-5">
        <p className="text-sm text-error">{fehler}</p>
      </section>
    );
  }

  if (!antwort) {
    return (
      <section className="rounded-lg border border-line bg-surface p-5">
        <p className="text-sm text-muted">Ergebnis wird berechnet …</p>
      </section>
    );
  }

  const { ergebnisse } = antwort;
  const max = Math.max(...ergebnisse.map((e) => e.tco.gesamt));

  return (
    <section
      aria-busy={laden}
      className={`rounded-lg border border-line bg-surface p-5 transition-opacity ${laden ? "opacity-60" : ""}`}
    >
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="text-[15px] font-semibold text-ink">
          Gesamtkosten über {haltedauerJahre} {haltedauerJahre === 1 ? "Jahr" : "Jahre"}
        </h2>
        <span className="text-xs text-muted">
          Berechnungsstand {antwort.berechnungsstand.annahmenStand} · Annahmen v
          {antwort.berechnungsstand.annahmenVersion}
        </span>
      </div>
      <p className="mb-5 text-[13px] text-muted">
        Wertverlust, Energie, Wartung, Versicherung und Steuer, abzüglich Förderung und THG-Erlös.
      </p>

      {ergebnisse.map((e) => (
        <Balken key={e.antriebsart} zeile={e} max={max} />
      ))}

      <BreakEvenBadges ergebnisse={ergebnisse} />

      <details className="mt-4">
        <summary className="cursor-pointer text-[13.5px] text-moss">Jährlicher Kostenverlauf anzeigen</summary>
        <div className="mt-3">
          <VerlaufChart ergebnisse={ergebnisse} />
        </div>
      </details>

      <details className="mt-3">
        <summary className="cursor-pointer text-[13.5px] text-moss">Kostenaufschlüsselung anzeigen</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[460px] border-collapse text-[12.5px]">
            <thead>
              <tr className="border-b border-line">
                {["", "Wertverlust", "Energie", "Wartung", "Vers.", "Steuer", "Bonus"].map((h) => (
                  <th key={h} className={`px-1.5 py-1.5 font-normal text-muted ${h ? "text-right" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ergebnisse.map((e) => (
                <tr key={e.antriebsart} className="border-b border-paper">
                  <td className="px-1.5 py-1.5 text-ink">{ANTRIEBSART_LABEL[e.antriebsart]}</td>
                  <td className="px-1.5 py-1.5 text-right">{eur(e.tco.wertverlust)}</td>
                  <td className="px-1.5 py-1.5 text-right">{eur(e.tco.energiekosten)}</td>
                  <td className="px-1.5 py-1.5 text-right">{eur(e.tco.wartung)}</td>
                  <td className="px-1.5 py-1.5 text-right">{eur(e.tco.versicherung)}</td>
                  <td className="px-1.5 py-1.5 text-right">{eur(e.tco.kfzSteuerGesamt)}</td>
                  <td className="px-1.5 py-1.5 text-right text-moss">
                    {e.tco.foerderung + e.tco.thgErloes > 0 ? "−" + eur(e.tco.foerderung + e.tco.thgErloes) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2.5 text-xs leading-relaxed text-muted">
          CO₂-Angaben nach ICCT-Methodik über den Lebenszyklus, inklusive Fahrzeug- und Batterieherstellung.
          Wertverlust nach pauschaler Kurve je Antriebsart. Alle Angaben ohne Gewähr.
        </p>
      </details>
    </section>
  );
}

function Balken({ zeile, max }: { zeile: TcoErgebnisZeile; max: number }) {
  const istBev = zeile.antriebsart === "bev";
  const co2Tonnen = zeile.tco.co2LebenszyklusKg / 1000;

  return (
    <div className="mb-4">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm text-ink">
          {ANTRIEBSART_LABEL[zeile.antriebsart]}
          {zeile.fahrzeug && <span className="ml-1.5 text-xs text-muted">({zeile.fahrzeug.modell})</span>}
          {zeile.tco.datenlage !== "gut" && (
            <span className="ml-1.5 rounded bg-amber-soft px-1.5 py-0.5 text-[11px] text-amber">
              {DATENLAGE_LABEL[zeile.tco.datenlage]}
            </span>
          )}
        </span>
        <span className="text-sm font-medium text-ink">{eur(zeile.tco.gesamt)}</span>
      </div>
      <div className="h-[9px] overflow-hidden rounded-sm bg-paper">
        <div
          className={`h-full rounded-sm ${istBev ? "bg-moss" : "bg-slate"}`}
          style={{ width: `${max > 0 ? (zeile.tco.gesamt / max) * 100 : 0}%` }}
        />
      </div>
      <div className="mt-1 flex gap-3.5 text-xs text-muted">
        <span>{zahl(zeile.tco.centProKm)} ct/km</span>
        <span>
          {zahl(zeile.verbrauchJe100Km, zeile.antriebsart === "fcev" ? 2 : 1)} {VERBRAUCH_EINHEIT[zeile.antriebsart]}
        </span>
        <span>{zahl(co2Tonnen, 1)} t CO₂ (Lebenszyklus)</span>
      </div>
    </div>
  );
}

function BreakEvenBadges({ ergebnisse }: { ergebnisse: TcoErgebnisZeile[] }) {
  const vergleiche = ergebnisse.filter((e) => e.breakEvenVsBev !== null);
  if (vergleiche.length === 0) return null;

  return (
    <div className="mt-5 rounded-md border-l-[3px] border-moss bg-moss-soft px-4 py-3.5">
      <p className="mb-1.5 text-[13.5px] font-medium text-ink">Wann sich das Elektroauto rechnet</p>
      {vergleiche.map((e) => {
        const be = e.breakEvenVsBev!;
        const label = ANTRIEBSART_LABEL[e.antriebsart];
        const text =
          be.jahr !== null
            ? `Ab Jahr ${be.jahr} günstiger als ${label}.`
            : be.guenstigerOhneSchnittpunkt
              ? `Über den gesamten Betrachtungszeitraum günstiger als ${label}.`
              : `Innerhalb von 15 Jahren nicht günstiger als ${label}.`;
        return (
          <p key={e.antriebsart} className="my-0.5 text-[13.5px] text-body">
            {text}
          </p>
        );
      })}
    </div>
  );
}

function VerlaufChart({ ergebnisse }: { ergebnisse: TcoErgebnisZeile[] }) {
  const width = 560;
  const height = 190;
  const padding = 32;

  const alleJahre = ergebnisse.flatMap((e) => e.verlauf.map((v) => v.jahr));
  const alleWerte = ergebnisse.flatMap((e) => e.verlauf.map((v) => v.kumuliert));
  const maxJahr = Math.max(1, ...alleJahre);
  const maxWert = Math.max(1, ...alleWerte);

  const x = (jahr: number) => padding + ((jahr - 1) / Math.max(1, maxJahr - 1)) * (width - padding * 2);
  const y = (wert: number) => height - padding - (wert / maxWert) * (height - padding * 2);

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        role="img"
        aria-label="Kumulierte Kosten je Antriebsart über die Haltedauer"
      >
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--color-line)" />
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--color-line)" />
        <text x={padding} y={padding - 8} className="fill-muted text-[10px]">
          {eur(maxWert)}
        </text>
        <text x={padding} y={height - padding + 16} className="fill-muted text-[10px]">
          Jahr 1
        </text>
        <text x={width - padding} y={height - padding + 16} textAnchor="end" className="fill-muted text-[10px]">
          Jahr {maxJahr}
        </text>
        {ergebnisse.map((e) => {
          const istBev = e.antriebsart === "bev";
          const punkte = e.verlauf.map((v) => `${x(v.jahr)},${y(v.kumuliert)}`).join(" ");
          return (
            <polyline
              key={e.antriebsart}
              points={punkte}
              fill="none"
              stroke={istBev ? "var(--color-moss)" : "var(--color-slate)"}
              strokeWidth={istBev ? 2.5 : 1.5}
            />
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {ergebnisse.map((e) => (
          <span key={e.antriebsart} className="inline-flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: e.antriebsart === "bev" ? "var(--color-moss)" : "var(--color-slate)" }}
            />
            {ANTRIEBSART_LABEL[e.antriebsart]}
          </span>
        ))}
      </div>
    </div>
  );
}
