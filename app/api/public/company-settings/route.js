import { NextResponse } from "next/server";
import { supabaseRequest } from "../../../../lib/supabaseRest";

const SETTINGS_ID = "imbondeiro-travel";

export async function GET() {
  try {
    const records = await supabaseRequest(
      "company_settings",
      {
        query:
          `select=company_name,tagline,website_logo_url,document_logo_url` +
          `&id=eq.${encodeURIComponent(SETTINGS_ID)}` +
          `&limit=1`,
      }
    );

    const settings = records?.[0] || {};

    return NextResponse.json({
      company_name:
        settings.company_name || "Imbondeiro Travel",
      tagline:
        settings.tagline || "Your Lifetime Experience",
      website_logo_url:
        settings.website_logo_url || null,
      document_logo_url:
        settings.document_logo_url ||
        settings.website_logo_url ||
        null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Company settings could not be loaded.",
      },
      { status: 500 }
    );
  }
}
