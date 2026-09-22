import { NextResponse } from "next/server";
import { supabaseRequest } from "../../../../lib/supabaseRest";

export async function GET() {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const [departures, tours] = await Promise.all([
      supabaseRequest("departures", {
        query: `select=*&status=not.in.(cancelled,completed)&start_date=gte.${today}&order=start_date.asc`,
      }),
      supabaseRequest("tours", {
        query: "select=id,image&status=eq.published",
      }),
    ]);

    const tourImages = new Map(
      tours.map(tour => [tour.id, tour.image])
    );

    const rows = departures.map(departure => ({
      ...departure,
      image:
        departure.image ||
        tourImages.get(departure.tour_id) ||
        "",
    }));

    return NextResponse.json(
      { departures: rows },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        departures: [],
        configured: false,
        error: error.message,
      },
      { status: 503 }
    );
  }
}
