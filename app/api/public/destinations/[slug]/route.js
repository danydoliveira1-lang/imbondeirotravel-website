import { NextResponse } from "next/server";
import { supabaseRequest } from "../../../../../lib/supabaseRest";

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

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "A destination is required." },
        { status: 400 }
      );
    }

    const destinations = await supabaseRequest(
      "explorer_destinations",
      {
        query: [
          `select=${publicFields}`,
          `slug=eq.${encodeURIComponent(slug)}`,
          "published=eq.true",
          "launch_status=neq.paused",
          "limit=1",
        ].join("&"),
      }
    );

    const destination = destinations?.[0];

    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { destination },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Public destination detail error:", error);

    return NextResponse.json(
      { error: "The destination is temporarily unavailable." },
      { status: 500 }
    );
  }
}
