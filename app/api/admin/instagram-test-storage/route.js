
import { NextResponse } from "next/server";
import { getAuthenticatedAdminEmail } from "../../../../lib/commandCentreAuth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function respond(body, status) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(request) {
  // Only our approved Development Preview branch.
  if (
    process.env.VERCEL_ENV !== "preview" ||
    process.env.VERCEL_GIT_COMMIT_REF !==
      "feature/africa-middle-east-map"
  ) {
    return respond({ error: "Not available." }, 404);
  }

  // Only authenticated Command Centre administrators.
  const actorEmail = await getAuthenticatedAdminEmail();

  if (!actorEmail) {
    return respond({ error: "Unauthorised" }, 401);
  }

  // Test storage must be explicitly enabled.
  if (
    process.env.INSTAGRAM_TEST_STORAGE_ENABLED !==
    "true"
  ) {
    return respond(
      {
        error: "Instagram test storage is disabled.",
        storage_enabled: false,
        database_writes: 0,
      },
      403
    );
  }

  // This first version deliberately performs no writes.
  return respond(
    {
      message: "Test endpoint prepared.",
      storage_enabled: true,
      database_writes: 0,
    },
    200
  );
}
