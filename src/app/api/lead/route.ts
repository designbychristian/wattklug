import { NextResponse } from "next/server";

const PLZ_MUSTER = /^\d{5}$/;
const MAIL_MUSTER = /^\S+@\S+\.\S+$/;

// Validiert eine Lead-Anfrage (Pflichtenheft 7.1/8), speichert sie aber
// bewusst noch nicht: die schriftliche Vereinbarung mit dem Pilotpartner zu
// Vergütung und Datenübermittlung steht laut Pflichtenheft 11/12 noch aus,
// und die Persistenz (Supabase, PostgreSQL, EU-Hosting, automatische
// Löschung nach 6–12 Monaten gemäß Pflichtenheft 8.3) ist nicht angebunden.
// Ohne beides dürfen keine echten Nutzerdaten produktiv verarbeitet oder
// weitergegeben werden — dieser Endpunkt verwirft PLZ und E-Mail nach der
// Validierung, statt sie andernorts unvollständig/unsicher abzulegen.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ fehler: [{ feld: "body", meldung: "Kein gültiges JSON." }] }, { status: 400 });
  }

  const b = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const fehler: { feld: string; meldung: string }[] = [];

  if (typeof b.plz !== "string" || !PLZ_MUSTER.test(b.plz)) {
    fehler.push({ feld: "plz", meldung: "Bitte eine fünfstellige Postleitzahl angeben." });
  }
  if (typeof b.mail !== "string" || !MAIL_MUSTER.test(b.mail)) {
    fehler.push({ feld: "mail", meldung: "Bitte eine gültige E-Mail-Adresse angeben." });
  }
  if (b.einwilligung !== true) {
    fehler.push({ feld: "einwilligung", meldung: "Einwilligung zur Weitergabe ist erforderlich." });
  }

  if (fehler.length > 0) {
    return NextResponse.json({ fehler }, { status: 400 });
  }

  return NextResponse.json({ status: "angenommen" });
}
