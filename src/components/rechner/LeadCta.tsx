"use client";

import { useState } from "react";

const PLZ_MUSTER = /^\d{5}$/;
const MAIL_MUSTER = /^\S+@\S+\.\S+$/;

const inputCss = "rounded-[5px] border border-line bg-surface px-2.5 py-2 text-[15px] text-ink";

export default function LeadCta() {
  const [plz, setPlz] = useState("");
  const [mail, setMail] = useState("");
  const [einwilligung, setEinwilligung] = useState(false);
  const [fehler, setFehler] = useState("");
  const [gesendet, setGesendet] = useState(false);
  const [sendetGerade, setSendetGerade] = useState(false);

  const absenden = async () => {
    if (!PLZ_MUSTER.test(plz)) return setFehler("Bitte eine fünfstellige Postleitzahl eingeben.");
    if (!MAIL_MUSTER.test(mail)) return setFehler("Bitte eine gültige E-Mail-Adresse eingeben.");
    if (!einwilligung) return setFehler("Bitte der Weitergabe an Fachbetriebe zustimmen.");
    setFehler("");
    setSendetGerade(true);
    try {
      const antwort = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plz, mail, einwilligung }),
      });
      if (!antwort.ok) {
        const daten = await antwort.json().catch(() => null);
        setFehler(daten?.fehler?.[0]?.meldung ?? "Anfrage konnte nicht gesendet werden.");
        return;
      }
      setGesendet(true);
    } catch {
      setFehler("Anfrage konnte nicht gesendet werden. Bitte später erneut versuchen.");
    } finally {
      setSendetGerade(false);
    }
  };

  if (gesendet) {
    return (
      <section className="mt-4.5 rounded-lg border border-line bg-surface p-5">
        <p className="mb-1.5 text-[15px] font-medium text-ink">Anfrage aufgenommen</p>
        <p className="text-[13.5px] leading-relaxed">
          Ein Fachbetrieb in Ihrer Region meldet sich. Sie können Ihre Einwilligung jederzeit widerrufen.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-4.5 rounded-lg border border-line bg-surface p-5">
      <p className="mb-1 text-[15px] font-medium text-ink">Angebot aus Ihrer Region einholen</p>
      <p className="mb-3.5 text-[13.5px] leading-relaxed">
        Kostenlos und unverbindlich. Die Vermittlung finanziert diese Seite — Redaktion und Rechner bleiben davon
        unabhängig.
      </p>
      <div className="mb-3 flex flex-wrap gap-2.5">
        <input
          value={plz}
          onChange={(e) => {
            setPlz(e.target.value);
            setFehler("");
          }}
          placeholder="80331"
          inputMode="numeric"
          aria-label="Postleitzahl"
          className={`${inputCss} w-[110px] flex-none`}
        />
        <input
          value={mail}
          onChange={(e) => {
            setMail(e.target.value);
            setFehler("");
          }}
          placeholder="name@beispiel.de"
          type="email"
          aria-label="E-Mail-Adresse"
          className={`${inputCss} min-w-[190px] flex-1`}
        />
      </div>
      <label className="mb-3 flex gap-2 text-[12.5px] leading-relaxed">
        <input
          type="checkbox"
          checked={einwilligung}
          onChange={(e) => {
            setEinwilligung(e.target.checked);
            setFehler("");
          }}
          className="mt-0.5 accent-moss"
        />
        <span>
          Meine Angaben dürfen an passende Fachbetriebe weitergegeben werden — auch an Partner, die zum Zeitpunkt
          meiner Anfrage noch nicht feststehen. Widerruf jederzeit möglich, Löschung spätestens nach zwölf Monaten.
        </span>
      </label>
      {fehler && <p className="mb-2.5 text-[12.5px] text-error">{fehler}</p>}
      <button
        type="button"
        onClick={absenden}
        disabled={sendetGerade}
        className="rounded-[5px] bg-moss px-5 py-2.5 text-sm text-white disabled:opacity-60"
      >
        {sendetGerade ? "Wird gesendet …" : "Angebot anfordern"}
      </button>
    </section>
  );
}
