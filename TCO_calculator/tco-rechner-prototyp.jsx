import React, { useState, useMemo } from "react";

const C = {
  paper: "#F6F5F1",
  surface: "#FFFFFF",
  ink: "#17241D",
  body: "#3C4A43",
  muted: "#6E7B74",
  line: "#DDE1DA",
  moss: "#416B39",
  mossSoft: "#E7EDE3",
  slate: "#8A968F",
  amber: "#9A6B12",
  amberSoft: "#F6EFDF",
};

const SANS = "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif";
const SERIF = "'IBM Plex Serif', Georgia, serif";

const STAND = "Berechnungsstand 06.09.2026 · Annahmen v0.1";

const ANTRIEBE = [
  {
    id: "bev", name: "Elektro", kurz: "BEV", einheit: "kWh",
    preis: 42000, verbrauch: 17.5, verbrauchLabel: "kWh/100 km",
    wartung: 420, versicherung: 720, steuer: 0, thg: 175,
    wvJahr1: 0.28, wvFolge: 0.13,
    co2Herstellung: 9800, co2Betrieb: 58,
    datenlage: "gut",
  },
  {
    id: "benzin", name: "Benzin", kurz: "Benzin", einheit: "l",
    preis: 34500, verbrauch: 6.8, verbrauchLabel: "l/100 km",
    wartung: 680, versicherung: 640, steuer: 168, thg: 0,
    wvJahr1: 0.24, wvFolge: 0.12,
    co2Herstellung: 6200, co2Betrieb: 165,
    datenlage: "gut",
  },
  {
    id: "diesel", name: "Diesel", kurz: "Diesel", einheit: "l",
    preis: 37200, verbrauch: 5.4, verbrauchLabel: "l/100 km",
    wartung: 740, versicherung: 690, steuer: 312, thg: 0,
    wvJahr1: 0.25, wvFolge: 0.12,
    co2Herstellung: 6400, co2Betrieb: 148,
    datenlage: "gut",
  },
  {
    id: "hybrid", name: "Plug-in-Hybrid", kurz: "PHEV", einheit: "l",
    preis: 41800, verbrauch: 4.2, verbrauchLabel: "l/100 km",
    wartung: 760, versicherung: 700, steuer: 96, thg: 0,
    wvJahr1: 0.27, wvFolge: 0.13,
    co2Herstellung: 8100, co2Betrieb: 112,
    datenlage: "gut",
  },
  {
    id: "fcev", name: "Brennstoffzelle", kurz: "FCEV", einheit: "kg",
    preis: 68000, verbrauch: 0.95, verbrauchLabel: "kg H₂/100 km",
    wartung: 690, versicherung: 810, steuer: 0, thg: 0,
    wvJahr1: 0.34, wvFolge: 0.16,
    co2Herstellung: 10400, co2Betrieb: 132,
    datenlage: "dünn",
  },
];

const EINKOMMEN = [
  { id: "u40", label: "bis 40.000 € zvE", bev: 6000, phev: 3000 },
  { id: "u60", label: "40.000 – 60.000 € zvE", bev: 4500, phev: 2250 },
  { id: "u80", label: "60.000 – 80.000 € zvE", bev: 3000, phev: 1500 },
  { id: "o80", label: "über 80.000 € zvE", bev: 0, phev: 0 },
];

