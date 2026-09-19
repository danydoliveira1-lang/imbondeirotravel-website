function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return escapeHtml(value);
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(value, currency = "EUR") {
  const amount = Number(value || 0);
  const currencyCode = String(
    currency || "EUR"
  )
    .trim()
    .toUpperCase();

  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(
      Number.isFinite(amount) ? amount : 0
    );
  } catch {
    return `${currencyCode} ${
      Number.isFinite(amount)
        ? amount.toFixed(2)
        : "0.00"
    }`;
  }
}

function formatMoneyEntries(entries = []) {
  if (!entries.length) return "—";

  return entries
    .map(([currency, total]) =>
      formatMoney(total, currency)
    )
    .join(" + ");
}

function titleCase(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      character => character.toUpperCase()
    );
}

function operationsDetail(departure) {
  if (
    departure.readinessState === "ready"
  ) {
    return "Core services confirmed";
  }

  if (
    departure.readinessState === "planned"
  ) {
    return `Awaiting confirmation: ${
      departure.unconfirmedServices
        ?.map(titleCase)
        .join(", ") || "—"
    }`;
  }

  return `Missing: ${
    departure.missingServices
      ?.map(titleCase)
      .join(", ") || "—"
  }`;
}

export function printManagementReport({
  reportPeriod = {},
  executiveSnapshot = {},
  financial = {},
  nonEurCashEntries = [],
  receivables = [],
  capacity = [],
  operations = [],
  company = {},
}) {
  const documentLogo =
    company.document_logo_url ||
    company.website_logo_url ||
    "/assets/imbondeiro-logo-luxury-web.png";
  
  const printedPeriodLabel =
  reportPeriod.startDate &&
  reportPeriod.endDate
    ? `${formatDate(
        reportPeriod.startDate
      )} to ${formatDate(
        reportPeriod.endDate
      )}`
    : reportPeriod.startDate
      ? `From ${formatDate(
          reportPeriod.startDate
        )}`
      : reportPeriod.endDate
        ? `Up to ${formatDate(
            reportPeriod.endDate
          )}`
        : "All departure dates";
    const printWindow = window.open(
    "",
    "_blank",
    "width=1400,height=900"
  );

  if (!printWindow) {
    window.alert(
      "Allow pop-ups to print the Management Report."
    );
    return;
  }
  
 const receivableRows = receivables.length
    ? receivables
        .map(reservation => {
          const paymentState =
            reservation.balanceEur > 0
              ? "Outstanding"
              : reservation.overpaymentEur > 0
                ? "Overpaid"
                : "Paid";

          const closingAmount =
            reservation.balanceEur > 0
              ? `Balance ${formatMoney(
                  reservation.balanceEur,
                  "EUR"
                )}`
              : reservation.overpaymentEur > 0
                ? `Credit ${formatMoney(
                    reservation.overpaymentEur,
                    "EUR"
                  )}`
                : "Paid in full";

          return `
            <tr>
              <td>
                <strong>
                  ${escapeHtml(
                    reservation.customer
                  )}
                </strong>
              </td>
              <td>
                ${escapeHtml(
                  reservation.journey
                )}
              </td>
              <td>
                ${escapeHtml(
                  reservation.status
                )}
              </td>
              <td>
                ${escapeHtml(
                  formatMoney(
                    reservation.totalEur,
                    "EUR"
                  )
                )}
              </td>
              <td>
                ${escapeHtml(
                  formatMoney(
                    reservation.paidEur,
                    "EUR"
                  )
                )}
              </td>
              <td>
                ${escapeHtml(closingAmount)}
              </td>
              <td>
                <span class="status">
                  ${escapeHtml(paymentState)}
                </span>
              </td>
              <td>
                ${escapeHtml(
                  reservation.invoiceNumber ||
                    "Not issued"
                )}
              </td>
              <td>
                ${escapeHtml(
                  formatMoneyEntries(
                    reservation
                      .nonEurPaymentEntries
                  )
                )}
              </td>
            </tr>
          `;
        })
        .join("")
    : `
        <tr>
          <td colspan="9" class="empty">
            No committed reservations.
          </td>
        </tr>
      `;

  const capacityRows = capacity.length
    ? capacity
        .map(departure => `
          <tr>
            <td>
              <strong>
                ${escapeHtml(departure.title)}
              </strong>
            </td>
            <td>
              ${escapeHtml(
                formatDate(departure.startDate)
              )}
            </td>
            <td>${escapeHtml(departure.capacity)}</td>
            <td>${escapeHtml(departure.booked)}</td>
            <td>${escapeHtml(departure.held)}</td>
            <td>${escapeHtml(departure.available)}</td>
            <td>
              <strong>
                ${escapeHtml(
                  `${departure.occupancy}%`
                )}
              </strong>
            </td>
          </tr>
        `)
        .join("")
    : `
        <tr>
          <td colspan="7" class="empty">
            No active departures.
          </td>
        </tr>
      `;

  const operationsRows = operations.length
    ? operations
        .map(departure => {
          const nonEurCosts =
            departure.costEntries.filter(
              ([currency]) =>
                currency !== "EUR"
            );

          return `
            <tr>
              <td>
                <strong>
                  ${escapeHtml(
                    departure.title
                  )}
                </strong>
              </td>
              <td>
                ${escapeHtml(
                  formatDate(
                    departure.startDate
                  )
                )}
              </td>
              <td>
                ${escapeHtml(
                  departure.assignments
                )}
              </td>
              <td>
                <span class="status">
                  ${escapeHtml(
                    titleCase(
                      departure.readinessState
                    )
                  )}
                </span>
                <small>
                  ${escapeHtml(
                    operationsDetail(
                      departure
                    )
                  )}
                </small>
              </td>
              <td>
                ${escapeHtml(
                  formatMoney(
                    departure.bookedRevenueEur,
                    "EUR"
                  )
                )}
              </td>
              <td>
                ${escapeHtml(
                  formatMoney(
                    departure.eurOperationsCost,
                    "EUR"
                  )
                )}
              </td>
              <td>
                <strong>
                  ${escapeHtml(
                    formatMoney(
                      departure.contributionEur,
                      "EUR"
                    )
                  )}
                </strong>
              </td>
              <td>
                ${escapeHtml(
                  formatMoneyEntries(
                    nonEurCosts
                  )
                )}
              </td>
            </tr>
          `;
        })
        .join("")
    : `
        <tr>
          <td colspan="8" class="empty">
            No active departures require reporting.
          </td>
        </tr>
      `;

  const nonEurCashSummary =
    nonEurCashEntries.length
      ? nonEurCashEntries
          .map(
            ([currency, total]) => `
              <article>
                <span>
                  Net cash — ${escapeHtml(
                    currency
                  )}
                </span>
                <strong>
                  ${escapeHtml(
                    formatMoney(
                      total,
                      currency
                    )
                  )}
                </strong>
                <small>
                  Reported without conversion
                </small>
              </article>
            `
          )
          .join("")
      : "";

  printWindow.document.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>
          Imbondeiro Travel — Management Report
        </title>

        <style>
          * {
            box-sizing: border-box;
          }

          @page {
            size: A4 landscape;
            margin: 12mm;
          }

          body {
            margin: 0;
            padding: 28px;
            color: #17241f;
            font-family: Arial, sans-serif;
            background: #ffffff;
          }

          header {
            padding-bottom: 18px;
            margin-bottom: 22px;
            border-bottom: 3px solid #b58b3c;
          }

            .report-brand {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .report-logo {
            display: block;
            width: 220px;
            height: 100px;
            object-fit: contain;
          }

          .report-heading {
            min-width: 0;
          }
          .eyebrow {
            margin: 0 0 7px;
            color: #b58b3c;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
          }

          h1,
          h2 {
            color: #153f34;
            font-family: Georgia, serif;
          }

          h1 {
            margin: 0;
            font-size: 32px;
          }

          h2 {
            margin: 0;
            font-size: 20px;
          }

          .subtitle {
            margin: 7px 0 0;
            color: #52605b;
          }

         .report-period {
         margin: 9px 0 0;
         color: #153f34;
         font-size: 11px;
         }

        .report-period strong {
        color: #b58b3c;
         }
          .section {
            margin: 0 0 24px;
            break-inside: avoid;
          }

          .section-head {
            display: flex;
            align-items: end;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 12px;
          }

          .section-head span {
            color: #6d7773;
            font-size: 11px;
          }

          .cards {
            display: grid;
            grid-template-columns:
              repeat(5, minmax(0, 1fr));
            gap: 10px;
          }

          .cards article {
            min-height: 82px;
            padding: 12px;
            border: 1px solid #d8ddd9;
            border-radius: 7px;
            background: #f7f5ef;
          }

          .cards span,
          .cards small {
            display: block;
          }

          .cards span {
            margin-bottom: 7px;
            color: #6d7773;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .cards strong {
            color: #153f34;
            font-size: 17px;
          }

          .cards small {
            margin-top: 6px;
            color: #6d7773;
            font-size: 9px;
          }

          .notice {
            margin-top: 10px;
            padding: 9px 11px;
            border-left: 3px solid #b58b3c;
            color: #66511f;
            font-size: 10px;
            background: #faf2df;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9px;
          }

          th {
            padding: 8px 7px;
            color: #ffffff;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            background: #153f34;
          }

          td {
            padding: 8px 7px;
            vertical-align: top;
            border-bottom: 1px solid #d8ddd9;
          }

          td small {
            display: block;
            margin-top: 4px;
            color: #6d7773;
          }

          .status {
            display: inline-block;
            font-size: 8px;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }

          .empty {
            padding: 18px;
            color: #6d7773;
            text-align: center;
          }

          footer {
            margin-top: 24px;
            padding-top: 10px;
            border-top: 1px solid #d8ddd9;
            color: #6d7773;
            font-size: 9px;
          }

          @media print {
            body {
              padding: 0;
            }

            .section,
            table,
            tr,
            article {
              break-inside: avoid;
            }
          }
        </style>
      </head>

              <header>
          <div class="report-brand">
            <img
              class="report-logo"
              src="${escapeHtml(documentLogo)}"
              alt="Imbondeiro Travel"
            />

            <div class="report-heading">
              <p class="eyebrow">
                Imbondeiro Travel · Management
              </p>

              <h1>
                Management Performance Report
              </h1>

              <p class="subtitle">
                Executive overview of bookings,
                financial performance, receivables,
                capacity and operational readiness.
              </p>

              <p class="report-period">
                Reporting period:
                <strong>
                  ${escapeHtml(
                    printedPeriodLabel
                  )}
                </strong>
              </p>
            </div>
          </div>
        </header>

        <section class="section">
          <div class="section-head">
            <h2>Executive Snapshot</h2>
            <span>Live management overview</span>
          </div>

          <div class="cards">
            <article>
              <span>Active reservations</span>
              <strong>
                ${escapeHtml(
                  executiveSnapshot.reservations ||
                    0
                )}
              </strong>
            </article>

            <article>
              <span>Travellers</span>
              <strong>
                ${escapeHtml(
                  executiveSnapshot.travellers ||
                    0
                )}
              </strong>
            </article>

            <article>
              <span>Net cash — EUR</span>
              <strong>
                ${escapeHtml(
                  formatMoney(
                    executiveSnapshot.netCash,
                    "EUR"
                  )
                )}
              </strong>
            </article>

            <article>
              <span>Occupancy</span>
              <strong>
                ${escapeHtml(
                  `${executiveSnapshot.occupancy || 0}%`
                )}
              </strong>
            </article>

            <article>
              <span>Available seats</span>
              <strong>
                ${escapeHtml(
                  executiveSnapshot.availableSeats ||
                    0
                )}
              </strong>
            </article>
          </div>
        </section>

        <section class="section">
          <div class="section-head">
            <h2>Financial Performance</h2>
            <span>EUR values remain separate</span>
          </div>

          <div class="cards">
            <article>
              <span>Booked revenue — EUR</span>
              <strong>
                ${escapeHtml(
                  formatMoney(
                    financial.bookedRevenue,
                    "EUR"
                  )
                )}
              </strong>
            </article>

            <article>
              <span>Net cash — EUR</span>
              <strong>
                ${escapeHtml(
                  formatMoney(
                    financial.netCashReceived,
                    "EUR"
                  )
                )}
              </strong>
            </article>

            <article>
              <span>Refunds — EUR</span>
              <strong>
                ${escapeHtml(
                  formatMoney(
                    financial.refunds,
                    "EUR"
                  )
                )}
              </strong>
            </article>

            <article>
              <span>Outstanding — EUR</span>
              <strong>
                ${escapeHtml(
                  formatMoney(
                    financial.totalReceivableEur,
                    "EUR"
                  )
                )}
              </strong>
            </article>

            <article>
              <span>Tax invoices issued</span>
              <strong>
                ${escapeHtml(
                  financial.invoicedReservations ||
                    0
                )}
              </strong>
            </article>

            ${nonEurCashSummary}
          </div>

          <div class="notice">
            Currency totals are reported separately.
            No exchange-rate conversion is performed.
          </div>
        </section>

        <section class="section">
          <div class="section-head">
            <h2>Receivables & Invoices</h2>
            <span>
              ${escapeHtml(
                receivables.length
              )} committed reservations
            </span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Journey</th>
                <th>Status</th>
                <th>Booking EUR</th>
                <th>Paid EUR</th>
                <th>Balance / Credit</th>
                <th>Payment Status</th>
                <th>Tax Invoice</th>
                <th>Other Currencies</th>
              </tr>
            </thead>
            <tbody>
              ${receivableRows}
            </tbody>
          </table>
        </section>

        <section class="section">
          <div class="section-head">
            <h2>Capacity & Occupancy</h2>
            <span>
              ${escapeHtml(
                `${executiveSnapshot.occupancy || 0}% overall occupancy`
              )}
            </span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Departure</th>
                <th>Start Date</th>
                <th>Capacity</th>
                <th>Booked</th>
                <th>Held</th>
                <th>Available</th>
                <th>Occupancy</th>
              </tr>
            </thead>
            <tbody>
              ${capacityRows}
            </tbody>
          </table>
        </section>

        <section class="section">
          <div class="section-head">
            <h2>
              Operational Readiness & Contribution
            </h2>
            <span>
              Revenue and EUR costs compared
              consistently
            </span>
          </div>

          <table>
            <thead>
              <tr>
                <th>Departure</th>
                <th>Start Date</th>
                <th>Assignments</th>
                <th>Readiness</th>
                <th>Revenue EUR</th>
                <th>Operations EUR</th>
                <th>Contribution EUR</th>
                <th>Other Costs</th>
              </tr>
            </thead>
            <tbody>
              ${operationsRows}
            </tbody>
          </table>

          <div class="notice">
            Contribution is booked EUR revenue less
            EUR operational cost. It is not accounting
            profit and excludes overheads, taxes and
            costs recorded in other currencies.
          </div>
        </section>

        <footer>
          Generated ${escapeHtml(
            new Date().toLocaleString("en-GB")
          )} · Internal management document
        </footer>

        <script>
          window.addEventListener("load", () => {
            window.print();
          });
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}
