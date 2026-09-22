import { NextResponse } from "next/server";
import {
  getAuthenticatedAdminEmail,
} from "../../../../lib/commandCentreAuth";
import {
  supabaseRequest,
} from "../../../../lib/supabaseRest";

const SETTINGS_ID = "imbondeiro-travel";

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
  "website_logo_url",
  "document_logo_url",
];

const logoFields = [
  "website_logo_url",
  "document_logo_url",
];

function validLogoLocation(value) {
  if (!value) return true;

  if (value.startsWith("/")) {
    return !value.startsWith("//");
  }

  try {
    const url = new URL(value);

    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export async function PATCH(request) {
  const actorEmail =
    await getAuthenticatedAdminEmail();

  if (!actorEmail) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const payload = Object.fromEntries(
      allowedFields
        .filter(field =>
          Object.prototype.hasOwnProperty.call(
            body,
            field
          )
        )
        .map(field => [field, body[field]])
    );

    if (!Object.keys(payload).length) {
      return NextResponse.json(
        {
          error:
            "No approved settings were provided.",
        },
        { status: 400 }
      );
    }

    for (const field of logoFields) {
      if (
        Object.prototype.hasOwnProperty.call(
          payload,
          field
        )
      ) {
        payload[field] = String(
          payload[field] || ""
        ).trim();

        if (!validLogoLocation(payload[field])) {
          return NextResponse.json(
            {
              error:
                "Logo selections must use a secure image URL or an approved local asset path.",
            },
            { status: 400 }
          );
        }

        if (!payload[field]) {
          payload[field] = null;
        }
      }
    }

    if (
      Object.prototype.hasOwnProperty.call(
        payload,
        "default_tax_rate"
      )
    ) {
      payload.default_tax_rate =
        payload.default_tax_rate === "" ||
        payload.default_tax_rate === null
          ? 0
          : Number(payload.default_tax_rate);

      if (
        !Number.isFinite(
          payload.default_tax_rate
        ) ||
        payload.default_tax_rate < 0 ||
        payload.default_tax_rate > 100
      ) {
        return NextResponse.json(
          {
            error:
              "Default tax rate must be between 0 and 100.",
          },
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

    const previousRecords =
      await supabaseRequest(
        "company_settings",
        {
          query:
            `select=*&id=eq.${encodeURIComponent(
              SETTINGS_ID
            )}&limit=1`,
        }
      );

    const previousValues =
      previousRecords?.[0] || null;

    const result = await supabaseRequest(
      "company_settings",
      {
        method: "PATCH",
        query:
          `id=eq.${encodeURIComponent(
            SETTINGS_ID
          )}`,
        body: {
          ...payload,
          updated_at: new Date().toISOString(),
        },
      }
    );

    const savedRecord =
      result?.[0] || {
        ...(previousValues || {}),
        id: SETTINGS_ID,
        ...payload,
      };

    await supabaseRequest("audit_logs", {
      method: "POST",
      body: {
        action: "update",
        section: "company_settings",
        record_id: SETTINGS_ID,
        actor_email: actorEmail,
        previous_values: previousValues,
        new_values: savedRecord,
      },
    });

    return NextResponse.json({
      record: savedRecord,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Settings could not be updated.",
      },
      { status: 500 }
    );
  }
}
