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

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return escapeHtml(value);
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatMoney(value, currency) {
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

export function printOperationsRunSheet({
  departure,
  assignments = [],
  resources = [],
}) {
  const printWindow = window.open(
    "",
    "_blank",
    "width=1200,height=850"
  );

  if (!printWindow) {
    window.alert(
      "Allow pop-ups to print the Operations Run Sheet."
    );
    return;
  }

  const resourceFor = resourceId =>
    resources.find(
      resource =>
        String(resource.id) === String(resourceId)
    );

  const activeAssignments = assignments
    .filter(
      assignment =>
        String(
          assignment.status || ""
        ).toLowerCase() !== "cancelled"
    )
    .sort((first, second) =>
      String(first.service_type || "").localeCompare(
        String(second.service_type || "")
      )
    );
const requiredServices = [
  "guide",
  "driver",
  "vehicle",
];

const assignedServiceTypes = new Set(
  activeAssignments.map(assignment =>
    String(
      assignment.service_type || ""
    )
      .trim()
      .toLowerCase()
  )
);

const missingServices = requiredServices.filter(
  service =>
    !assignedServiceTypes.has(service)
);

const unconfirmedServices =
  requiredServices.filter(service => {
    if (!assignedServiceTypes.has(service)) {
      return false;
    }

    return !activeAssignments.some(
      assignment =>
        String(
          assignment.service_type || ""
        )
          .trim()
          .toLowerCase() === service &&
        String(
          assignment.status || ""
        )
          .trim()
          .toLowerCase() === "confirmed"
    );
  });

const readinessState =
  missingServices.length > 0
    ? "action-required"
    : unconfirmedServices.length > 0
      ? "planned"
      : "ready";

const readinessTitle =
  readinessState === "ready"
    ? "READY — Core operations confirmed"
    : readinessState === "planned"
      ? "PLANNED — Awaiting confirmation"
      : "ACTION REQUIRED — Missing core services";

const readinessDetail =
  missingServices.length > 0
    ? `Missing: ${missingServices
        .map(service =>
          service.replace(
            /\b\w/g,
            character =>
              character.toUpperCase()
          )
        )
        .join(", ")}`
    : unconfirmedServices.length > 0
      ? `Awaiting confirmation: ${unconfirmedServices
          .map(service =>
            service.replace(
              /\b\w/g,
              character =>
                character.toUpperCase()
            )
          )
          .join(", ")}`
      : "Guide, Driver and Vehicle are confirmed.";
  
  const totalsByCurrency = activeAssignments.reduce(
    (totals, assignment) => {
      const amount = Number(assignment.cost || 0);

      if (!Number.isFinite(amount) || amount <= 0) {
        return totals;
      }

      const currency = String(
        assignment.currency || "EUR"
      )
        .trim()
        .toUpperCase();

      totals[currency] =
        (totals[currency] || 0) + amount;

      return totals;
    },
    {}
  );

  const assignmentRows = activeAssignments.length
    ? activeAssignments
        .map(assignment => {
          const resource = resourceFor(
            assignment.resource_id
          );

          const contact = [
            resource?.phone,
            resource?.email,
          ]
            .filter(Boolean)
            .join(" · ");

          return `
            <tr>
              <td>${escapeHtml(
                assignment.service_type || "—"
              )}</td>
              <td>
                <strong>${escapeHtml(
                  resource?.name ||
                    "Resource unavailable"
                )}</strong>
                ${
                  resource?.company
                    ? `<br><span>${escapeHtml(
                        resource.company
                      )}</span>`
                    : ""
                }
              </td>
              <td>${escapeHtml(contact || "—")}</td>
              <td>${escapeHtml(
                assignment.role_or_service || "—"
              )}</td>
              <td>${formatDateTime(
                assignment.assigned_from
              )}</td>
              <td>${formatDateTime(
                assignment.assigned_until
              )}</td>
              <td>${escapeHtml(
                assignment.status || "—"
              )}</td>
              <td>${escapeHtml(
                assignment.confirmation_reference ||
                  "—"
              )}</td>
              <td>${escapeHtml(
                formatMoney(
                  assignment.cost,
                  assignment.currency
                )
              )}</td>
            </tr>
          `;
        })
        .join("")
    : `
      <tr>
        <td colspan="9" class="empty">
          No active operational assignments.
        </td>
      </tr>
    `;

  const costSummary =
    Object.entries(totalsByCurrency).length > 0
      ? Object.entries(totalsByCurrency)
          .sort(([first], [second]) =>
            first.localeCompare(second)
          )
          .map(([currency, total]) =>
            escapeHtml(
              formatMoney(total, currency)
            )
          )
          .join(" + ")
      : formatMoney(0, "EUR");

  const departureTitle =
    departure?.title || "Departure";

  printWindow.document.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(
          departureTitle
        )} — Operations Run Sheet</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 36px;
            color: #17241f;
            font-family: Arial, sans-serif;
            background: #ffffff;
          }

          header {
            border-bottom: 3px solid #b58b3c;
            padding-bottom: 22px;
            margin-bottom: 28px;
          }

          .eyebrow {
            margin: 0 0 8px;
            color: #b58b3c;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.16em;
            text-transform: uppercase;
          }

          h1 {
            margin: 0;
            color: #153f34;
            font-family: Georgia, serif;
            font-size: 34px;
          }

          .subtitle {
            margin: 9px 0 0;
            color: #52605b;
          }

          .summary {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
            margin-bottom: 28px;
          }

          .summary article {
            padding: 15px;
            border: 1px solid #d8ddd9;
            border-radius: 8px;
            background: #f7f5ef;
          }

          .summary span {
            display: block;
            margin-bottom: 6px;
            color: #6d7773;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
          }

          .summary strong {
            color: #153f34;
            font-size: 14px;
          }
        .readiness-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;
  padding: 14px 16px;
  border: 2px solid;
  border-radius: 8px;
}

