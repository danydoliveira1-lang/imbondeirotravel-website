import { NextResponse } from "next/server";
import { supabaseRequest } from "../../../../lib/supabaseRest";

export async function GET() {
  try {
    const rows = await supabaseRequest("media", {
      query:
        "select=id,name,type,reference,usage,content_key,status,updated_at&status=eq.Active&usage=eq.Hero&content_key=eq.homepage.hero&order=updated_at.desc",
    });

    return NextResponse.json(
      { media: rows },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        media: [],
        configured: false,
        error: error.message,
      },
      { status: 503 }
    );
  }
}
