import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../../lib/commandCentreAuth";
import { supabaseRequest } from "../../../../lib/supabaseRest";

async function requireAuthentication() {
  return await isAuthenticated();
}

export async function GET() {
  if (!(await requireAuthentication())) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 401 }
    );
  }

  try {
    const records = await supabaseRequest("invoices", {
      query: "select=*&order=issued_at.desc",
    });

    return NextResponse.json({
      records: records || [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  if (!(await requireAuthentication())) {
    return NextResponse.json(
      { error: "Unauthorised" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const reservationId = String(
      body.reservation_id || ""
    ).trim();

    if (!reservationId) {
      return NextResponse.json(
        { error: "A reservation is required." },
        { status: 400 }
      );
    }

    const existingInvoices = await supabaseRequest(
      "invoices",
      {
        query:
          `select=*&reservation_id=eq.${encodeURIComponent(
            reservationId
          )}&status=eq.Issued&limit=1`,
      }
    );

    if (existingInvoices?.length) {
      return NextResponse.json({
        record: existingInvoices[0],
        existing: true,
      });
    }

    const reservations = await supabaseRequest(
      "reservations",
      {
        query:
          `select=*&id=eq.${encodeURIComponent(
            reservationId
          )}&limit=1`,
      }
    );

    const reservation = reservations?.[0];

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found." },
        { status: 404 }
      );
    }

    let departure = null;

    if (reservation.departure_id) {
      const departures = await supabaseRequest(
        "departures",
        {
          query:
            `select=*&id=eq.${encodeURIComponent(
              reservation.departure_id
            )}&limit=1`,
        }
      );

      departure = departures?.[0] || null;
    }

    const companySettings = await supabaseRequest(
      "company_settings",
      {
        query:
          "select=*&id=eq.imbondeiro-travel&limit=1",
      }
    );

    const company = companySettings?.[0];

    if (!company?.tax_invoice_enabled) {
      return NextResponse.json(
        {
          error:
            "Tax invoices are not enabled. Complete and activate Billing & Tax Identity first.",
        },
        { status: 409 }
      );
    }

    const invoicePayload = {
      reservation_id: reservation.id,
      currency: company.default_currency || "EUR",
      subtotal: Number(reservation.total || 0),
      customer_name:
        reservation.customer || "Customer not specified",
      journey:
        reservation.journey ||
        departure?.title ||
        "Journey not specified",
      travellers: Number(reservation.travellers || 0),
      departure_title:
        departure?.title ||
        reservation.journey ||
        "Journey not specified",
      departure_date:
        departure?.start_date || null,
    };

    const created = await supabaseRequest("invoices", {
      method: "POST",
      body: invoicePayload,
    });

    return NextResponse.json(
      {
        record: created?.[0] || null,
        existing: false,
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error?.message ||
      "The tax invoice could not be issued.";

    const duplicateInvoice =
      message.includes("invoices_one_issued_per_reservation") ||
      message.includes(
        "invoices_invoice_year_sequence_number_key"
      ) ||
      message.includes("invoices_invoice_number_key");

    return NextResponse.json(
      {
        error: duplicateInvoice
          ? "An issued invoice already exists for this reservation."
          : message,
      },
      { status: duplicateInvoice ? 409 : 500 }
    );
  }
}
