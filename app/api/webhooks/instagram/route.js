
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BODY_BYTES = 1024 * 1024;
const MAX_MESSAGE_LENGTH = 10000;

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

// Existing HMAC-SHA256 verification — preserved.
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

// Extract only supported incoming text messages.
// No customer information is written to the database.
function extractInstagramMessages(event) {
  const messages = [];
  const seenMessageIds = new Set();

  let inspected = 0;
  let ignored = 0;

  for (const entry of event.entry) {
    if (
      !entry ||
      typeof entry !== "object" ||
      !Array.isArray(entry.messaging)
    ) {
      continue;
    }

    for (const item of entry.messaging) {
      inspected += 1;

      if (!item || typeof item !== "object") {
        ignored += 1;
        continue;
      }

      const senderId = item.sender?.id;
      const recipientId = item.recipient?.id;
      const messageId = item.message?.mid;
      const messageText = item.message?.text;

      const isValid =
        typeof senderId === "string" &&
        senderId.length > 0 &&
        senderId.length <= 255 &&
        typeof recipientId === "string" &&
        recipientId.length > 0 &&
        typeof messageId === "string" &&
        messageId.length > 0 &&
        messageId.length <= 255 &&
        typeof messageText === "string" &&
        messageText.trim().length > 0 &&
        messageText.length <= MAX_MESSAGE_LENGTH &&
        item.message?.is_echo !== true &&
        senderId !== recipientId &&
        !seenMessageIds.has(messageId);

      if (!isValid) {
        ignored += 1;
        continue;
      }

      seenMessageIds.add(messageId);

      messages.push({
        source: "instagram",
        status: "new",
        customer_name: "Instagram customer",
        customer_email: null,
        customer_phone: null,
        subject: "Instagram Direct Message",
        message: messageText.trim(),
        external_message_id: messageId,
        external_thread_id: senderId,
      });
    }
  }

  return {
    messages,
    inspected,
    ignored,
  };
}

function jsonResponse(body, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request) {
  const appSecret = process.env.META_APP_SECRET;

  if (!appSecret) {
    return jsonResponse(
      { error: "Webhook security is not configured." },
      503
    );
  }

  const signature = request.headers.get(
    "x-hub-signature-256"
  );

  const contentLength = Number(
    request.headers.get("content-length")
  );

  if (
    Number.isFinite(contentLength) &&
    contentLength > MAX_BODY_BYTES
  ) {
    return new Response("Payload too large", {
      status: 413,
    });
  }

  let rawBody;

  try {
    rawBody = Buffer.from(await request.arrayBuffer());
  } catch {
    return new Response("Invalid request", {
      status: 400,
    });
  }

  if (rawBody.length > MAX_BODY_BYTES) {
    return new Response("Payload too large", {
      status: 413,
    });
  }

  if (!verifyMetaSignature(rawBody, signature, appSecret)) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  let event;

  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return new Response("Invalid JSON", {
      status: 400,
    });
  }

  if (
    !event ||
    typeof event !== "object" ||
    Array.isArray(event) ||
    event.object !== "instagram" ||
    !Array.isArray(event.entry)
  ) {
    return new Response("Unsupported event", {
      status: 400,
    });
  }

  // Default: no message processing.
  const processingMode =
    process.env.INSTAGRAM_WEBHOOK_MODE === "dry_run"
      ? "dry_run"
      : "disabled";

  if (processingMode === "disabled") {
    return jsonResponse({
      received: true,
      processing: "disabled",
    });
  }

  const result = extractInstagramMessages(event);

  // Dry run: no Supabase reads or writes.
  // Never return customer message content or identifiers.
  return jsonResponse({
    received: true,
    processing: "dry_run",
    inspected_events: result.inspected,
    accepted_messages: result.messages.length,
    ignored_events: result.ignored,
    database_writes: 0,
  });
}
