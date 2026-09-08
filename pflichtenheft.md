# Anforderungsspezifikation: TCO-Vergleichsrechner Elektromobilität

Version 0.1 (Entwurf) · Stand 06.09.2026 · Projekt Wattklug

> Markdown-Fassung für das Repository. Die formatierte Word-Fassung (`Pflichtenheft_TCO_Rechner_Elektromobilitaet.docx`) ist inhaltsgleich und für die Weitergabe außerhalb der Entwicklung gedacht. Bei Abweichungen gilt diese Datei, weil sie versioniert ist.

---

## 1. Einleitung

### 1.1 Zweck

Dieses Dokument beschreibt die fachlichen, funktionalen, technischen und rechtlichen Anforderungen an das erste produktive Modul der Plattform: einen webbasierten Vollkostenvergleichsrechner (Total Cost of Ownership) für unterschiedliche Fahrzeugantriebsarten. Es dient als Arbeitsgrundlage für Konzeption, Umsetzung und Qualitätssicherung und dokumentiert die getroffenen Annahmen so, dass sie fachlich überprüfbar und reproduzierbar sind.

### 1.2 Geltungsbereich

Nur das Modul TCO-Vergleichsrechner im Themenschwerpunkt Elektromobilität. Weitere geplante Module (Ladekosten-Rechner, Reichweiten- und Ladezeit-Rechner, Förderungs-Finder, Modellvergleich) sowie die spätere Erweiterung um Gebäudeenergieeffizienz werden separat spezifiziert.

### 1.3 Kontext

Zweistufiges Geschäftsmodell: organische Reichweite durch kostenfreie, hochwertige Informationsangebote und interaktive Tools, Monetarisierung durch Vermittlung qualifizierter Leads. Interaktive Rechner sind der primäre Lead-Mechanismus.

---

## 2. Zielsetzung und Stakeholder

### 2.1 Ziele

- Objektive, nachvollziehbare Entscheidungsgrundlage für den Antriebsvergleich bieten
- Hohe organische Sichtbarkeit durch Kombination aus Tool und begleitendem Content
- Qualifizierte Leads für kooperierende Anbieter generieren
- Fachliche Aussagen auf überprüfbaren Quellen und offengelegten Annahmen aufbauen
- Erlöse ausschließlich zur Finanzierung von Transparenzarbeit und unabhängiger Redaktion einsetzen, ohne die inhaltliche Neutralität zu beeinträchtigen (siehe 7.7)

### 2.2 Zielgruppen

- Primär: Privatpersonen in der Kaufentscheidungsphase
- Sekundär: bestehende E-Fahrzeug-Halter mit Interesse an Ladeinfrastruktur
- Intern: Kooperationspartner, die Leads erhalten

### 2.3 Kooperationspartner (Pilotphase)

Kooperation mit einem Autohaus in Bayern (VW, Audi, SEAT, Cupra, Škoda). Konditionen zu Lead-Volumen, Vergütungsmodell und Datenübermittlung sind noch nicht schriftlich fixiert (offener Punkt, Abschnitt 12). Daraus folgt ein regionaler Schwerpunkt Bayern und eine inhaltliche Nähe zu VW-Konzernmodellen, ohne den Rechner als Werbefläche zu gestalten.

---

## 3. Funktionale Anforderungen

### 3.1 Vergleichsumfang

Fünf Antriebsarten gleichzeitig: BEV, Benzin, Diesel, Hybrid/PHEV, FCEV sowie H2ICE.

Für FCEV und H2ICE bestehen in Deutschland geringe Modellverfügbarkeit und ein dünnes Tankstellennetz. Ergebnisse für diese Antriebsarten erhalten eine sichtbare Datenqualitäts-Kennzeichnung (7.2).

### 3.2 Betrachtungszeitraum

Schieberegler, 1 bis 15 Jahre, Startwert 6 Jahre.

### 3.3 Eingabetiefe

- **Stufe 1 (Schnellergebnis):** Fahrzeugmodell bzw. -klasse und Jahreskilometer als Pflichteingaben, alle übrigen Parameter mit begründeten Standardwerten vorbelegt
- **Stufe 2 (aufklappbar):** Strom- und Kraftstoffpreis, Fahrprofil, Versicherungsprämie, Wartungskosten, Einkommensklasse, Preissteigerungsannahme

### 3.4 Fahrzeugauswahl

Gepflegte Datenbank für marktrelevante Modelle (Verbrauch, Kaufpreis, Wartungskostenprofil). Für nicht gelistete Modelle und grundsätzlich für FCEV/H2ICE Fallback auf generische Klassenwerte, vom Nutzer anpassbar.

---

## 4. Berechnungsmethodik

