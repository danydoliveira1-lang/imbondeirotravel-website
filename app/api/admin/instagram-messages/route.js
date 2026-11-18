
import { NextResponse } from "next/server";
import { getAuthenticatedAdminEmail } from "../../../../lib/commandCentreAuth";
import { instagramSupabaseRequest } from "../../../../lib/instagramSupabase";

export const dynamic = "force-dynamic";

function respondError(message, status = 400) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

export async function GET(request) {
  // Development Preview only.
  if (
    process.env.VERCEL_ENV !== "preview" ||
    process.env.VERCEL_GIT_COMMIT_REF !==
      "feature/africa-middle-east-map"
  ) {
    return respondError("Not available.", 404);
  }

  // Require Command Centre authentication.
  const actorEmail = await getAuthenticatedAdminEmail();

  if (!actorEmail) {
    return respondError("Unauthorised", 401);
  }

  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get("conversation_id");

  // Accept only valid UUID identifiers.
  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!conversationId || !uuidPattern.test(conversationId)) {
    return respondError("Invalid conversation ID.", 400);
  }

  try {
    const query = new URLSearchParams({
      select:
        "id,conversation_id,instagram_sender_id,message_text,message_type,direction,sent_at",
      conversation_id: `eq.${conversationId}`,
      order: "sent_at.asc",
      limit: "100",
    });

    const messages = await instagramSupabaseRequest(
      "instagram_messages",
      {
        method: "GET",
        query: query.toString(),
      }
    );

    return NextResponse.json(
      {
        conversation_id: conversationId,
        messages: messages || [],
        read_only: true,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Instagram messages development API error:",
      error
    );

    return respondError(
      "Instagram messages are temporarily unavailable.",
      503
    );
  }
}
