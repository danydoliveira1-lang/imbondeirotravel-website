import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../../../../lib/commandCentreAuth";
import { supabaseRequest } from "../../../../../../lib/supabaseRest";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store, max-age=0", "X-Robots-Tag": "noindex, nofollow, noarchive" };
const fields = ["id","name","slug","country_code","explorer_region","subregion","capital","destination_type","parent_country_code","launch_status","summary","description","hero_image","hero_video_url","best_months","practical_information","entry_information_notice","currency","map_latitude","map_longitude","enquiry_enabled","featured","seo_title","seo_description","sort_order"].join(",");

export async function GET(request, { params }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  const { slug } = await params;
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return NextResponse.json({ error: "Invalid destination" }, { status: 400, headers });
  try {
    const records = await supabaseRequest("explorer_destinations", { query: [`select=${fields}`, `slug=eq.${encodeURIComponent(slug)}`, "limit=1"].join("&") });
    const destination = records?.[0];
    if (!destination) return NextResponse.json({ error: "Destination not found" }, { status: 404, headers });
    return NextResponse.json({ destination: { ...destination, enquiry_enabled: false } }, { headers });
  } catch (error) {
    console.error("Private destination preview failed", error);
    return NextResponse.json({ error: "Preview temporarily unavailable" }, { status: 500, headers });
  }
}