| Komponente | Datenquelle | Anmerkung |
|---|---|---|
| Anschaffung (netto) | Datenbank / Nutzereingabe | nach Abzug der Förderung |
| Förderung | Sozialer Klimabonus 2026 | Einkommensklasse per Dropdown |
| Energiekosten | Tankerkönig, SMARD/BNetzA, H₂ manuell | optional mit Preissteigerung |
| Wertverlust | Pauschalkurve je Antriebsart | vereinfachtes Modell |
| Wartung | Datenbank, modellabhängig | Fallback Klassenwerte |
| Versicherung | Pauschalschätzung, überschreibbar | ohne SF-Klasse/Region |
| Kfz-Steuer | gesetzliche Formel (Hubraum/CO₂) | BEV bis 2035 befreit |
| THG-Quote | redaktioneller Schätzwert | nur BEV, mindernd |
| Vignetten | Nutzereingabe | optional |
| CO₂-Preis (BEHG) | im Kraftstoffpreis enthalten | kein eigener Posten |

### 4.1 Anschaffungskosten

Netto = Bruttokaufpreis − Förderbetrag. Bruttokaufpreis aus der Datenbank oder Nutzereingabe.

### 4.2 Förderung

Seit Mai 2026 sozial gestaffelte Förderung für Neufahrzeuge: Basis 3.000 € (BEV) bzw. 1.500 € (PHEV/REEV), zzgl. Sozial- und Kinderbonus bis max. 6.000 €, Einkommensgrenze 80.000 € bzw. 90.000 € zvE, Mindesthaltedauer 36 Monate. Der Nutzer wählt eine grobe Einkommensklasse; die Zuordnung ist redaktionell hinterlegt und wie in 9.6 zu versionieren, da sich das Förderregime kurzfristig ändern kann.

### 4.3 Energiekosten

```
Energiekosten = (Verbrauch/100km × Jahres-km ÷ 100) × Energiepreis × Jahre
```

Standard: konstanter Preis über die Laufzeit (heutiger API-Wert). Optional nutzerdefinierte jährliche Steigerungsrate, exponentiell auf den Ausgangspreis angewendet.

### 4.4 Wertverlust

```
Restwert(n) = Kaufpreis × Wertverlustkurve(Antriebsart, n)
Wertverlustkosten = Kaufpreis − Restwert(Betrachtungsjahr)
```

MVP: vereinfachte Pauschalkurve je Antriebsart, Richtwert −25 % im ersten Jahr, danach −12 % p. a. auf den jeweiligen Restwert.

### 4.5 Wartung

Summe der modellspezifisch hinterlegten Jahreswerte über den Betrachtungszeitraum. Ohne Modelleintrag Rückgriff auf Klassenwert.

### 4.6 Versicherung

Jahresprämie (Schätzwert je Klasse/Antriebsart) × Jahre. In Stufe 2 überschreibbar.

### 4.7 Kfz-Steuer

Für Verbrenner (Benzin, Diesel, Hybrid, H2ICE) die reguläre gesetzliche Formel aus Hubraum und CO₂-Ausstoß. BEV sind bis 2035 befreit. Für FCEV ist die Behandlung analog zu BEV zu prüfen und redaktionell zu hinterlegen.

### 4.8 THG-Quote

Für BEV ein redaktionell gepflegter pauschaler Jahres-Erlös (Richtgröße 150–200 €) als kostenmindernde Größe, gekennzeichnet als Marktpreis-Schätzung, regelmäßig zu aktualisieren.

### 4.9 Auslands-Vignetten

In Deutschland existiert keine Pkw-Maut (Vorhaben 2019 gerichtlich untersagt, nie eingeführt). Optionales Zusatzfeld für Vielfahrer mit Auslandsbezug, fließt nur bei expliziter Eingabe ein.

### 4.10 CO₂-Preis (BEHG)

Der nationale CO₂-Preis (2026: Korridor 55–65 €/t) ist bereits in den Tankerkönig-Preisen enthalten. Kein separater Posten, sondern Tooltip an der Energiekosten-Position — sonst Doppelzählung.

### 4.11 Gesamtformel

```
TCO(Antrieb, n) = Anschaffung(netto)
                + Energiekosten
                + Wertverlust
                + Wartung
                + Versicherung
                + Kfz-Steuer
                + Vignetten (optional)
                − THG-Erlös (nur BEV)
```

---

## 5. Zielgrößen und Ergebnisdarstellung

