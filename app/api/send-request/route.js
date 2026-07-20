import { NextResponse } from "next/server";
import crypto from "node:crypto";

const TO_EMAIL = process.env.IMBONDEIRO_TO_EMAIL || "imbondeirotravel@gmail.com";
const FROM_EMAIL = process.env.IMBONDEIRO_FROM_EMAIL || "Imbondeiro Travel <onboarding@resend.dev>";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const DESIGNER_NAME = process.env.IMBONDEIRO_JOURNEY_DESIGNER || "Daniela Nama D'Oliveira";
const RESPONSE_TIME = process.env.IMBONDEIRO_RESPONSE_TIME || "Within 24 hours";

const clean = (value, fallback = "") => String(value || fallback)
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
  .trim().slice(0, 4000);

function createReference(){
  const year = new Date().getUTCFullYear();
  const token = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `IT-${year}-${token}`;
}

async function sendEmail(payload){
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if(!response.ok){
    const detail = await response.text().catch(()=>"");
    throw new Error(detail || "Email delivery failed.");
  }
  return response.json().catch(()=>({}));
}

export async function POST(request) {
  try {
    const payload = await request.json();
    if (payload.website) return NextResponse.json({ ok: true });

    const name = clean(payload.name);
    const email = clean(payload.email).toLowerCase();
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || payload.consent !== true) {
      return NextResponse.json({ error: "Please complete your name, a valid email and consent." }, { status: 400 });
    }
    if (!RESEND_API_KEY) {
      return NextResponse.json({ error: "Email delivery still needs the RESEND_API_KEY in Vercel. Please use WhatsApp while it is being connected." }, { status: 503 });
    }

    const reference = createReference();
    const destination = clean(payload.destination, "Not specified");
    const dates = clean(payload.dates, "Flexible");
    const travellers = clean(payload.travellers, "Not specified");
    const travelStyle = clean(payload.travelStyle, "Not specified");
    const budget = clean(payload.budget, "Prefer not to say");
    const whatsapp = clean(payload.whatsapp, "Not provided");
    const message = clean(payload.message, "No additional message.");

    const adminText = [
      "NEW IMBONDEIRO TRAVEL REQUEST",
      `Reference: ${reference}`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `WhatsApp: ${whatsapp}`,
      `Destination / selections: ${destination}`,
      `Travel dates: ${dates}`,
      `Travellers: ${travellers}`,
      `Journey style: ${travelStyle}`,
      `Indicative budget: ${budget}`,
      "",
      "Message:",
      message,
      "",
      `Assigned Journey Designer: ${DESIGNER_NAME}`,
      `Target response time: ${RESPONSE_TIME}`,
    ].join("\n");

    await sendEmail({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      reply_to: email,
      subject: `[${reference}] New journey request — ${destination}`.slice(0, 180),
      text: adminText,
    });

    const confirmationText = [
      `Dear ${name},`,
      "",
      "Thank you for contacting Imbondeiro Travel.",
      "Your journey request has been received and will be reviewed personally.",
      "",
      `Reference: ${reference}`,
      `Journey: ${destination}`,
      `Travel dates: ${dates}`,
      `Travellers: ${travellers}`,
      `Journey style: ${travelStyle}`,
      "",
      `Your Journey Designer: ${DESIGNER_NAME}`,
      `Response time: ${RESPONSE_TIME}`,
      "",
      "We look forward to crafting your lifetime experience.",
      "",
      "Project Imbondeiro · Crafted with passion for Angola and the world.",
    ].join("\n");

    await sendEmail({
      from: FROM_EMAIL,
      to: [email],
      reply_to: TO_EMAIL,
      subject: `[${reference}] Your Imbondeiro journey request`,
      text: confirmationText,
    });

    return NextResponse.json({
      ok: true,
      reference,
      designer: DESIGNER_NAME,
      responseTime: RESPONSE_TIME,
    });
  } catch (error) {
    console.error("Journey request failed:", error);
    return NextResponse.json({ error: "We could not deliver the email. Please continue on WhatsApp or try again shortly." }, { status: 502 });
  }
}
