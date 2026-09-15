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
   if (section === "operations_resources") {
  const resourceType = String(
    record.resource_type || ""
  ).trim();

  const resourceName = String(
    record.name || ""
  ).trim();

  const capacity =
    record.capacity === "" || record.capacity == null
      ? null
      : Number(record.capacity);

  if (!resourceType || !resourceName) {
    return NextResponse.json(
      {
        error:
          "Resource type and name are required.",
      },
      { status: 400 }
    );
  }

  if (
    capacity !== null &&
    (!Number.isFinite(capacity) || capacity < 0)
  ) {
    return NextResponse.json(
      {
        error:
          "Resource capacity must be a valid number greater than or equal to zero.",
      },
      { status: 400 }
    );
  }

   const resourceStatus = String(
  record.status || "Active"
).trim();

if (
  record.id &&
  resourceStatus.toLowerCase() === "inactive"
) {
  const linkedAssignments =
    await supabaseRequest(
      "departure_assignments",
      {
        query:
          `select=id,status&resource_id=eq.${encodeURIComponent(
            record.id
          )}`,
      }
    );

  const hasActiveAssignment = (
    linkedAssignments || []
  ).some(assignment => {
    const status = String(
      assignment.status || ""
    ).toLowerCase();

    return ![
      "completed",
      "cancelled",
    ].includes(status);
  });

  if (hasActiveAssignment) {
    return NextResponse.json(
      {
        error:
          "This resource cannot be marked Inactive while it has a Planned or Confirmed departure assignment. Complete or cancel the assignment first.",
      },
      { status: 409 }
    );
  }
}  
  record.resource_type = resourceType;
  record.name = resourceName;
  record.status = resourceStatus;
  record.capacity = capacity;
}
    if (section === "departure_assignments") {
  const departureId = String(
    record.departure_id || ""
  ).trim();

  const resourceId = String(
    record.resource_id || ""
  ).trim();

  const serviceType = String(
    record.service_type || ""
  ).trim();

  const cost =
    record.cost === "" || record.cost == null
      ? 0
      : Number(record.cost);
      
  const currency = String(
  record.currency || ""
)
  .trim()
  .toUpperCase();
      
  if (!departureId || !resourceId || !serviceType) {
  return NextResponse.json(
    {
      error:
        "Departure, resource and service type are required for every assignment.",
    },
    { status: 400 }
  );
}

if (!Number.isFinite(cost) || cost < 0) {
  return NextResponse.json(
    {
      error:
        "Assignment cost must be a valid number greater than or equal to zero.",
    },
    { status: 400 }
  );
}

if (!/^[A-Z]{3}$/.test(currency)) {
  return NextResponse.json(
    {
      error:
        "Assignment currency must use a valid three-letter code, such as EUR, USD, AOA, GBP or ZAR.",
    },
    { status: 400 }
  );
}

  const assignedFrom = record.assigned_from
    ? new Date(record.assigned_from)
    : null;

  const assignedUntil = record.assigned_until
    ? new Date(record.assigned_until)
    : null;

  if (
    (assignedFrom &&
      Number.isNaN(assignedFrom.getTime())) ||
    (assignedUntil &&
      Number.isNaN(assignedUntil.getTime()))
  ) {
    return NextResponse.json(
      {
        error:
          "Enter valid assignment start and end dates.",
      },
      { status: 400 }
    );
  }
  if (!assignedFrom || !assignedUntil) {
  return NextResponse.json(
    {
      error:
        "Assignment start and end dates are required.",
    },
    { status: 400 }
  );
}
      
  if (
    assignedFrom &&
    assignedUntil &&
    assignedUntil < assignedFrom
  ) {
    return NextResponse.json(
      {
        error:
          "Assignment end time cannot be earlier than its start time.",
      },
      { status: 400 }
    );
  }

  const [linkedDepartures, linkedResources] =
    await Promise.all([
      supabaseRequest("departures", {
        query:
          `select=id&id=eq.${encodeURIComponent(
            departureId
          )}&limit=1`,
      }),
     supabaseRequest("operations_resources", {
  query:
    `select=id,status,resource_type&id=eq.${encodeURIComponent(
      resourceId
    )}&limit=1`,
}),
    ]);

  if (!linkedDepartures?.length) {
    return NextResponse.json(
      { error: "The selected departure was not found." },
      { status: 404 }
    );
  }

  if (!linkedResources?.length) {
    return NextResponse.json(
      {
        error:
          "The selected Operations resource was not found.",
      },
      { status: 404 }
    );
  }
      const linkedResource = linkedResources[0];

if (
  String(
    linkedResource.status || ""
  ).toLowerCase() === "inactive"
) {
  return NextResponse.json(
    {
      error:
        "Inactive Operations resources cannot be assigned to departures. Reactivate the resource or choose another one.",
    },
    { status: 409 }
  );
}
 const selectedResourceType = String(
  linkedResource.resource_type || ""
)
  .trim()
  .toLowerCase();

const selectedServiceType = serviceType
  .trim()
  .toLowerCase();

if (selectedResourceType !== selectedServiceType) {
  return NextResponse.json(
    {
      error:
        `A ${serviceType} service must use a ${serviceType} resource. The selected resource is registered as ${linkedResource.resource_type || "an unknown type"}.`,
    },
    { status: 409 }
  );
}
  const assignmentStatus = String(
  record.status || ""
).toLowerCase();

if (assignmentStatus !== "cancelled") {
  const existingAssignments =
    await supabaseRequest(
      "departure_assignments",
      {
        query:
          `select=id,assigned_from,assigned_until,status&resource_id=eq.${encodeURIComponent(
            resourceId
          )}`,
      }
    );

  const overlappingAssignment = (
    existingAssignments || []
  ).find(assignment => {
    if (
      String(assignment.id) ===
      String(record.id || "")
    ) {
      return false;
    }

    if (
      String(
        assignment.status || ""
      ).toLowerCase() === "cancelled"
    ) {
      return false;
    }

    if (
      !assignment.assigned_from ||
      !assignment.assigned_until
    ) {
      return false;
    }

    const existingFrom = new Date(
      assignment.assigned_from
    );

    const existingUntil = new Date(
      assignment.assigned_until
    );

    if (
      Number.isNaN(existingFrom.getTime()) ||
      Number.isNaN(existingUntil.getTime())
    ) {
      return false;
    }

    return (
      existingFrom < assignedUntil &&
      existingUntil > assignedFrom
    );
  });

  if (overlappingAssignment) {
    return NextResponse.json(
      {
        error:
          "This resource already has an overlapping assignment. Choose another resource or change the assignment times.",
      },
      { status: 409 }
    );
  }
}
      
  record.departure_id = departureId;
  record.resource_id = resourceId;
  record.service_type = serviceType;
  record.cost = cost;
  record.currency = currency;
  record.assigned_from = assignedFrom
    ? assignedFrom.toISOString()
    : null;
  record.assigned_until = assignedUntil
    ? assignedUntil.toISOString()
    : null;
}
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
let existingReservation = null;