- **5.1 Gesamtkosten:** Balkendiagramm über alle fünf Antriebsarten am Ende des Zeitraums, primäre Ansicht
- **5.2 Kosten je Kilometer:** TCO ÷ (Jahres-km × Jahre), in Cent/km
- **5.3 Jährlicher Cashflow:** kumulierte Kosten je Jahr, Grundlage der Break-even-Berechnung
- **5.4 Break-even:** paarweise gegen BEV, prominent als Text-Badge ("Ab Jahr X günstiger als …") neben dem Diagramm
- **5.5 Verbrauch:** kWh/100 km, l/100 km, kg H₂/100 km — prominent, nicht nur intern
- **5.6 CO₂-Bilanz:** Lebenszyklus (Well-to-Wheel inkl. Batterieproduktion) nach ICCT-Methodik, Strommix ergänzend nach UBA. Wegen der methodischen Bandbreite im Tool offenzulegen und als Schätzgröße zu kennzeichnen.

---

## 6. Datenmodell (konzeptionell)

| Entität | Zweck | Attribute (Auszug) |
|---|---|---|
| Fahrzeug | Modellstammdaten | Modell, Antriebsart, Verbrauch, Kaufpreis, Wartungsprofil |
| Fahrzeugklasse | Fallback ohne Modellbezug | Klasse, Antriebsart, generische Werte |
| Preisdaten-Cache | externe Live-Preise | Energieträger, Preis, Zeitstempel, Quelle |
| Förderregelwerk | aktuelles Programm | Einkommensklasse, Fördersatz, Gültigkeit |
| Steuersätze | Kfz-Steuer-Grundlage | Hubraum-/CO₂-Staffel, Gültigkeit |
| Emissionsfaktoren | CO₂-Lebenszyklus | Antriebsart, Faktor, Quelle, Version |
| Berechnungsversion | Nachvollziehbarkeit | Version, Gültigkeitsdatum, referenzierte Regelwerke |
| Lead | Nutzeranfrage | PLZ, E-Mail, Zeitstempel, Löschfrist, Status |

---

## 7. Nutzerführung und Interaktionskonzept

### 7.1 Call-to-Action

Unmittelbar nach dem Ergebnis erscheint "Jetzt unverbindliches Angebot einholen". Das Formular erfasst im MVP ausschließlich PLZ und E-Mail. Eine explizite, **nicht vorangekreuzte** Einwilligung zur Weitergabe ist zwingend.

### 7.2 Transparenz

Jede Annahme (Preisquelle, Wertverlustkurve, Förderregel, Emissionsfaktor) wird per Tooltip oder Fußnote direkt am Ergebnisbestandteil offengelegt. Für FCEV und H2ICE zusätzlich sichtbarer Hinweis auf eingeschränkte Datenqualität.

### 7.3 Seitenstruktur

Der Rechner ist in eine Ratgeber-Landingpage eingebettet. Reihenfolge von oben nach unten:

1. Einleitender Ratgeber-Artikel zu TCO-Konzept und Methodik
2. Der Rechner (Eingabe und Ergebnis)
3. Lead-CTA
4. Zwei weiterführende Ratgeber-Artikel

### 7.4 Interaktionsfluss

Zweistufiges Eingabemodell nach 3.3. Desktop: Eingabe links, Ergebnis live rechts. Mobil: untereinander.

### 7.5 Visuelle Gestaltung

Grün-nachhaltige Farbwelt mit Naturfarben. Das Logo greift bewusst **nicht** ein Blatt- oder Naturmotiv auf, sondern eine Formsprache individueller Mobilität (Lenkrad, Rad, Bewegungslinie).

### 7.6 Wireframe (Schema, mobil)

```
┌──────────────────────────────────────────────┐
│ Header — Logo (Mobilitäts-Icon) · Menü       │
├──────────────────────────────────────────────┤
│ Artikel-Teaser — einleitender Ratgeber       │
├──────────────────────────────────────────────┤
│ Rechner – Eingabe                            │
│   Modell · Jahres-km · Zeitraum-Slider       │
│   [ Erweiterte Angaben ▾ ]                   │
├──────────────────────────────────────────────┤
│ Rechner – Ergebnis                           │
│   Balken (5 Antriebe) · ct/km · Break-even   │
├──────────────────────────────────────────────┤
│ Lead-CTA — PLZ + E-Mail                      │
├──────────────────────────────────────────────┤
│ Artikelliste — zwei weiterführende Artikel   │
└──────────────────────────────────────────────┘
```

Desktop: die beiden Rechner-Blöcke ab definierter Breite zweispaltig nebeneinander, übrige Blöcke vollbreit und in gleicher Reihenfolge.

### 7.7 Redaktionelle und wirtschaftliche Grundhaltung

Die Erlöse aus der Lead-Vermittlung dienen ausschließlich der Finanzierung des Gemeinwohlzwecks: Erzeugung von Transparenz und unabhängige, wissenschaftlich fundierte Redaktionsarbeit. Monetarisierung ist Mittel zum Zweck, nicht Selbstzweck. Sie darf inhaltliche Neutralität, Technologieoffenheit und wissenschaftliche Sorgfalt zu keinem Zeitpunkt einschränken oder verzerren. Auch dort, wo die CTA aus Konversionsgründen sichtbar platziert wird (7.1), sind Aufdringlichkeit, irreführende Gestaltung und reißerische Sprache ausgeschlossen.

