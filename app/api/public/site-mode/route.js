import { NextResponse } from "next/server";
import { supabaseRequest } from "../../../../lib/supabaseRest";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SETTINGS_ID = "imbondeiro-travel";
const NO_CACHE = { "Cache-Control": "no-store, no-cache, must-revalidate" };

export async function GET() {
  try {
    const settings = await supabaseRequest("company_settings", {
      query: `select=website_mode&id=eq.${encodeURIComponent(SETTINGS_ID)}&limit=1`,
    });

    if (!Array.isArray(settings) || settings.length !== 1) {
      throw new Error("Company settings record not found.");
    }

    const mode = settings[0].website_mode;
    if (mode !== "live" && mode !== "coming_soon") {
      throw new Error("Invalid website visibility setting.");
    }

    return NextResponse.json({ mode }, { headers: NO_CACHE });
  } catch (error) {
    console.error("Website visibility could not be read:", error);
    return NextResponse.json(
      { mode: "coming_soon", fallback: true },
      { status: 503, headers: NO_CACHE }
    );
  }
}
