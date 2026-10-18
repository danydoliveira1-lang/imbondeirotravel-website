import { NextResponse } from "next/server";
import { supabaseRequest } from "../../../../lib/supabaseRest";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await supabaseRequest("company_settings", {
      query: "select=website_mode&limit=1",
    });

    const storedMode = settings?.[0]?.website_mode;

    const mode =
      storedMode === "coming_soon"
        ? "coming_soon"
        : "live";

    return NextResponse.json(
      { mode },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "Website visibility could not be read:",
      error
    );

    // Safe fallback: a database-reading problem must not
    // unexpectedly hide the public website.
    return NextResponse.json(
      {
        mode: "live",
        fallback: true,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
