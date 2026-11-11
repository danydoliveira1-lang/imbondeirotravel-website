
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Existing GET verification — preserved.
export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken =
    process.env.META_INSTAGRAM_VERIFY_TOKEN;

  if (!expectedToken) {
    return NextResponse.json(
      { error: "Webhook verification is not configured." },
      { status: 503 }
    );
  }

  if (
    mode !== "subscribe" ||
    !token ||
    token !== expectedToken ||
    challenge === null
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  return new Response(challenge, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

// Verify Meta's HMAC-SHA256 signature.
function verifyMetaSignature(rawBody, signature, appSecret) {
  if (!signature || !appSecret) return false;

  const match = /^sha256=([a-fA-F0-9]{64})$/.exec(signature);

  if (!match) return false;

  const expected = createHmac("sha256", appSecret)
    .update(rawBody)
    .digest();

  const received = Buffer.from(match[1], "hex");

  return (
    received.length === expected.length &&
    timingSafeEqual(received, expected)
  );
}

// Secure POST endpoint — no database writes yet.
export async function POST(request) {
  const appSecret = process.env.META_APP_SECRET;

  if (!appSecret) {
    return NextResponse.json(
      { error: "Webhook security is not configured." },
      { status: 503 }
    );
  }

  const signature = request.headers.get(
    "x-hub-signature-256"
  );

  // Limit the request size before processing.
  const contentLength = Number(
    request.headers.get("content-length")
  );

  if (
    Number.isFinite(contentLength) &&
    contentLength > 1024 * 1024
  ) {
    return new Response("Payload too large", { status: 413 });
  }

  let rawBody;

  try {
    rawBody = Buffer.from(await request.arrayBuffer());
  } catch {
    return new Response("Invalid request", { status: 400 });
  }

  if (rawBody.length > 1024 * 1024) {
    return new Response("Payload too large", { status: 413 });
  }

  if (!verifyMetaSignature(rawBody, signature, appSecret)) {
    return new Response("Forbidden", { status: 403 });
  }

  let event;

  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (
    !event ||
    typeof event !== "object" ||
    Array.isArray(event) ||
    event.object !== "instagram" ||
    !Array.isArray(event.entry)
  ) {
    return new Response("Unsupported event", { status: 400 });
  }

  // Phase 6.3E: authenticate only.
  // Do not write to Supabase or process messages yet.
  return NextResponse.json(
    {
      received: true,
      processing: "disabled",
    },
    {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    }
  );
}
