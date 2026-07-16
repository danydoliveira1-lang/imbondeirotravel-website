import { NextResponse } from "next/server";

const TO_EMAIL = process.env.IMBONDEIRO_TO_EMAIL || "imbondeirotravel@gmail.com";
const FROM_EMAIL = process.env.IMBONDEIRO_FROM_EMAIL || "Imbondeiro Travel <onboarding@resend.dev>";
const RESEND_API_KEY = process.env.RESEND_API_KEY;

const clean = (value, fallback = "") =>
  String(value || fallback)
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .trim()
    .slice(0, 8000);

export async function POST(request) {
  try {
    if (!RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 503 }
      );
    }

    const payload = await request.json();
    const subject = clean(payload.subject, "Imbondeiro Travel Request").slice(0, 180);
    const body = clean(payload.body, "A visitor submitted a request from the website.");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject,
        text: body
      })
    });

    if (!resendResponse.ok) {
      const details = await resendResponse.text();
      return NextResponse.json(
        { error: "Email delivery failed.", details },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
