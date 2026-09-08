# Wattklug — Projektanweisung

Diese Datei gehört ins Repository-Root. Sie fasst alle bisher getroffenen Entscheidungen zusammen, damit jede Arbeitssitzung ohne Rückfragen anschlussfähig ist.

## Was das ist

Wattklug (wattklug.de) ist eine Informationsplattform für nachhaltige Mobilität und Gebäudeenergieeffizienz. Erste Ausbaustufe: Elektromobilität. Später folgen Photovoltaik, Wärmepumpen und elektrische Warmwasserbereitung.

Das erste produktive Modul ist ein **TCO-Vergleichsrechner** — eine Vollkostenrechnung über fünf Antriebsarten.

## Redaktionelle Grundhaltung

Diese Haltung ist bei jeder Design- und Implementierungsentscheidung leitend:

- **Wissenschaftlich belegbar.** Jede Zahl braucht eine Quelle. Lieber eine Lücke offen lassen als einen plausibel klingenden Wert erfinden.
- **Technologieoffen.** Kein Antrieb wird bevorzugt dargestellt. Keine Ampelfarben in Diagrammen, keine wertende Sprache. Die Zahlen sollen sprechen.
- **Transparent.** Jede Annahme ist im Tool sichtbar, nicht im Impressum versteckt.
- **Für Laien verständlich.** Fachbegriffe werden erklärt, nicht vorausgesetzt.

Ziel ist, eine politisch aufgeladene Debatte zu versachlichen. Erlöse aus der Lead-Vermittlung finanzieren die Redaktionsarbeit — sie dürfen die inhaltliche Neutralität nie beeinflussen.

## Technischer Stack

| Bereich | Entscheidung |
|---|---|
| Framework | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Berechnung | **Serverseitig** als API-Route, nicht im Client |
| Datenbank | PostgreSQL (Supabase), EU-Hosting |
| Tests | Unit-Tests für **jede** Kostenkomponente, verpflichtend |
| Analytics | Plausible oder Matomo, nicht Google Analytics |

Die serverseitige Berechnung ist eine bewusste Entscheidung zugunsten zentraler Kontrolle über Annahmen und deren Versionierung — trotz höherer Latenz.

## Der TCO-Rechner

### Umfang
Fünf Antriebsarten gleichzeitig: BEV, Benzin, Diesel, Hybrid/PHEV, FCEV (H2ICE nachrangig). Für FCEV und H2ICE existiert im VW-Konzern kein Serienmodell — hier nur generische Klassenwerte mit sichtbarer Datenqualitäts-Kennzeichnung.

### Eingabe
Zweistufig. Stufe 1: Fahrzeugmodell/-klasse, Jahreskilometer, Haltedauer per Slider (1–15 Jahre, Start 6). Stufe 2 aufklappbar: Energiepreise, Einkommensklasse, Versicherung, Preissteigerung.

### Kostenkomponenten

```
TCO = Anschaffung (netto)
    + Energiekosten
    + Wertverlust
    + Wartung
    + Versicherung
    + Kfz-Steuer
    + optionale Auslands-Vignetten
    − THG-Quoten-Erlös (nur BEV)
```

Details:
- **Anschaffung**: Hersteller-UVP brutto, ohne Ausstattungspauschale, minus Förderung
- **Förderung**: Sozialer Klimabonus seit 05/2026 — Basis 3.000 € BEV / 1.500 € PHEV, plus Sozial- und Kinderbonus bis max. 6.000 €, Einkommensgrenze 80.000/90.000 € zvE, Mindesthaltedauer 36 Monate. Nutzer wählt grobe Einkommensklasse per Dropdown.
- **Energie**: Verbrauch/100 km × Jahres-km ÷ 100 × Preis × Jahre. Standard: konstanter Preis. Optional nutzerdefinierte Steigerung, exponentiell.
- **Wertverlust**: Pauschalkurve je Antriebsart, redaktionell gepflegt (Richtwert −25 % Jahr 1, danach −12 % p. a. auf Restwert)
- **Wartung**: modellspezifisch aus der Fahrzeugdatenbank, bei 15.000 km/Jahr, Reifen enthalten
- **Versicherung**: Pauschale je Klasse, nicht modellspezifisch, im Tool überschreibbar
- **Kfz-Steuer**: echte gesetzliche Formel aus Hubraum und CO₂. BEV bis 2035 befreit.
- **THG-Quote**: redaktioneller Schätzwert, Richtgröße 150–200 €/Jahr, nur BEV
- **CO₂-Preis BEHG**: **kein eigener Posten.** Bereits im Tankerkönig-Preis enthalten. Nur als Tooltip erklären, sonst Doppelzählung.
- **Pkw-Maut**: existiert in Deutschland nicht. Nur optionales Feld für Auslands-Vignetten.

### Ausgabe
- Balkendiagramm Gesamtkosten über alle fünf Antriebsarten
- Cent pro Kilometer
- Jährlicher kumulierter Kostenverlauf
- Break-even paarweise gegen BEV, prominent als Badge ("Ab Jahr X günstiger als Diesel")
- Verbrauch prominent (kWh/100 km, l/100 km, kg H₂/100 km)
- Lebenszyklus-CO₂ nach ICCT-Methodik, Strommix nach UBA

## Datenquellen

