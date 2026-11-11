
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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

export async function POST() {
  return NextResponse.json(
    { error: "Instagram event processing is not enabled." },
    { status: 503 }
  );
}
