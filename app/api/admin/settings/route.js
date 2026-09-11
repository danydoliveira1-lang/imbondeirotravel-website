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
  "tagline",
  "website",
  "general_email",
  "phone_angola",
  "phone_portugal",
  "phone_south_africa",
  "default_currency",
  "default_language",
  "legal_company_name",
  "company_registration_number",
  "issuing_country",
  "registered_address",
  "tax_registration_number",
  "invoice_prefix",
  "default_tax_rate",
  "payment_instructions",
  "tax_invoice_enabled",
];

const payload = Object.fromEntries(
  allowedFields
    .filter(field =>
      Object.prototype.hasOwnProperty.call(body, field)
    )
    .map(field => [field, body[field]])
);

if (Object.prototype.hasOwnProperty.call(payload, "default_tax_rate")) {
  payload.default_tax_rate =
    payload.default_tax_rate === "" ||
    payload.default_tax_rate === null
      ? 0
      : Number(payload.default_tax_rate);

  if (
    !Number.isFinite(payload.default_tax_rate) ||
    payload.default_tax_rate < 0 ||
    payload.default_tax_rate > 100
  ) {
    return NextResponse.json(
      { error: "Default tax rate must be between 0 and 100." },
      { status: 400 }
    );
  }
}

if (
  Object.prototype.hasOwnProperty.call(
    payload,
    "tax_invoice_enabled"
  )
) {
  payload.tax_invoice_enabled =
    payload.tax_invoice_enabled === true;
}

const result = await supabaseRequest(

  "/company_settings",
  {
    method: "PATCH",
    query: `id=eq.${encodeURIComponent(SETTINGS_ID)}`,
    body: payload,
  }
);

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