.readiness-banner strong {
  font-size: 14px;
}

.readiness-banner span {
  font-size: 12px;
  text-align: right;
}

.readiness-banner.action-required {
  color: #8a3426;
  border-color: #b65d45;
  background: #f8e9e4;
}

.readiness-banner.planned {
  color: #72531b;
  border-color: #b58b3c;
  background: #faf2df;
}

.readiness-banner.ready {
  color: #153f34;
  border-color: #3e7564;
  background: #e3efe9;
}
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          th {
            padding: 10px 8px;
            color: #ffffff;
            background: #153f34;
            text-align: left;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          td {
            padding: 11px 8px;
            border-bottom: 1px solid #dfe3e0;
            vertical-align: top;
          }

          td span {
            color: #68736f;
          }

          .empty {
            padding: 30px;
            text-align: center;
            color: #68736f;
          }

          .cost-summary {
            margin-top: 22px;
            padding: 16px;
            text-align: right;
            border-top: 2px solid #b58b3c;
            font-size: 14px;
          }

          .notes {
            margin-top: 28px;
            min-height: 90px;
            padding: 16px;
            border: 1px solid #d8ddd9;
            border-radius: 8px;
          }

          .notes h2 {
            margin: 0 0 10px;
            color: #153f34;
            font-family: Georgia, serif;
            font-size: 18px;
          }

          footer {
            margin-top: 28px;
            color: #737c78;
            font-size: 10px;
          }

          @media print {
            body {
              padding: 18px;
            }

            @page {
              size: landscape;
              margin: 12mm;
            }
          }
        </style>
      </head>

      <body>
        <header>
          <p class="eyebrow">
            Imbondeiro Travel · Operations
          </p>
          <h1>Departure Operations Run Sheet</h1>
          <p class="subtitle">
            ${escapeHtml(departureTitle)}
          </p>
        </header>

<section class="summary">
  <article>
    <span>Start date</span>
    <strong>${formatDate(
      departure?.start_date
    )}</strong>
  </article>

  <article>
    <span>End date</span>
    <strong>${formatDate(
      departure?.end_date
    )}</strong>
  </article>

  <article>
    <span>Location</span>
    <strong>${escapeHtml(
      departure?.location || "—"
    )}</strong>
  </article>

  <article>
    <span>Departure status</span>
    <strong>${escapeHtml(
      departure?.status || "—"
    )}</strong>
  </article>
</section>

<section class="readiness-banner ${escapeHtml(
  readinessState
)}">
  <strong>${escapeHtml(
    readinessTitle
  )}</strong>
  <span>${escapeHtml(
    readinessDetail
  )}</span>
</section>

<table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Resource</th>
              <th>Contact</th>
              <th>Role / Service</th>
              <th>From</th>
              <th>Until</th>
              <th>Status</th>
              <th>Reference</th>
              <th>Cost</th>
            </tr>
          </thead>

          <tbody>
            ${assignmentRows}
          </tbody>
        </table>

        <div class="cost-summary">
          <strong>
            Planned operations cost:
            ${escapeHtml(costSummary)}
          </strong>
        </div>

        <section class="notes">
          <h2>Operational Notes</h2>
          <p>
            Confirm final contacts, pickup instructions,
            supplier references and emergency arrangements
            before departure.
          </p>
        </section>

        <footer>
          Generated ${escapeHtml(
            new Date().toLocaleString("en-GB")
          )} · Internal operations document
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
