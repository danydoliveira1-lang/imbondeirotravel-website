import { NextResponse } from "next/server";
import { supabaseRequest } from "../../../../lib/supabaseRest";

const publicFields = [
  "id",
  "name",
  "slug",
  "country_code",
  "explorer_region",
  "subregion",
  "capital",
  "destination_type",
  "parent_country_code",
  "launch_status",
  "summary",
  "description",
  "hero_image",
  "hero_video_url",
  "best_months",
  "practical_information",
  "entry_information_notice",
  "currency",
  "map_latitude",
  "map_longitude",
  "enquiry_enabled",
  "featured",
  "seo_title",
  "seo_description",
  "sort_order",
].join(",");

export async function GET() {
  try {
    const destinations = await supabaseRequest(
      "explorer_destinations",
      {
        query: [
          `select=${publicFields}`,
          "published=eq.true",
          "launch_status=neq.paused",
          "order=sort_order.asc,name.asc",
        ].join("&"),
      }
    );

    return NextResponse.json(
      {
        destinations: destinations || [],
        count: destinations?.length || 0,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Public Destination Explorer error:", error);

    return NextResponse.json(
      {
        error: "Destinations are temporarily unavailable.",
        destinations: [],
        count: 0,
      },
      { status: 500 }
    );
  }
}