const eur = (n) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const num = (n, d = 1) =>
  new Intl.NumberFormat("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);

function Hinweis({ text }) {
  const [an, setAn] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block", marginLeft: 5 }}>
      <button
        onClick={() => setAn(!an)}
        aria-label="Annahme anzeigen"
        style={{
          width: 15, height: 15, borderRadius: "50%", border: `1px solid ${C.slate}`,
          background: an ? C.moss : "transparent", color: an ? "#fff" : C.muted,
          fontSize: 10, lineHeight: "13px", cursor: "pointer", padding: 0, fontFamily: SANS,
        }}
      >
        i
      </button>
      {an && (
        <span
          style={{
            position: "absolute", bottom: "150%", left: "50%", transform: "translateX(-50%)",
            width: 230, background: C.ink, color: "#EDF0EC", fontSize: 12, lineHeight: 1.5,
            padding: "9px 11px", borderRadius: 6, zIndex: 40, fontWeight: 400, textAlign: "left",
          }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

function Feld({ label, hinweis, children }) {
  return (
    <label style={{ display: "block", marginBottom: 16 }}>
      <span style={{ display: "block", fontSize: 13, color: C.body, marginBottom: 6 }}>
        {label}
        {hinweis && <Hinweis text={hinweis} />}
      </span>
      {children}
    </label>
  );
}

const inputCss = {
  width: "100%", padding: "9px 11px", fontSize: 15, fontFamily: SANS, color: C.ink,
  background: C.surface, border: `1px solid ${C.line}`, borderRadius: 5, boxSizing: "border-box",
};

export default function TcoRechner() {
  const [modell, setModell] = useState("kompakt");
  const [km, setKm] = useState(15000);
  const [jahre, setJahre] = useState(6);
  const [offen, setOffen] = useState(false);
  const [strom, setStrom] = useState(0.34);
  const [benzin, setBenzin] = useState(1.79);
  const [diesel, setDiesel] = useState(1.68);
  const [wasserstoff, setWasserstoff] = useState(13.85);
  const [einkommen, setEinkommen] = useState("u80");
  const [teuerung, setTeuerung] = useState(0);
  const [plz, setPlz] = useState("");
  const [mail, setMail] = useState("");
  const [ok, setOk] = useState(false);
  const [fehler, setFehler] = useState("");
  const [gesendet, setGesendet] = useState(false);

  const klasse = modell === "kompakt" ? 1 : modell === "mittel" ? 1.28 : 0.82;
  const foerder = EINKOMMEN.find((e) => e.id === einkommen);

  const preisFuer = (a) =>
    a.id === "bev" ? strom : a.id === "fcev" ? wasserstoff : a.id === "diesel" ? diesel : benzin;

  const ergebnisse = useMemo(() => {
    return ANTRIEBE.map((a) => {
      const kauf = Math.round(a.preis * klasse);
      const zuschuss = a.id === "bev" ? foerder.bev : a.id === "hybrid" ? foerder.phev : 0;
      const p0 = preisFuer(a);
      let energie = 0;
      for (let j = 0; j < jahre; j++) {
        energie += (a.verbrauch / 100) * km * p0 * Math.pow(1 + teuerung / 100, j);
      }
      let rest = kauf * (1 - a.wvJahr1);
      for (let j = 1; j < jahre; j++) rest *= 1 - a.wvFolge;
      const wertverlust = kauf - rest;
      const wartung = a.wartung * klasse * jahre;
      const versicherung = a.versicherung * klasse * jahre;
      const steuer = a.steuer * jahre;
      const thg = a.thg * jahre;
      const gesamt = wertverlust + energie + wartung + versicherung + steuer - thg - zuschuss;
      const co2 = (a.co2Herstellung * klasse + (a.co2Betrieb * km * jahre) / 1000) / 1000;
      return {
        ...a, kauf, zuschuss, energie, wertverlust, wartung, versicherung, steuer, thg,
        gesamt, co2, proKm: (gesamt / (km * jahre)) * 100,
      };
    });
  }, [klasse, km, jahre, strom, benzin, diesel, wasserstoff, einkommen, teuerung]);

  const max = Math.max(...ergebnisse.map((e) => e.gesamt));
  const bev = ergebnisse.find((e) => e.id === "bev");

  const breakEven = useMemo(() => {
    const jahrKosten = (a, n) => {
      const kauf = Math.round(a.preis * klasse);
      const zuschuss = a.id === "bev" ? foerder.bev : a.id === "hybrid" ? foerder.phev : 0;
      const p0 = preisFuer(a);
      let energie = 0;
      for (let j = 0; j < n; j++) energie += (a.verbrauch / 100) * km * p0 * Math.pow(1 + teuerung / 100, j);
      let rest = kauf * (1 - a.wvJahr1);
      for (let j = 1; j < n; j++) rest *= 1 - a.wvFolge;
      return kauf - rest + energie + (a.wartung + a.versicherung) * klasse * n + a.steuer * n - a.thg * n - zuschuss;
    };
    return ANTRIEBE.filter((a) => a.id !== "bev").map((a) => {
      const e = ergebnisse.find((x) => x.id === a.id);
      for (let n = 1; n <= 15; n++) {
        if (jahrKosten(ANTRIEBE[0], n) < jahrKosten(a, n)) return { kurz: a.name, jahr: n };
      }
      return { kurz: a.name, jahr: null, teurer: e.gesamt < bev.gesamt };
    });
  }, [ergebnisse, klasse, km, jahre, strom, benzin, diesel, wasserstoff, einkommen, teuerung]);

  const absenden = () => {
    if (!/^\d{5}$/.test(plz)) return setFehler("Bitte eine fünfstellige Postleitzahl eingeben.");
    if (!/^\S+@\S+\.\S+$/.test(mail)) return setFehler("Bitte eine gültige E-Mail-Adresse eingeben.");
    if (!ok) return setFehler("Bitte der Weitergabe an Fachbetriebe zustimmen.");
    setFehler("");
    setGesendet(true);
  };

  return (
    <div style={{ background: C.paper, fontFamily: SANS, color: C.body, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:wght@400;500&display=swap');
        input[type=range]{-webkit-appearance:none;height:3px;background:${C.line};border-radius:2px;outline:none}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:19px;height:19px;border-radius:50%;background:${C.moss};cursor:pointer;border:3px solid ${C.surface};box-shadow:0 0 0 1px ${C.moss}}
        input[type=range]::-moz-range-thumb{width:15px;height:15px;border-radius:50%;background:${C.moss};cursor:pointer;border:3px solid ${C.surface}}
        a{color:${C.moss}}
        button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid ${C.moss};outline-offset:2px}
      `}</style>

      <header
        style={{
          borderBottom: `1px solid ${C.line}`, background: C.surface,
          padding: "14px 22px", display: "flex", alignItems: "center", gap: 10,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke={C.moss} strokeWidth="1.6" />
          <circle cx="12" cy="12" r="2.6" stroke={C.moss} strokeWidth="1.6" />
          <path d="M12 3.2v6.2M5.2 16.4l5.1-3M18.8 16.4l-5.1-3" stroke={C.moss} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span style={{ fontSize: 16, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>
          Wattklug
        </span>
        <span style={{ marginLeft: "auto", fontSize: 13, color: C.muted }}>Ratgeber · Rechner</span>
      </header>

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "0 22px 64px" }}>
        <article style={{ maxWidth: 660, padding: "44px 0 30px" }}>
          <h1
            style={{
              fontFamily: SERIF, fontSize: 34, lineHeight: 1.22, fontWeight: 500,
              color: C.ink, margin: "0 0 16px", letterSpacing: "-0.015em",
            }}
          >
            Was ein Auto wirklich kostet — und warum der Kaufpreis dabei die kleinste Rolle spielt
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.65, margin: "0 0 14px" }}>
            Über den Antrieb der Zukunft wird selten sachlich gestritten. Dabei lässt sich der größte Teil der
            Frage schlicht ausrechnen. Entscheidend ist nicht, was ein Fahrzeug in der Anzeige kostet, sondern
            was es über seine gesamte Haltedauer kostet: Wertverlust, Energie, Wartung, Versicherung, Steuer.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.65, margin: 0 }}>
            Der Rechner unten vergleicht fünf Antriebsarten mit denselben Regeln und legt jede Annahme offen.
            Er soll niemanden überzeugen — er soll nachvollziehbar sein.
          </p>
        </article>

        <div style={{ display: "flex", gap: 26, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Eingabe */}
          <section
            style={{
              flex: "1 1 300px", minWidth: 290, background: C.surface,
              border: `1px solid ${C.line}`, borderRadius: 8, padding: "22px 22px 18px",
              position: "sticky", top: 18,
            }}
          >
            <h2 style={{ fontSize: 15, fontWeight: 600, color: C.ink, margin: "0 0 18px" }}>
              Ihre Angaben
            </h2>

            <Feld label="Fahrzeugklasse">
              <select value={modell} onChange={(e) => setModell(e.target.value)} style={inputCss}>
                <option value="klein">Kleinwagen</option>
                <option value="kompakt">Kompaktklasse</option>
                <option value="mittel">Mittelklasse / SUV</option>
              </select>
            </Feld>

            <Feld label="Fahrleistung pro Jahr">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="range" min="5000" max="40000" step="1000" value={km}
                  onChange={(e) => setKm(+e.target.value)} style={{ flex: 1 }}
                />
                <span style={{ fontSize: 14, color: C.ink, minWidth: 74, textAlign: "right" }}>
                  {new Intl.NumberFormat("de-DE").format(km)} km
                </span>
              </div>
            </Feld>

            <Feld label="Haltedauer">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <input
                  type="range" min="1" max="15" step="1" value={jahre}
                  onChange={(e) => setJahre(+e.target.value)} style={{ flex: 1 }}
                />
                <span style={{ fontSize: 14, color: C.ink, minWidth: 74, textAlign: "right" }}>
                  {jahre} {jahre === 1 ? "Jahr" : "Jahre"}
                </span>
              </div>
            </Feld>

            <button
              onClick={() => setOffen(!offen)}
              style={{
                width: "100%", marginTop: 4, padding: "9px 0", fontSize: 13.5, fontFamily: SANS,
                color: C.moss, background: "transparent", border: `1px solid ${C.line}`,
                borderRadius: 5, cursor: "pointer",
              }}
            >
              {offen ? "Erweiterte Angaben schließen" : "Erweiterte Angaben"}
            </button>

            {offen && (
              <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${C.line}` }}>
                <Feld
                  label="Haushaltseinkommen (für Förderung)"
                  hinweis="Sozialer Klimabonus, gültig seit Mai 2026: Basisförderung 3.000 € (BEV) bzw. 1.500 € (PHEV), zzgl. Sozial- und Kinderbonus, max. 6.000 €. Mindesthaltedauer 36 Monate."
                >
                  <select value={einkommen} onChange={(e) => setEinkommen(e.target.value)} style={inputCss}>
                    {EINKOMMEN.map((e) => (
                      <option key={e.id} value={e.id}>{e.label}</option>
                    ))}
                  </select>
                </Feld>

                <Feld label="Strompreis (€/kWh)" hinweis="Vorbelegt mit dem bundesweiten Haushaltsdurchschnitt aus SMARD-/Bundesnetzagentur-Daten. Wer überwiegend zu Hause lädt, zahlt meist weniger.">
                  <input type="number" step="0.01" value={strom} onChange={(e) => setStrom(+e.target.value)} style={inputCss} />
                </Feld>
                <Feld label="Benzinpreis (€/l)" hinweis="Tagesdurchschnitt aus Tankerkönig-Daten. Enthält bereits den CO₂-Preis nach BEHG (2026: 55–65 €/t, rund 15–19 ct/l) — er wird deshalb nicht separat ausgewiesen.">
                  <input type="number" step="0.01" value={benzin} onChange={(e) => setBenzin(+e.target.value)} style={inputCss} />
                </Feld>
                <Feld label="Dieselpreis (€/l)" hinweis="Tagesdurchschnitt aus Tankerkönig-Daten, inklusive CO₂-Preis nach BEHG.">
                  <input type="number" step="0.01" value={diesel} onChange={(e) => setDiesel(+e.target.value)} style={inputCss} />
                </Feld>
                <Feld label="Wasserstoffpreis (€/kg)" hinweis="Redaktionell gepflegter Wert: für Wasserstoff steht keine offene Preis-Schnittstelle zur Verfügung. Die Tankstellendichte ist regional sehr unterschiedlich.">
                  <input type="number" step="0.05" value={wasserstoff} onChange={(e) => setWasserstoff(+e.target.value)} style={inputCss} />
                </Feld>
                <Feld label="Jährliche Preissteigerung (%)" hinweis="Standard ist 0 % — es wird mit heutigen Preisen gerechnet. Wer eine Verteuerung erwartet, kann sie hier auf alle Energiekosten anwenden.">
                  <input type="number" step="0.5" value={teuerung} onChange={(e) => setTeuerung(+e.target.value)} style={inputCss} />
                </Feld>
              </div>
            )}
          </section>

          {/* Ergebnis */}
          <section style={{ flex: "2 1 440px", minWidth: 300 }}>
            <div
              style={{
                background: C.surface, border: `1px solid ${C.line}`, borderRadius: 8,
                padding: "22px 22px 18px",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: C.ink, margin: 0 }}>
                  Gesamtkosten über {jahre} {jahre === 1 ? "Jahr" : "Jahre"}
                </h2>
                <span style={{ fontSize: 12, color: C.muted }}>{STAND}</span>
              </div>
              <p style={{ fontSize: 13, color: C.muted, margin: "0 0 20px" }}>
                Wertverlust, Energie, Wartung, Versicherung und Steuer, abzüglich Förderung und THG-Erlös.
              </p>

              {ergebnisse.map((e) => (
                <div key={e.id} style={{ marginBottom: 15 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                    <span style={{ fontSize: 14, color: C.ink }}>
                      {e.name}
                      {e.datenlage === "dünn" && (
                        <span
                          style={{
                            marginLeft: 7, fontSize: 11, color: C.amber, background: C.amberSoft,
                            padding: "2px 6px", borderRadius: 3,
                          }}
                        >
                          dünne Datenlage
                        </span>
                      )}
                    </span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: C.ink }}>{eur(e.gesamt)}</span>
                  </div>
                  <div style={{ height: 9, background: C.paper, borderRadius: 2, overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${(e.gesamt / max) * 100}%`, height: "100%",
                        background: e.id === "bev" ? C.moss : C.slate, borderRadius: 2,
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 14, marginTop: 5, fontSize: 12, color: C.muted }}>
                    <span>{num(e.proKm)} ct/km</span>
                    <span>{num(e.verbrauch, e.id === "fcev" ? 2 : 1)} {e.verbrauchLabel}</span>
                    <span>{num(e.co2, 1)} t CO₂</span>
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: 20, padding: "14px 16px", background: C.mossSoft,
                  borderRadius: 6, borderLeft: `3px solid ${C.moss}`,
                }}
              >
                <p style={{ margin: "0 0 6px", fontSize: 13.5, color: C.ink, fontWeight: 500 }}>
                  Wann sich das Elektroauto rechnet
                </p>
                {breakEven.map((b) => (
                  <p key={b.kurz} style={{ margin: "3px 0", fontSize: 13.5, color: C.body }}>
                    {b.jahr
                      ? `Ab Jahr ${b.jahr} günstiger als ${b.kurz}.`
                      : `Innerhalb von 15 Jahren nicht günstiger als ${b.kurz}.`}
                  </p>
                ))}
              </div>

              <details style={{ marginTop: 18 }}>
                <summary style={{ fontSize: 13.5, color: C.moss, cursor: "pointer" }}>
                  Kostenaufschlüsselung anzeigen
                </summary>
                <div style={{ overflowX: "auto", marginTop: 12 }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 420 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${C.line}` }}>
                        {["", "Wertverlust", "Energie", "Wartung", "Vers.", "Steuer", "Bonus"].map((h) => (
                          <th key={h} style={{ textAlign: h ? "right" : "left", padding: "7px 6px", color: C.muted, fontWeight: 400 }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ergebnisse.map((e) => (
                        <tr key={e.id} style={{ borderBottom: `1px solid ${C.paper}` }}>
                          <td style={{ padding: "7px 6px", color: C.ink }}>{e.name}</td>
                          <td style={{ padding: "7px 6px", textAlign: "right" }}>{eur(e.wertverlust)}</td>
                          <td style={{ padding: "7px 6px", textAlign: "right" }}>{eur(e.energie)}</td>
                          <td style={{ padding: "7px 6px", textAlign: "right" }}>{eur(e.wartung)}</td>
                          <td style={{ padding: "7px 6px", textAlign: "right" }}>{eur(e.versicherung)}</td>
                          <td style={{ padding: "7px 6px", textAlign: "right" }}>{eur(e.steuer)}</td>
                          <td style={{ padding: "7px 6px", textAlign: "right", color: C.moss }}>
                            {e.zuschuss + e.thg > 0 ? "−" + eur(e.zuschuss + e.thg) : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p style={{ fontSize: 12, color: C.muted, marginTop: 10, lineHeight: 1.6 }}>
                  CO₂-Angaben nach ICCT-Methodik über den Lebenszyklus, inklusive Fahrzeug- und Batterieherstellung.
                  Wertverlust nach pauschaler Kurve je Antriebsart. Alle Angaben ohne Gewähr.
                </p>
              </details>
            </div>

            {/* CTA */}
            <div
              style={{
                marginTop: 18, background: C.surface, border: `1px solid ${C.line}`,
                borderRadius: 8, padding: "20px 22px",
              }}
            >
              {gesendet ? (
                <div>
                  <p style={{ fontSize: 15, color: C.ink, fontWeight: 500, margin: "0 0 6px" }}>
                    Anfrage aufgenommen
                  </p>
                  <p style={{ fontSize: 13.5, margin: 0, lineHeight: 1.6 }}>
                    Ein Fachbetrieb in Ihrer Region meldet sich. Sie können Ihre Einwilligung jederzeit widerrufen.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 15, color: C.ink, fontWeight: 500, margin: "0 0 5px" }}>
                    Angebot aus Ihrer Region einholen
                  </p>
                  <p style={{ fontSize: 13.5, margin: "0 0 14px", lineHeight: 1.6 }}>
                    Kostenlos und unverbindlich. Die Vermittlung finanziert diese Seite — Redaktion und Rechner
                    bleiben davon unabhängig.
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                    <input
                      value={plz} onChange={(e) => { setPlz(e.target.value); setFehler(""); }}
                      placeholder="80331" inputMode="numeric" aria-label="Postleitzahl"
                      style={{ ...inputCss, flex: "0 1 110px" }}
                    />
                    <input
                      value={mail} onChange={(e) => { setMail(e.target.value); setFehler(""); }}
                      placeholder="name@beispiel.de" type="email" aria-label="E-Mail-Adresse"
                      style={{ ...inputCss, flex: "1 1 190px" }}
                    />
                  </div>
                  <label style={{ display: "flex", gap: 9, fontSize: 12.5, lineHeight: 1.55, marginBottom: 12 }}>
                    <input
                      type="checkbox" checked={ok}
                      onChange={(e) => { setOk(e.target.checked); setFehler(""); }}
                      style={{ marginTop: 2, accentColor: C.moss }}
                    />
                    <span>
                      Meine Angaben dürfen an passende Fachbetriebe weitergegeben werden. Widerruf jederzeit
                      möglich, Löschung spätestens nach zwölf Monaten.
                    </span>
                  </label>
                  {fehler && (
                    <p style={{ fontSize: 12.5, color: "#A03232", margin: "0 0 10px" }}>{fehler}</p>
                  )}
                  <button
                    onClick={absenden}
                    style={{
                      padding: "10px 20px", fontSize: 14, fontFamily: SANS, color: "#fff",
                      background: C.moss, border: "none", borderRadius: 5, cursor: "pointer",
                    }}
                  >
                    Angebot anfordern
                  </button>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Weiterführend */}
        <section style={{ maxWidth: 660, marginTop: 52 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 21, fontWeight: 500, color: C.ink, margin: "0 0 16px" }}>
            Weiterlesen
          </h2>
          {[
            {
              t: "Wie klimaschädlich ist die Batterieherstellung wirklich?",
              d: "Die Spanne in der Forschung ist groß — woran das liegt und welche Zahlen belastbar sind.",
            },
            {
              t: "Förderung 2026: Wer bekommt wie viel?",
              d: "Der Sozialbonus in verständlich, mit den Grenzen und Fristen, die oft übersehen werden.",
            },
          ].map((a) => (
            <a
              key={a.t}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: "block", padding: "15px 0", borderTop: `1px solid ${C.line}`, textDecoration: "none",
              }}
            >
              <p style={{ margin: "0 0 4px", fontSize: 15.5, color: C.ink, fontWeight: 500 }}>{a.t}</p>
              <p style={{ margin: 0, fontSize: 13.5, color: C.muted, lineHeight: 1.55 }}>{a.d}</p>
            </a>
          ))}
        </section>

        <footer
          style={{
            marginTop: 44, paddingTop: 18, borderTop: `1px solid ${C.line}`,
            fontSize: 12, color: C.muted, lineHeight: 1.7, maxWidth: 660,
          }}
        >
          Prototyp mit Beispielwerten. Preise stammen im Betrieb aus Tankerkönig (Kraftstoff) und
          SMARD/Bundesnetzagentur (Strom), Wasserstoff redaktionell gepflegt. Alle Angaben ohne Gewähr.
        </footer>
      </main>
    </div>
  );
}
