import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { supabaseRequest } from "../../../lib/supabaseRest";

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

async function saveEnquiry({
  reference,
  name,
  email,
  whatsapp,
  destination,
  dates,
  travellers,
  travelStyle,
  budget,
  message,
}) {
  const existingCustomers = await supabaseRequest("customers", {
    query: `select=*&email=eq.${encodeURIComponent(email)}&limit=1`,
  });

  let customer = existingCustomers?.[0];

  if (!customer) {
    const customerId = crypto.randomUUID();
    const createdCustomers = await supabaseRequest("customers", {
      method: "POST",
      body: {
        id: customerId,
        name,
        email,
        phone: whatsapp === "Not provided" ? "" : whatsapp,
        language: "English",
        preference: travelStyle,
        notes: `Website enquiry ${reference}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });

    customer = createdCustomers?.[0] || { id: customerId, name };
  }

  const enquiryNotes = [
    `Website enquiry: ${reference}`,
    `Travel dates: ${dates}`,
    `Journey style: ${travelStyle}`,
    `Indicative budget: ${budget}`,
    `WhatsApp: ${whatsapp}`,
    `Message: ${message}`,
  ].join("\n");

  const parsedTravellers = Number.parseInt(travellers, 10);

  await supabaseRequest("reservations", {
    method: "POST",
    body: {
      id: reference,
      customer: name,
      customer_id: customer.id,
      journey: destination,
      travellers:
        Number.isFinite(parsedTravellers) && parsedTravellers > 0
          ? Math.min(parsedTravellers, 99)
          : 1,
      status: "Enquiry",
      total: 0,
      consultant: "Unassigned",
      notes: enquiryNotes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });
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
    const reference = createReference();
    const destination = clean(payload.destination, "Not specified");
    const dates = clean(payload.dates, "Flexible");
    const travellers = clean(payload.travellers, "Not specified");
    const travelStyle = clean(payload.travelStyle, "Not specified");
    const budget = clean(payload.budget, "Prefer not to say");
    const whatsapp = clean(payload.whatsapp, "Not provided");
    const message = clean(payload.message, "No additional message.");

    await saveEnquiry({
      reference,
      name,
      email,
      whatsapp,
      destination,
      dates,
      travellers,
      travelStyle,
      budget,
      message,
    });

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

    let emailDelivered = true;

    try {
      await sendEmail({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `[${reference}] New journey request — ${destination}`.slice(0, 180),
        text: adminText,
      });

      await sendEmail({
        from: FROM_EMAIL,
        to: [email],
        reply_to: TO_EMAIL,
        subject: `[${reference}] Your Imbondeiro journey request`,
        text: confirmationText,
      });
    } catch (emailError) {
      emailDelivered = false;
      console.error("Journey request email could not be delivered:", emailError);
    }

    return NextResponse.json({
      ok: true,
      reference,
      designer: DESIGNER_NAME,
      responseTime: RESPONSE_TIME,
      emailDelivered,
    });
  } catch (error) {
    console.error("Journey request failed:", error);
    return NextResponse.json({ error: "We could not deliver the email. Please continue on WhatsApp or try again shortly." }, { status: 502 });
  }
}
