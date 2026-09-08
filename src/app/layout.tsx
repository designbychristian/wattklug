import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";

// next/font/google lädt die Schriftdateien beim Build selbst herunter und
// liefert sie vom eigenen Server aus (kein Laufzeit-Request an Google, keine
// IP-Übermittlung an fonts.googleapis.com) — bei einem client-seitigen
// Google-Fonts-Import wäre das nach deutscher Rechtsprechung ein
// DSGVO-Problem.
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const ibmPlexSerif = IBM_Plex_Serif({
  variable: "--font-ibm-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Wattklug — TCO-Vergleichsrechner Elektromobilität",
  description:
    "Vollkostenvergleich für Elektro, Benzin, Diesel, Plug-in-Hybrid und Brennstoffzelle — technologieoffen, mit offengelegten Annahmen.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${ibmPlexSans.variable} ${ibmPlexSerif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper text-body">{children}</body>
    </html>
  );
}
