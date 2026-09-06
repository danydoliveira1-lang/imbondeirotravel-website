import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../../lib/commandCentreAuth";
import { supabaseRequest } from "../../../../lib/supabaseRest";

const SETTINGS_ID = "imbondeiro-travel";

export async function PATCH(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const allowedFields = [
      "company_name",
      "general_email",
      "website",
      "phone_angola",
      "phone_portugal",
      "phone_south_africa",
      "tagline",
      "default_currency",
      "default_language",
    ];

    const payload = Object.fromEntries(
      allowedFields
        .filter(field => Object.prototype.hasOwnProperty.call(body, field))
        .map(field => [field, body[field]])
    );

    payload.updated_at = new Date().toISOString();

    const result = await supabaseRequest("company_settings", {
      method: "PATCH",
      query: `id=eq.${encodeURIComponent(SETTINGS_ID)}`,
      body: payload,
    });

    return NextResponse.json({
      record: result?.[0] || {
        id: SETTINGS_ID,
        ...payload,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
