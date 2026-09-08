# Kennzahlen-Extrakt: TUM White Paper "Defossilization, Not Decarbonization" (09/2026)

Interne Arbeitsgrundlage. Quelle: Fottner et al. (2026), DOI 10.14459/2026md1861116.
Verwendung: Kalibrierung der CO₂-Zielgröße im TCO-Rechner (Pflichtenheft Abschnitt 5.6).

## 1. Datenbasis der Studie

- 19 Studien, 47 modellierte Szenarien
- Auswahlkriterien: Ökobilanz von Pkw, möglichst Cradle-to-Grave, europäischer Kontext, ab 2020
- Alle Quellen attributiv; zwei mit konsequenziellen Elementen; die Hälfte mit prospektiven Elementen
- **Keine eigene harmonisierte Ökobilanz** — Literatursynthese. Folgestudie ab 2027 geplant.

## 2. Gesamt-Lebenszyklus je Antriebsart

| Antrieb | Mittel g CO₂-Äq./km | Mittel t CO₂-Äq. | n | Variationskoeffizient |
|---|---|---|---|---|
| Benzin (ICE-G) | 223 | 46 | 29 | ~15–18 % |
| Diesel (ICE-D) | 210 | 43 | 23 | ~15–18 % |
| Erdgas (ICE-CNG) | 193 | 41 | 14 | ~15–18 % |
| Hybrid (HEV) | 185 | 37 | 16 | ~16 % |
| Plug-in-Hybrid | 157 | 35 | 21 | ~27 % |
| Brennstoffzelle | 160 | 33 | 26 | ~60 % |
| Elektro (BEV) | 121 | 25 | 60 | ~43,5 % |

Bandbreiten: BEV 24–243 g/km · FCEV 39–456 g/km · PHEV 58–242 g/km

## 3. Minderung gegenüber Benziner (Referenz)

| Antrieb | Mittel | Bandbreite | Anteil mit Minderung |
|---|---|---|---|
| Diesel | −6 % | teils höher als Benzin | 22 % schlechter |
| Erdgas | −18 % | meist −11 bis −23 % | alle |
| Hybrid | ca. −15 % | ab −6 % | fast alle |
| Plug-in-Hybrid | −32 % | −9 bis −73 % | alle |
| **Elektro** | **−41 %** | **−89 bis +21 %** | **~92 %** |
| Brennstoffzelle | stark streuend | −79 bis +85 % | ~82 % |

## 4. Phasenanteile

**Produktion**
- Verbrenner: ~35 g/km, 5–9 t; 11–25 % des Lebenszyklus
- BEV: ~57 g/km, 7,8–26,2 t; Batterie im Mittel 54 % davon (Spanne 20–86 %)
- BEV vs. Benzin: +11 % bis Verdreifachung, ein Drittel der Ergebnisse bei +68 bis +87 %
- FCEV: ~41 g/km, 4,5–13,0 t

**Nutzung (Well-to-Wheel)**
- Verbrenner: ~80 % des Lebenszyklus (71–89 %)
- BEV: 6–77 %, Mittel 41 %; 4–177 g/km
- Wartung: 5–8 g/km (Verbrenner, 2–4 %), 4–7 g/km (BEV/FCEV); BEV-Vorteil −50 % bis −3 %

**End-of-Life**
- Nur 5 von 19 Quellen berichten explizit
- Verbrenner: 3,85–5,42 g/km, ca. 2 %
- BEV: −8,33 bis +5,77 g/km, je nach Allokationsmethode gutschreibend oder belastend
- Bessere Recyclingeffizienz: 5–10 % weniger Lebenszyklus-GWP bei BEV

## 5. Ergebnistreiber (für Tooltip-Texte relevant)

| Parameter | Wirkung |
|---|---|
| Amortisationsstrecke BEV | 6.000 – 60.000 km |
| Kipppunkt Strommix | ~600 g CO₂-Äq./kWh; EU-Schnitt 183; alle EU27 darunter |
| Fahrleistung +50.000 km | −10 bis −20 % GWP |
| Fahrleistung −50.000 km | +20 bis +30 % GWP |
| Fahrzeuggröße | bis +52 % (groß/schwer vs. klein/leicht) |
| WLTP vs. real | ~24 % GHG-Lücke, 18 % Verbrauchslücke; teils 30–40 % |
| PHEV E-Anteil | WLTP unterstellt ~84 %, real ~27 % |
| Lebensdauer-Annahme | 10–20 Jahre; Laufleistung 150.000–280.000 km |
| Statischer vs. dynamischer Strommix | bis +60 % BEV-Impact bei statischer Annahme |
| Marginaler Strommix (konsequenziell) | +41 % BEV-GWP, Vorteil sinkt um 34 % |
| Allokationsmethode EoL | bis 33 % Unterschied in der EoL-Phase |

