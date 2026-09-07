import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../../lib/commandCentreAuth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 401 }
    );
  }

  try {
    const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error("Supabase is not configured.");
    }

    const response = await fetch(
      `${url}/storage/v1/object/list/journey-media`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prefix: "launch-v1",
          limit: 100,
          offset: 0,
          sortBy: {
            column: "name",
            order: "asc",
          },
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const files = await response.json();

    const assets = files
      .filter(file => file.name)
      .map(file => ({
        name: file.name,
        path: `launch-v1/${file.name}`,
        reference:
          `${url}/storage/v1/object/public/journey-media/launch-v1/${file.name}`,
        metadata: file.metadata || null,
      }));

    return NextResponse.json(
      { assets },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        assets: [],
        error: error.message,
      },
      { status: 500 }
    );
  }
}
