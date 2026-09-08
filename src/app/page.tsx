import Rechner from "@/components/rechner/Rechner";

const WEITERFUEHRENDE_ARTIKEL = [
  {
    titel: "Nicht Kohlenstoff ist das Problem, sondern fossiler Kohlenstoff",
    teaser:
      "Eine TUM-Studie wertet 19 Ökobilanz-Untersuchungen aus: Das Elektroauto liegt im Lebenszyklus im Schnitt 41 % unter dem Benziner — mit großer Bandbreite je nach Strommix, Fahrleistung und Fahrzeuggröße.",
  },
  {
    titel: "Förderung 2026: Wer bekommt wie viel?",
    teaser: "Folgt in Kürze.",
    inVorbereitung: true,
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-2.5 border-b border-line bg-surface px-5 py-3.5">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="var(--color-moss)" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="2.6" stroke="var(--color-moss)" strokeWidth="1.6" />
          <path
            d="M12 3.2v6.2M5.2 16.4l5.1-3M18.8 16.4l-5.1-3"
            stroke="var(--color-moss)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[16px] font-semibold tracking-tight text-ink">Wattklug</span>
        <span className="ml-auto text-[13px] text-muted">Ratgeber · Rechner</span>
      </header>

      <main className="mx-auto w-full max-w-[1080px] px-5 pb-16">
        <article className="max-w-[660px] py-11 pb-7">
          <h1 className="mb-4 font-serif text-[34px] leading-[1.22] font-medium tracking-tight text-ink">
            Was ein Auto wirklich kostet — und warum der Kaufpreis dabei die kleinste Rolle spielt
          </h1>
          <p className="mb-3.5 text-[17px] leading-relaxed">
            Über den Antrieb der Zukunft wird selten sachlich gestritten. Dabei lässt sich der größte Teil der
            Frage schlicht ausrechnen. Entscheidend ist nicht, was ein Fahrzeug in der Anzeige kostet, sondern was
            es über seine gesamte Haltedauer kostet: Wertverlust, Energie, Wartung, Versicherung, Steuer.
          </p>
          <p className="text-[17px] leading-relaxed">
            Der Rechner unten vergleicht fünf Antriebsarten mit denselben Regeln und legt jede Annahme offen. Er
            soll niemanden überzeugen — er soll nachvollziehbar sein.
          </p>
        </article>

        <Rechner />

        <section className="mt-13 max-w-[660px]">
          <h2 className="mb-4 font-serif text-[21px] font-medium text-ink">Weiterlesen</h2>
          {WEITERFUEHRENDE_ARTIKEL.map((a) => (
            <div key={a.titel} className="border-t border-line py-3.5">
              <p className="mb-1 text-[15.5px] font-medium text-ink">
                {a.titel}
                {a.inVorbereitung && <span className="ml-1.5 text-xs font-normal text-muted">(in Vorbereitung)</span>}
              </p>
              <p className="text-[13.5px] leading-relaxed text-muted">{a.teaser}</p>
            </div>
          ))}
        </section>

        <footer className="mt-11 max-w-[660px] border-t border-line pt-4.5 text-xs leading-relaxed text-muted">
          Preise stammen im Betrieb aus Tankerkönig (Kraftstoff) und SMARD/Bundesnetzagentur (Strom), Wasserstoff
          redaktionell gepflegt. Fahrzeuge ohne recherchierte Herstellerdaten sind sichtbar als Klassenschätzung
          gekennzeichnet. Alle Angaben ohne Gewähr.
        </footer>
      </main>
    </div>
  );
}
