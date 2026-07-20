import { NextResponse } from "next/server";

const TO_EMAIL = process.env.IMBONDEIRO_TO_EMAIL || "imbondeirotravel@gmail.com";
const FROM_EMAIL = process.env.IMBONDEIRO_FROM_EMAIL || "Imbondeiro Travel <onboarding@resend.dev>";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const clean = (value, fallback = "") => String(value || fallback)
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
  .trim().slice(0, 4000);

export async function POST(request) {
  try {
    const payload = await request.json();
    if (payload.website) return NextResponse.json({ ok: true });
    const name = clean(payload.name);
    const email = clean(payload.email).toLowerCase();
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || payload.consent !== true) {
      return NextResponse.json({ error: "Please complete your name, a valid email and consent." }, { status: 400 });
    }
    if (!RESEND_API_KEY) return NextResponse.json({ error: "Email delivery is not configured yet." }, { status: 503 });

    const destination = clean(payload.destination, "Not specified");
    const subject = `New journey request — ${destination}`.slice(0, 180);
    const body = [
      "NEW IMBONDEIRO TRAVEL REQUEST",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `WhatsApp: ${clean(payload.whatsapp, "Not provided")}`,
      `Destination / selections: ${destination}`,
      `Travel dates: ${clean(payload.dates, "Flexible")}`,
      `Travellers: ${clean(payload.travellers, "Not specified")}`,
      `Journey style: ${clean(payload.travelStyle, "Not specified")}`,
      `Indicative budget: ${clean(payload.budget, "Not specified")}`,
      "",
      "Message:",
      clean(payload.message, "No additional message."),
    ].join("\n");

    const headers = { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" };
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify({ from: FROM_EMAIL, to: [TO_EMAIL], reply_to: email, subject, text: body })
    });
    if (!resendResponse.ok) return NextResponse.json({ error: "Email delivery failed. Please try WhatsApp instead." }, { status: 502 });

    const confirmation = [
      `Dear ${name},`,
      "",
      "Thank you for contacting Imbondeiro Travel.",
      `We have received your journey request for: ${destination}.`,
      "A member of our team will review your preferences and contact you shortly.",
      "",
      "Project Imbondeiro · Crafted with passion for Angola and the world.",
    ].join("\n");
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers,
      body: JSON.stringify({ from: FROM_EMAIL, to: [email], reply_to: TO_EMAIL, subject: "We received your Imbondeiro journey request", text: confirmation })
    }).catch(() => null);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