---

## 8. Lead-Generierung

- **8.1 Erfassung:** bundesweit, unabhängig vom aktuellen Partnernetzwerk
- **8.2 Matching:** bayerische PLZ direkt an den Pilotpartner; übrige werden bis zum Aufbau weiterer Partnerschaften vorgehalten. Die Einwilligung muss diesen Zweck (spätere Vermittlung an noch nicht feststehende Partner) explizit abdecken.
- **8.3 Speicherfristen:** automatisierte Löschung nach 6 bis 12 Monaten gemäß Art. 5 Abs. 1 lit. e DSGVO, sofern keine Vermittlung stattgefunden hat

---

## 9. Technische Architektur

- **9.1 Frontend:** Next.js (React, TypeScript) mit Tailwind CSS, SSR/SSG für SEO
- **9.2 Backend:** Berechnungslogik **serverseitig** als API-Route. Jede Eingabeänderung löst eine neue Berechnung aus. Zentrale Kontrolle über Annahmen und einfachere Versionierung, zulasten der Latenz.
- **9.3 Datenquellen:** Kraftstoff über Tankerkönig, Strom über Bundesnetzagentur/SMARD, Wasserstoff mangels API redaktionell. Kein Live-Abruf pro Anfrage — tägliche bzw. wöchentliche Aktualisierung mit Cache.
- **9.4 Persistenz:** PostgreSQL (z. B. Supabase) für Stammdaten, Preis-Cache, Regelwerke und Leads, EU-Hosting.
- **9.5 Tests:** automatisierte Unit-Tests für **jede** Formel und Kostenkomponente aus Abschnitt 4.
- **9.6 Versionierung:** alle veränderlichen Annahmen versioniert. Jede Berechnung referenziert einen sichtbaren Berechnungsstand (Datum/Version), sodass Ergebnisse reproduzierbar sind.

---

## 10. Nicht-funktionale Anforderungen

- **10.1 Barrierefreiheit:** im MVP kein formaler Standard. Bewusst akzeptiertes Risiko, da das BFSG seit Juni 2025 für digitale Verbraucherdienstleistungen mit Vertragsanbahnung gilt. Nachrüstung auf WCAG 2.1 AA spätestens vor der Skalierung empfohlen.
- **10.2 Performance:** Caching (9.3) soll trotz serverseitiger Berechnung (9.2) akzeptable Antwortzeiten sichern. Konkrete Zielwerte vor Entwicklungsbeginn festzulegen.
- **10.3 Datenschutz:** Verarbeitung nur auf Grundlage expliziter, granularer Einwilligung; automatisierte Löschung (8.3); TLS; Datenminimierung durch minimales Formular (7.1).

---

## 11. Rechtliche Rahmenbedingungen

- Impressumspflicht und Datenschutzerklärung nach TMG/DSGVO
- Keine vorangekreuzten Einwilligungs-Checkboxen
- Disclaimer "ohne Gewähr" mit Datenstand, besonders bei Förder- und Steuerinformationen
- Korrekte Darstellung, dass in Deutschland keine Pkw-Maut existiert
- Schriftliche Vereinbarung mit dem Kooperationspartner zu Vergütung und Datenübermittlung vor Aufnahme des produktiven Lead-Flusses

---

## 12. Offene Punkte

- Konditionen mit dem Kooperationspartner (Lead-Kapazität, Vergütungsmodell)
- Konkrete Performance-Zielwerte
- UVP- und WLTP-Werte für 12 der 13 Modelle
- Vor Skalierung: Barrierefreiheit nach BFSG nachrüsten
- CO₂-Pauschalen gegen die TUM-Kennzahlen abgleichen (Bandbreite statt Punktwert, Strommix als Nutzereingabe)

---

## 13. Referenzen

- BMWK: Förderprogramm "Sozialer Klimabonus für E-Autos", gültig seit Mai 2026
- Umweltbundesamt: Emissionsfaktoren und BEHG-Preispfad, Stand 2026
- ICCT: Lifecycle-Analysen zu Treibhausgasemissionen verschiedener Antriebsarten
- Bundesnetzagentur / SMARD: Marktdaten Strompreise
- Tankerkönig: API für Kraftstoffpreise
- Barrierefreiheitsstärkungsgesetz (BFSG), in Kraft seit 28.06.2025
- Kraftfahrzeugsteuergesetz (KraftStG), Steuerbefreiung für reine E-Fahrzeuge bis 2035
- Fottner et al. (2026): *Defossilization, Not Decarbonization.* TUM White Paper, DOI 10.14459/2026md1861116
