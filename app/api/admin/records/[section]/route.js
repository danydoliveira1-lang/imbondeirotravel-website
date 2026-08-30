import { NextResponse } from "next/server";
import { isAuthenticated } from "../../../../../lib/commandCentreAuth";
import { supabaseRequest } from "../../../../../lib/supabaseRest";

const reservedStatuses = new Set([
  "Deposit Paid",
  "Confirmed",
  "Travelled",
]);

async function syncDepartureSeats(departureId) {
  if (!departureId) return;

  const reservations = await supabaseRequest("reservations", {
    query: `select=travellers,status&departure_id=eq.${encodeURIComponent(departureId)}`,
  });

  const totals = (reservations || []).reduce(
    (sum, reservation) => {
      const travellers = Math.max(0, Number(reservation.travellers || 0));

      if (reservation.status === "On Hold") {
        sum.held += travellers;
      }

      if (reservedStatuses.has(reservation.status)) {
        sum.reserved += travellers;
      }

      return sum;
    },
    { held: 0, reserved: 0 }
  );

  await supabaseRequest("departures", {
    method: "PATCH",
    query: `id=eq.${encodeURIComponent(departureId)}`,
    body: {
      held_guests: totals.held,
      reserved_guests: totals.reserved,
      updated_at: new Date().toISOString(),
    },
  });
}

export async function POST(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const { section } = await params;
    const record = await request.json();

    let previousDepartureId = null;

    if (section === "reservations" && record.id) {
      const existing = await supabaseRequest("reservations", {
        query: `select=departure_id&id=eq.${encodeURIComponent(record.id)}`,
      });

      previousDepartureId = existing?.[0]?.departure_id || null;
    }

    const payload = {
      ...record,
      id: record.id || crypto.randomUUID(),
      updated_at: new Date().toISOString(),
    };

    if (
      section === "departures" &&
      !payload.departure_date &&
      payload.start_date
    ) {
      payload.departure_date = payload.start_date;
    }

    const result = await supabaseRequest(section, {
      method: "POST",
      query: "on_conflict=id",
      body: payload,
    });

    const savedRecord = result?.[0] || payload;

    if (section === "reservations") {
      const currentDepartureId = savedRecord.departure_id || null;

      if (
        previousDepartureId &&
        previousDepartureId !== currentDepartureId
      ) {
        await syncDepartureSeats(previousDepartureId);
      }

      if (currentDepartureId) {
        await syncDepartureSeats(currentDepartureId);
      }
    }

    return NextResponse.json({ record: savedRecord });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const { section } = await params;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing record id." },
        { status: 400 }
      );
    }

    let departureId = null;

    if (section === "reservations") {
      const existing = await supabaseRequest("reservations", {
        query: `select=departure_id&id=eq.${encodeURIComponent(id)}`,
      });

      departureId = existing?.[0]?.departure_id || null;
    }

    await supabaseRequest(section, {
      method: "DELETE",
      query: `id=eq.${encodeURIComponent(id)}`,
    });

    if (section === "reservations" && departureId) {
      await syncDepartureSeats(departureId);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
