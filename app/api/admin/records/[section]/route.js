import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../../../lib/commandCentreAuth";
import { supabaseRequest } from "../../../../../lib/supabaseRest";

export async function POST(request, { params }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  try {
    const { section } = await params;
    const record = await request.json();
    const payload = { ...record, id: record.id || `${section}-${crypto.randomUUID()}`, updated_at: new Date().toISOString() };
    const result = await supabaseRequest(section, { method: "POST", query: "on_conflict=id", body: payload });
    return NextResponse.json({ record: result?.[0] || payload });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}

export async function DELETE(request, { params }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  try {
    const { section } = await params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing record id." }, { status: 400 });
    await supabaseRequest(section, { method: "DELETE", query: `id=eq.${encodeURIComponent(id)}` });
    return NextResponse.json({ ok: true });
  } catch (error) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
