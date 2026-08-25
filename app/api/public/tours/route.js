import { NextResponse } from "next/server";
import { supabaseRequest } from "../../../../lib/supabaseRest";

export async function GET() {
  try {
    const rows = await supabaseRequest("tours", {
      query:
        "select=id,slug,title,summary,image,category,days,duration,status,sort_order&status=eq.published&order=sort_order.asc",
    });

    return NextResponse.json(
      { tours: rows },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        tours: [],
        configured: false,
        error: error.message,
      },
      { status: 503 }
    );
  }
}
