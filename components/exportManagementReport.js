function csvCell(value) {
  if (value === null || value === undefined) {
    return '""';
  }

  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return String(value);
  }

  let text = String(value);

  // Prevent spreadsheet formula execution.
  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replaceAll('"', '""')}"`;
}

function csvRow(values) {
  return values.map(csvCell).join(",");
}

function safeNumber(value) {
  const amount = Number(value || 0);

  return Number.isFinite(amount)
    ? amount
    : 0;
}

function currencyEntries(entries = []) {
  return entries.length
    ? entries
        .map(
          ([currency, total]) =>
            `${String(currency).toUpperCase()} ${safeNumber(
              total
            ).toFixed(2)}`
        )
        .join(" | ")
    : "";
}

function exportFileName(reportPeriod = {}) {
  const start =
    reportPeriod.startDate || "all";

  const end =
    reportPeriod.endDate || "all";

  return `imbondeiro-management-report_${start}_${end}.csv`;
}

export function exportManagementReport({
  reportPeriod = {},
  executiveSnapshot = {},
  financial = {},
  nonEurCashEntries = [],
  receivables = [],
  capacity = [],
  operations = [],
}) {
  const rows = [];

  rows.push(
    csvRow([
      "Imbondeiro Travel",
      "Management Performance Report",
    ])
  );

  rows.push(
    csvRow([
      "Reporting Period",
      reportPeriod.label ||
        "All departure dates",
    ])
  );

  rows.push(
    csvRow([
      "Exported",
      new Date().toLocaleString("en-GB"),
    ])
  );

  rows.push("");

  rows.push(csvRow(["EXECUTIVE SNAPSHOT"]));
  rows.push(
    csvRow([
      "Metric",
      "Value",
      "Currency",
    ])
  );

  rows.push(
    csvRow([
      "Active Reservations",
      safeNumber(
        executiveSnapshot.reservations
      ),
      "",
    ])
  );

  rows.push(
    csvRow([
      "Travellers",
      safeNumber(
        executiveSnapshot.travellers
      ),
      "",
    ])
  );

  rows.push(
    csvRow([
      "Net Cash",
      safeNumber(executiveSnapshot.netCash),
      "EUR",
    ])
  );

  rows.push(
    csvRow([
      "Occupancy",
      safeNumber(executiveSnapshot.occupancy),
      "Percent",
    ])
  );

  rows.push(
    csvRow([
      "Available Seats",
      safeNumber(
        executiveSnapshot.availableSeats
      ),
      "",
    ])
  );

  rows.push("");

  rows.push(csvRow(["FINANCIAL PERFORMANCE"]));
  rows.push(
    csvRow([
      "Metric",
      "Value",
      "Currency",
    ])
  );

  rows.push(
    csvRow([
      "Booked Revenue",
      safeNumber(financial.bookedRevenue),
      "EUR",
    ])
  );

  rows.push(
    csvRow([
      "Net Cash Received",
      safeNumber(financial.netCashReceived),
      "EUR",
    ])
  );

  rows.push(
    csvRow([
      "Refunds",
      safeNumber(financial.refunds),
      "EUR",
    ])
  );

  rows.push(
    csvRow([
      "Outstanding",
      safeNumber(
        financial.totalReceivableEur
      ),
      "EUR",
    ])
  );

  rows.push(
    csvRow([
      "Tax Invoices Issued",
      safeNumber(
        financial.invoicedReservations
      ),
      "",
    ])
  );

  nonEurCashEntries.forEach(
    ([currency, total]) => {
      rows.push(
        csvRow([
          "Net Cash Received",
          safeNumber(total),
          String(currency).toUpperCase(),
        ])
      );
    }
  );

  rows.push("");

  rows.push(
    csvRow(["RECEIVABLES AND INVOICES"])
  );

  rows.push(
    csvRow([
      "Customer",
      "Journey",
      "Reservation Status",
      "Booking Value",
      "Paid",
      "Balance",
      "Credit",
      "Currency",
      "Tax Invoice",
      "Other Currency Payments",
    ])
  );

  receivables.forEach(reservation => {
    rows.push(
      csvRow([
        reservation.customer,
        reservation.journey,
        reservation.status,
        safeNumber(reservation.totalEur),
        safeNumber(reservation.paidEur),
        safeNumber(reservation.balanceEur),
        safeNumber(
          reservation.overpaymentEur
        ),
        "EUR",
        reservation.invoiceNumber ||
          "Not issued",
        currencyEntries(
          reservation.nonEurPaymentEntries
        ),
      ])
    );
  });

  rows.push("");

  rows.push(
    csvRow(["CAPACITY AND OCCUPANCY"])
  );

  rows.push(
    csvRow([
      "Departure",
      "Start Date",
      "Capacity",
      "Booked",
      "Held",
      "Available",
      "Occupancy Percent",
    ])
  );

  capacity.forEach(departure => {
    rows.push(
      csvRow([
        departure.title,
        departure.startDate,
        safeNumber(departure.capacity),
        safeNumber(departure.booked),
        safeNumber(departure.held),
        safeNumber(departure.available),
        safeNumber(departure.occupancy),
      ])
    );
  });

  rows.push("");

  rows.push(
    csvRow([
      "OPERATIONAL READINESS AND CONTRIBUTION",
    ])
  );

  rows.push(
    csvRow([
      "Departure",
      "Start Date",
      "Assignments",
      "Committed Bookings",
      "Readiness",
      "Missing Services",
      "Awaiting Confirmation",
      "Revenue",
      "Operations Cost",
      "Contribution",
      "Currency",
      "Other Operational Costs",
    ])
  );

  operations.forEach(departure => {
    const otherCosts =
      departure.costEntries.filter(
        ([currency]) =>
          String(currency).toUpperCase() !==
          "EUR"
      );

    rows.push(
      csvRow([
        departure.title,
        departure.startDate,
        safeNumber(departure.assignments),
        safeNumber(
          departure.committedBookings
        ),
        departure.readinessState,
        (departure.missingServices || [])
          .join(" | "),
        (
          departure.unconfirmedServices ||
          []
        ).join(" | "),
        safeNumber(
          departure.bookedRevenueEur
        ),
        safeNumber(
          departure.eurOperationsCost
        ),
        safeNumber(
          departure.contributionEur
        ),
        "EUR",
        currencyEntries(otherCosts),
      ])
    );
  });

  rows.push("");

  rows.push(
    csvRow([
      "Important",
      "Currency totals are reported separately. No exchange-rate conversion is performed.",
    ])
  );

  rows.push(
    csvRow([
      "Contribution Note",
      "Contribution is booked EUR revenue less EUR operational cost. It is not accounting profit.",
    ])
  );

  const csvContent =
    `\uFEFF${rows.join("\r\n")}`;

  const file = new Blob([csvContent], {
    type: "text/csv;charset=utf-8",
  });

  const downloadUrl =
    URL.createObjectURL(file);

  const downloadLink =
    document.createElement("a");

  downloadLink.href = downloadUrl;
  downloadLink.download =
    exportFileName(reportPeriod);

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  URL.revokeObjectURL(downloadUrl);
}