## 6. Energieträger

**Wasserstoff (kg CO₂-Äq./kg H₂)**
- Grau (Erdgasreformierung): 11
- Grün (erneuerbare Elektrolyse): 2,02
- Netzstrom-Elektrolyse: 17,2 (schlechter als grau)
- Emissionsarmer H₂: unter 1 % des Weltangebots

**E-Fuels (Well-to-Wheel vs. fossil, Basis 268 g CO₂-Äq./km)**
- EU-Strommix 2023: E-Methan +42 %, E-Diesel +80 %
- Kohlestrom: +421 % bzw. +567 %
- Solar/Kernkraft/Wind: −73 bis −95 %
- Direkte Stromnutzung schlägt E-Fuels und H₂ in **allen sieben** Strom-Szenarien

**Wirkungsgrade**
- Direkte Batterienutzung: η ≈ 0,75
- E-Fuel-Pfad: η ≈ 0,14
- BEV braucht ~5× weniger Strom pro km als E-Fuel-Verbrenner

**Biokraftstoffe**
- FAME durch EN 590 auf 7 % Beimischung begrenzt
- HVO100 unbegrenzt beimischbar; bis ~93 % Einsparung (Altspeiseöl, RED III)
- Altspeiseöl deckt nur ~1 % des europäischen Feedstock-Potenzials
- KIT/DBFZ (BMW-finanziert): 38–55 % EU-Kraftstoffbedarf bis 2030, 67–107 % bis 2040

## 7. Materialhebel

- Stahl: 2–7 % des Lebenszyklus, aber großer Anteil der Produktionsphase
- Fossilfreier Stahl: >95 % weniger Emissionen der Stahlherstellung, bis −27 % Fahrzeugproduktion
- Sekundäraluminium: ~95 % weniger Energie
- Schrottstahl spart ~1,49 t Eisenerz und 0,5 t Kohle je Tonne
- Remanufacturing: 60–70 % weniger Energiebedarf, ~2/3 weniger GWP je Komponente
- Naturfasern statt Glasfaser: 24–40 % weniger
- Kunststoffe: 14–18 % der Fahrzeugmasse; Closed-Loop-Quote 3,1–4,8 % bis 2035 erreichbar, −29,5 % ggü. Verbrennung

## 8. Regulatorischer Kontext

- Regulierung (EU) 2019/631: −55 % bis 2030, −100 % bis 2035 (ggü. 2021); Strafe 95 €/g/km je Fahrzeug
- Artikel 7a: Lebenszyklus-Methodik; Frist 2023 und 2025 verstrichen; freiwillige Meldung seit 01.06.2026, bislang kein Hersteller bekannt
- Automotive Package 12/2025: Mehrjahres-Compliance 2030–2032, Kraftstoff- und Stahlgutschriften, 2035-Ziel faktisch −90 %, Super-Credit 1,3× für kleine E-Autos aus EU-Produktion
- Gutschriften decken **höchstens 10 %** der Minderungspflicht
- Ziel-Lücke 2030: ~80 statt ~188 Mio. t; 78 % Verbrennerbestand 2030
- Salini-Berichtsentwurf (EVP, 05/2026): neue VEEF-Kategorie, Kraftstoff-Gutschrift von 3 % auf 10 %

## 9. Für den Rechner abzugleichen

Die aktuell im Prototyp hinterlegten CO₂-Pauschalen sind gegen diese Werte zu prüfen und anzupassen:

- BEV-Betrieb bisher 58 g/km angesetzt — Studie nennt 4–177 g/km je nach Strommix, Mittel-WTW 41 % des Lebenszyklus
- Herstellungswerte (BEV 9.800 kg) gegen 7,8–26,2 t Bandbreite abgleichen
- Empfehlung: Bandbreite statt Punktwert ausweisen und Strommix nutzerseitig wählbar machen, da dieser Parameter das Ergebnis am stärksten bewegt
