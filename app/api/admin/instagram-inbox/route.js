
import { NextResponse } from "next/server";
import { getAuthenticatedAdminEmail } from "../../../../lib/commandCentreAuth";
import { instagramSupabaseRequest } from "../../../../lib/instagramSupabase";

export const dynamic = "force-dynamic";

function respondError(message, status = 400) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

export async function GET() {
  // Restrict this API to our development Preview.
  if (
    process.env.VERCEL_ENV !== "preview" ||
    process.env.VERCEL_GIT_COMMIT_REF !==
      "feature/africa-middle-east-map"
  ) {
    return respondError("Not available.", 404);
  }

  // Only authenticated Command Centre admins may read.
  const actorEmail = await getAuthenticatedAdminEmail();

  if (!actorEmail) {
    return respondError("Unauthorised", 401);
  }

  try {
    const conversations = await instagramSupabaseRequest(
      "instagram_conversations",
      {
        method: "GET",
        query:
          "select=id,instagram_account_id,instagram_sender_id,status,last_message_at,created_at,updated_at&order=created_at.desc&limit=50",
      }
    );

    return NextResponse.json(
      {
        conversations: conversations || [],
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
      "Instagram Inbox development API error:",
      error
    );

    return respondError(
      "Instagram Inbox is temporarily unavailable.",
      503
    );
  }
}
