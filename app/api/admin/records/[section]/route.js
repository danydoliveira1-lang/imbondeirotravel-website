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
   if (section === "payments") {
  const amount = Number(record.amount || 0);
  const reservationId = String(
    record.reservation_id || ""
  ).trim();

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json(
      {
        error:
          "Payment and refund amounts must be greater than zero.",
      },
      { status: 400 }
    );
  }

  if (!reservationId) {
    return NextResponse.json(
      {
        error:
          "A payment or refund must be linked to a reservation.",
      },
      { status: 400 }
    );
  }
const paymentStatus = String(
  record.status || ""
).toLowerCase();

const paymentReference = String(
  record.reference || ""
).trim();

if (paymentStatus === "paid") {
  if (!record.paid_at) {
    return NextResponse.json(
      {
        error:
          "A payment date is required when the transaction status is Paid.",
      },
      { status: 400 }
    );
  }

  const paidAt = new Date(record.paid_at);

  if (Number.isNaN(paidAt.getTime())) {
    return NextResponse.json(
      {
        error:
          "Enter a valid payment date before marking the transaction as Paid.",
      },
      { status: 400 }
    );
  }

  if (!paymentReference) {
    return NextResponse.json(
      {
        error:
          "A transaction reference is required when the status is Paid.",
      },
      { status: 400 }
    );
  }
const referencedPayments = await supabaseRequest(
  "payments",
  {
    query:
      "select=id,reference&reference=not.is.null",
  }
);

const duplicateReference = (
  referencedPayments || []
).some(
  payment =>
    payment.id !== record.id &&
    String(payment.reference || "")
      .trim()
      .toLowerCase() ===
      paymentReference.toLowerCase()
);

if (duplicateReference) {
  return NextResponse.json(
    {
      error:
        `Transaction reference "${paymentReference}" has already been recorded.`,
    },
    { status: 409 }
  );
}
  record.paid_at = paidAt.toISOString();
}

record.reference = paymentReference;
     
  if (record.id) {
    const existingRecords = await supabaseRequest(
      "payments",
      {
       query:
  `select=id,reservation_id,status&id=eq.${encodeURIComponent(
    record.id
  )}&limit=1`,
      }
    );

    const existingRecord = existingRecords?.[0];
if (
  String(
    existingRecord?.status || ""
  ).toLowerCase() === "paid"
) {
  return NextResponse.json(
    {
      error:
        "Paid payments and refunds cannot be edited. Record a correcting transaction to preserve the financial audit trail.",
    },
    { status: 409 }
  );
}
    if (
      existingRecord &&
      existingRecord.reservation_id !== reservationId
    ) {
      return NextResponse.json(
        {
          error:
            "A saved payment cannot be moved to another reservation.",
        },
        { status: 400 }
      );
    }
  }

const linkedReservations = await supabaseRequest(
  "reservations",
  {
    query:
      `select=id,total&id=eq.${encodeURIComponent(
        reservationId
      )}&limit=1`,
  }
);

const linkedReservation = linkedReservations?.[0];

if (!linkedReservation) {
  return NextResponse.json(
    { error: "Linked reservation not found." },
    { status: 404 }
  );
}

const reservationTotal = Number(
  linkedReservation.total || 0
);

if (
  !Number.isFinite(reservationTotal) ||
  reservationTotal <= 0
) {
  return NextResponse.json(
    {
      error:
        "Payments cannot be recorded until the reservation has a valid total greater than zero.",
    },
    { status: 400 }
  );
}
     
  const linkedPayments = await supabaseRequest(
    "payments",
    {
      query:
        `select=id,amount,payment_type,status&reservation_id=eq.${encodeURIComponent(
          reservationId
        )}`,
    }
  );

  const projectedPayments = [
    ...(linkedPayments || []).filter(
      payment => payment.id !== record.id
    ),
    {
      ...record,
      amount,
      reservation_id: reservationId,
    },
  ];

  const paidPayments = projectedPayments.filter(
    payment =>
      String(payment.status || "").toLowerCase() ===
      "paid"
  );

  const projectedGrossPaid = paidPayments
    .filter(
      payment =>
        String(
          payment.payment_type || ""
        ).toLowerCase() !== "refund"
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0
    );

  const projectedRefunded = paidPayments
    .filter(
      payment =>
        String(
          payment.payment_type || ""
        ).toLowerCase() === "refund"
    )
    .reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0
    );

if (projectedRefunded > projectedGrossPaid) {
  return NextResponse.json(
    {
      error:
        `Paid refunds cannot exceed paid transactions for this reservation. Paid: ${projectedGrossPaid.toFixed(
          2
        )}; projected refunds: ${projectedRefunded.toFixed(
          2
        )}.`,
    },
    { status: 400 }
  );
}
 const projectedNetPaid =
  projectedGrossPaid - projectedRefunded;

if (projectedNetPaid > reservationTotal) {
  return NextResponse.json(
    {
      error:
        `Paid transactions cannot exceed the reservation total. Booking total: ${reservationTotal.toFixed(
          2
        )}; projected net paid: ${projectedNetPaid.toFixed(
          2
        )}.`,
    },
    { status: 400 }
  );
} 
  record.amount = amount;
  record.reservation_id = reservationId;
}
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
    
if (section === "payments") {
  const existingPayments = await supabaseRequest(
    "payments",
    {
      query:
        `select=id,status,payment_type,reference&id=eq.${encodeURIComponent(
          id
        )}&limit=1`,
    }
  );

  const payment = existingPayments?.[0];

  if (!payment) {
    return NextResponse.json(
      { error: "Payment record not found." },
      { status: 404 }
    );
  }

  if (
    String(payment.status || "").toLowerCase() ===
    "paid"
  ) {
    return NextResponse.json(
      {
        error:
          "Paid payments and refunds cannot be deleted. Record a correcting transaction to preserve the financial audit trail.",
      },
      { status: 409 }
    );
  }
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
