import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../../lib/commandCentreAuth";
import { getAllCommandCentreData } from "../../../../lib/supabaseRest";
export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  try { return NextResponse.json({ data: await getAllCommandCentreData() }); }
  catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