| Träger | Quelle | Rhythmus |
|---|---|---|
| Kraftstoff | Tankerkönig-API | täglich, gecacht |
| Strom | Bundesnetzagentur / SMARD | täglich, gecacht |
| Wasserstoff | redaktionell | monatlich manuell |

Keine Live-Abfrage pro Nutzeranfrage — immer aus dem Cache.

**Rechtlicher Hinweis:** ADAC- und DAT-Kostendaten sind urheberrechtlich geschützt und dürfen nicht übernommen oder gescrapt werden. Sie taugen nur als Plausibilitätsabgleich. Primärquellen sind Hersteller-Preislisten und -Datenblätter sowie GDV-Typklassen.

## Versionierung der Annahmen

Alle veränderlichen Annahmen (Steuersätze, Förderregeln, Emissionsfaktoren, Wertverlustkurven) werden versioniert abgelegt. Jede Berechnung referenziert einen sichtbaren Berechnungsstand mit Datum und Version. Ergebnisse müssen zu einem bestimmten Zeitpunkt reproduzierbar sein.

## Lead-Generierung

- CTA direkt unter dem Ergebnis
- Formular erfasst **nur PLZ und E-Mail**
- Einwilligung zur Weitergabe explizit und **nicht vorangekreuzt**; sie muss auch die spätere Vermittlung an noch nicht feststehende Partner abdecken
- Erfassung bundesweit. Bayerische PLZ gehen an den Pilotpartner (Autohaus mit VW, Audi, Seat, Cupra, Škoda), übrige werden vorgehalten.
- Automatische Löschung nach 6–12 Monaten (DSGVO Art. 5 Abs. 1 lit. e)

## UI

Reihenfolge der Seite: Header → einleitender Ratgeber-Artikel → Rechner-Eingabe → Ergebnis → Lead-CTA → zwei weiterführende Artikel.

Desktop: Eingabe links, Ergebnis rechts. Mobil: untereinander.

Farbwelt grün-nachhaltig mit Naturtönen. Logo greift **individuelle Mobilität** auf (Lenkrad, Rad, Bewegungslinie) — bewusst **kein** Blatt- oder Naturmotiv.

Im Diagramm ist nur BEV farblich hervorgehoben, alle anderen neutral grau. Das ist Absicht: eine Farbcodierung nach "gut/schlecht" würde der Technologieoffenheit widersprechen.

## Fahrzeugdatenbank

13 Modelle in der ersten Ausbaustufe (VW und Cupra), je eine gängige Basisvariante. Kombination aus Modelldatenbank und Klassenwerten als Fallback.

Pflichtfelder je Modell: Marke, Modell, Variante, Antriebsart, Klasse, UVP, Preisstand, WLTP-Verbrauch, CO₂ g/km, Hubraum, Batterie netto, Wartung €/Jahr, **Quelle und Abrufdatum**.

Nicht modellspezifisch: Versicherung, Wertverlust, Kfz-Steuer-Betrag, CO₂-Lebenszyklus.

## Bewusst akzeptierte Risiken

- **Barrierefreiheit:** Im MVP kein WCAG 2.1 AA. Das BFSG gilt seit Juni 2025 für Verbraucherdienste mit Vertragsanbahnung. Vor Skalierung nachrüsten.
- **Performance:** Konkrete Zielwerte noch nicht definiert.

## Offene Punkte

- Konditionen mit dem Pilotpartner (Lead-Volumen, Vergütung, schriftliche Vereinbarung zur Datenübermittlung) — muss vor dem ersten produktiven Lead geklärt sein
- UVP- und WLTP-Werte für 12 der 13 Modelle fehlen noch
- CO₂-Pauschalen im Prototyp sind zu grob. Die TUM-Studie zeigt für den BEV-Betrieb 4–177 g/km je nach Strommix. Empfehlung: Strommix als Nutzereingabe, CO₂ als Bandbreite statt Punktwert.

## Dokumente im Repository

```
docs/
  pflichtenheft.md              vollständige Anforderungsspezifikation (maßgeblich)
  kennzahlen-tum-studie.md      Kennzahlen für die CO2-Kalibrierung
data/
  fahrzeuge.csv                 13 Modelle, Quellenspalte, offene Felder leer
  pauschalen.csv                Wertverlust, Versicherung, THG, CO2 je Antriebsart
  energiepreise.csv             Startwerte, Quellen, Aktualisierungsrhythmus
content/
  artikel-tum-defossilisierung.md   erster Ratgeber-Artikel
prototype/
  tco-rechner-prototyp.jsx      UI-Referenz mit Beispieldaten, nicht produktiv
```

Die Word- und Excel-Fassungen (`Pflichtenheft_TCO_Rechner_Elektromobilitaet.docx`, `Fahrzeugdatenbank_VW_Cupra.xlsx`) sind inhaltsgleich und für die Weitergabe außerhalb der Entwicklung gedacht. Sie gehören **nicht** ins Repository — Binärformate lassen sich nicht sinnvoll versionieren. Bei Abweichungen gelten die Markdown- und CSV-Fassungen.

Die CSV-Dateien sind der redaktionelle Arbeitsstand, nicht das Produktionsschema. Sie werden beim Aufbau der Datenbank importiert; leere Felder sind bewusst leer und dürfen nicht mit Schätzwerten gefüllt werden.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
