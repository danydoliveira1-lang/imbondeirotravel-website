import { NextResponse } from "next/server";
import { supabaseRequest } from "../../../../lib/supabaseRest";
export async function GET() {
  try {
    const rows = await supabaseRequest("departures", { query: "select=*&status=neq.cancelled&order=start_date.asc" });
    return NextResponse.json({ departures: rows }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    return NextResponse.json({ departures: [], configured: false, error: error.message }, { status: 503 });
  }
}