if (section === "reservations" && record.id) {
  const existing = await supabaseRequest(
    "reservations",
    {
      query:
        `select=*&id=eq.${encodeURIComponent(
          record.id
        )}&limit=1`,
    }
  );

  existingReservation = existing?.[0] || null;
  previousDepartureId =
    existingReservation?.departure_id || null;

  if (!existingReservation) {
    return NextResponse.json(
      { error: "Reservation not found." },
      { status: 404 }
    );
  }
}
if (existingReservation) {
  const [linkedPayments, linkedInvoices] =
    await Promise.all([
      supabaseRequest("payments", {
        query:
          `select=id,status&reservation_id=eq.${encodeURIComponent(
            record.id
          )}`,
      }),
      supabaseRequest("invoices", {
        query:
          `select=id&reservation_id=eq.${encodeURIComponent(
            record.id
          )}&limit=1`,
      }),
    ]);

  const hasPaidTransaction = (
    linkedPayments || []
  ).some(
    payment =>
      String(payment.status || "").toLowerCase() ===
      "paid"
  );

  const hasTaxInvoice =
    Boolean(linkedInvoices?.length);

  if (hasPaidTransaction || hasTaxInvoice) {
    const protectedFields = [
      "customer",
      "customer_id",
      "departure_id",
      "journey",
      "travellers",
      "total",
    ];

    const numericFields = new Set([
      "travellers",
      "total",
    ]);

    const changedProtectedField =
      protectedFields.find(field => {
        if (
          !Object.prototype.hasOwnProperty.call(
            record,
            field
          )
        ) {
          return false;
        }

        if (numericFields.has(field)) {
          return (
            Number(record[field] || 0) !==
            Number(existingReservation[field] || 0)
          );
        }

        return (
          String(record[field] || "").trim() !==
          String(
            existingReservation[field] || ""
          ).trim()
        );
      });

    if (changedProtectedField) {
      return NextResponse.json(
        {
          error:
            "Customer, departure, journey, travellers and total cannot be changed after a Paid transaction or Tax Invoice exists. Status and consultant details may still be updated.",
        },
        { status: 409 }
      );
    }
  }
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
    const message =
      error?.message || "The record could not be saved.";

    const duplicatePaymentReference =
      message.includes(
        "payments_paid_reference_unique"
      );

    return NextResponse.json(
      {
        error: duplicatePaymentReference
          ? "This transaction reference has already been recorded."
          : message,
      },
      {
        status: duplicatePaymentReference ? 409 : 500,
      }
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
  if (section === "operations_resources") {
  const linkedAssignments =
    await supabaseRequest(
      "departure_assignments",
      {
        query:
          `select=id&resource_id=eq.${encodeURIComponent(
            id
          )}&limit=1`,
      }
    );

  if (linkedAssignments?.length) {
    return NextResponse.json(
      {
        error:
          "This Operations resource cannot be deleted because it is assigned to a departure. Delete the assignment first to preserve operational history.",
      },
      { status: 409 }
    );
  }
}
    if (section === "customers") {
  const linkedReservations =
    await supabaseRequest("reservations", {
      query:
        `select=id&customer_id=eq.${encodeURIComponent(
          id
        )}&limit=1`,
    });

  if (linkedReservations?.length) {
    return NextResponse.json(
      {
        error:
          "This customer cannot be deleted because reservation history is linked to their profile. Preserve the customer record as part of the permanent booking history.",
      },
      { status: 409 }
    );
  }
}
if (section === "tours") {
  const linkedDepartures =
    await supabaseRequest("departures", {
      query:
        `select=id&tour_id=eq.${encodeURIComponent(
          id
        )}&limit=1`,
    });

  if (linkedDepartures?.length) {
    return NextResponse.json(
      {
        error:
          "This tour cannot be deleted because departures are linked to it. Preserve the tour as part of the permanent journey and departure history.",
      },
      { status: 409 }
    );
  }
}
    if (section === "departures") {
  const linkedReservations =
    await supabaseRequest("reservations", {
      query:
        `select=id&departure_id=eq.${encodeURIComponent(
          id
        )}&limit=1`,
    });

  if (linkedReservations?.length) {
    return NextResponse.json(
      {
        error:
          "This departure cannot be deleted because reservations are linked to it. Preserve the departure as part of the permanent operational history.",
      },
      { status: 409 }
    );
  }
}
    if (section === "reservations") {
  const [linkedPayments, linkedInvoices] =
    await Promise.all([
      supabaseRequest("payments", {
        query:
          `select=id,status&reservation_id=eq.${encodeURIComponent(
            id
          )}`,
      }),
      supabaseRequest("invoices", {
        query:
          `select=id,status&reservation_id=eq.${encodeURIComponent(
            id
          )}&limit=1`,
      }),
    ]);

  const hasPaidTransaction = (
    linkedPayments || []
  ).some(
    payment =>
      String(payment.status || "").toLowerCase() ===
      "paid"
  );

  const hasTaxInvoice =
    Boolean(linkedInvoices?.length);

  if (hasPaidTransaction || hasTaxInvoice) {
    return NextResponse.json(
      {
        error:
          "This reservation cannot be deleted because it has a Paid transaction or Tax Invoice. Preserve it as part of the permanent financial audit trail.",
      },
      { status: 409 }
    );
  }
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
