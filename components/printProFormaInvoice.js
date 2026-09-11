export function printProFormaInvoice({
  reservation,
  departures = [],
  payments = []
}) {
  const departure = departures.find(
    item => item.id === reservation.departure_id
  );

  const linkedPayments = payments.filter(
    payment =>
      payment.reservation_id === reservation.id &&
      String(payment.status || "").toLowerCase() === "paid"
  );

  const grossPaid = linkedPayments
    .filter(
      payment =>
        String(payment.payment_type || "").toLowerCase() !== "refund"
    )
    .reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

  const refunded = linkedPayments
    .filter(
      payment =>
        String(payment.payment_type || "").toLowerCase() === "refund"
    )
    .reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );

  const netPaid = grossPaid - refunded;
  const bookingTotal = Number(reservation.total || 0);
  const outstanding = Math.max(0, bookingTotal - netPaid);
  const currency = linkedPayments[0]?.currency || "EUR";

  const escapeHtml = value =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const formatMoney = value =>
    `${currency} ${Number(value || 0).toFixed(2)}`;

  const formatDate = value => {
    if (!value) return "Not specified";

    const date = new Date(
      String(value).includes("T")
        ? value
        : `${value}T12:00:00`
    );

    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric"
        });
  };

  const proFormaNumber = `PF-${String(reservation.id || "")
    .slice(0, 8)
    .toUpperCase()}`;

  const invoiceWindow = window.open(
    "",
    "_blank",
    "width=900,height=850"
  );

  if (!invoiceWindow) {
    window.alert(
      "The Pro Forma window was blocked. Please allow pop-ups and try again."
    );
    return;
  }

  invoiceWindow.document.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Pro Forma Invoice ${escapeHtml(proFormaNumber)}</title>

        <style>
          * { box-sizing: border-box; }

          html, body {
            margin: 0;
            background: #ece9e1;
            color: #132a23;
            font-family: Arial, sans-serif;
          }

          .invoice {
            width: min(794px, calc(100% - 32px));
            min-height: 1050px;
            margin: 24px auto;
            padding: 52px;
            background: #fffdf8;
            border-top: 10px solid #0b3027;
            box-shadow: 0 15px 45px rgba(0,0,0,.12);
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 30px;
            padding-bottom: 25px;
            border-bottom: 1px solid #d9cfb8;
          }

          .brand {
            color: #0b3027;
            font-family: Georgia, serif;
            font-size: 28px;
            letter-spacing: .08em;
          }

          .tagline {
            margin-top: 7px;
            color: #a67f2d;
            font-family: Georgia, serif;
            font-style: italic;
          }

          .document-title {
            text-align: right;
          }

          .document-title h1 {
            margin: 0 0 8px;
            font: 500 31px Georgia, serif;
          }

          .document-title span, .label {
            color: #746c5d;
            font-size: 10px;
            letter-spacing: .1em;
            text-transform: uppercase;
          }

          .notice {
            margin-top: 18px;
            padding: 10px 14px;
            border: 1px solid #d7c79e;
            background: #f5efe1;
            color: #765b20;
            font-size: 11px;
            font-weight: bold;
            text-align: center;
            text-transform: uppercase;
          }

          .parties {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            margin: 24px 0;
          }

          .party {
            padding: 18px;
            background: #f3efe5;
            border-left: 4px solid #bd963f;
          }

          .party strong {
            display: block;
            margin: 7px 0 4px;
            font: 500 21px Georgia, serif;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th, td {
            padding: 12px 9px;
            border-bottom: 1px solid #ded8ca;
            text-align: left;
          }

          th {
            color: #746c5d;
            font-size: 10px;
            letter-spacing: .08em;
            text-transform: uppercase;
          }

          th:last-child, td:last-child {
            text-align: right;
          }

          .summary {
            width: 55%;
            margin: 26px 0 0 auto;
          }

          .summary div {
            display: flex;
            justify-content: space-between;
            padding: 9px 0;
            border-bottom: 1px solid #ded8ca;
          }

          .summary span {
            color: #746c5d;
            font-size: 11px;
            text-transform: uppercase;
          }

          .summary .outstanding {
            margin-top: 8px;
            padding: 16px;
            border: 0;
            background: #0b3027;
            color: white;
          }

          .summary .outstanding span {
            color: #dfc98f;
          }

          .summary .outstanding strong {
            font: 500 24px Georgia, serif;
          }

          .terms {
            margin-top: 28px;
            padding: 18px;
            border: 1px solid #ded8ca;
            font-size: 12px;
            line-height: 1.6;
          }

          .footer {
            margin-top: 34px;
            padding-top: 17px;
            border-top: 1px solid #d9cfb8;
            color: #746c5d;
            font-size: 10px;
            line-height: 1.7;
          }

          .actions {
            width: min(794px, calc(100% - 32px));
            margin: 0 auto 30px;
            text-align: right;
          }

          button {
            border: 0;
            border-radius: 7px;
            padding: 13px 20px;
            background: #0b3027;
            color: white;
            font-weight: bold;
            cursor: pointer;
          }

          @media print {
            html, body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              background: white;
            }

            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .invoice {
              width: 210mm;
              height: 297mm;
              min-height: 0;
              margin: 0;
              padding: 12mm 14mm 10mm;
              border-top-width: 3mm;
              box-shadow: none;
              overflow: hidden;
            }

            .actions { display: none; }

            @page {
              size: A4;
              margin: 0;
            }
          }
        </style>
      </head>

      <body>
        <main class="invoice">
          <header class="header">
            <div>
              <div class="brand">IMBONDEIRO TRAVEL</div>
              <div class="tagline">Your Lifetime Experience</div>
            </div>

            <div class="document-title">
              <h1>Pro Forma Invoice</h1>
              <span>${escapeHtml(proFormaNumber)}</span>
            </div>
          </header>

          <div class="notice">
            Pro Forma Invoice · Not a Tax Invoice
          </div>

          <section class="parties">
            <div class="party">
              <span class="label">Prepared for</span>
              <strong>
                ${escapeHtml(reservation.customer || "Customer not specified")}
              </strong>
              <div>
                ${escapeHtml(reservation.journey || "Journey not specified")}
              </div>
            </div>

            <div class="party">
              <span class="label">Journey details</span>
              <strong>
                ${escapeHtml(
                  departure?.title ||
                  reservation.journey ||
                  "Journey"
                )}
              </strong>
              <div>
                Departure:
                ${escapeHtml(formatDate(departure?.start_date))}
              </div>
            </div>
          </section>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Travellers</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  ${escapeHtml(
                    reservation.journey ||
                    departure?.title ||
                    "Travel reservation"
                  )}
                </td>
                <td>${escapeHtml(reservation.travellers || 0)}</td>
                <td>${escapeHtml(formatMoney(bookingTotal))}</td>
              </tr>
            </tbody>
          </table>

          <section class="summary">
            <div>
              <span>Booking total</span>
              <strong>${escapeHtml(formatMoney(bookingTotal))}</strong>
            </div>

            <div>
              <span>Gross paid</span>
              <strong>${escapeHtml(formatMoney(grossPaid))}</strong>
            </div>

            <div>
              <span>Refunded</span>
              <strong>${escapeHtml(formatMoney(refunded))}</strong>
            </div>

            <div>
              <span>Net paid</span>
              <strong>${escapeHtml(formatMoney(netPaid))}</strong>
            </div>

            <div class="outstanding">
              <span>Outstanding balance</span>
              <strong>${escapeHtml(formatMoney(outstanding))}</strong>
            </div>
          </section>

          <section class="terms">
            <span class="label">Payment information</span>
            <p>
              Please quote
              <strong>${escapeHtml(proFormaNumber)}</strong>
              and the customer name when making payment.
              Contact Imbondeiro Travel for confirmed banking instructions.
            </p>
          </section>

          <footer class="footer">
            <strong>Imbondeiro Travel</strong><br>
            www.imbondeirotravel.com · imbondeirotravel@gmail.com<br>
            Portugal: +351 936 347 702 · South Africa: +27 79 446 7370<br><br>
            This document is provided for reservation and payment
            planning purposes. It is not a tax invoice or proof of payment.
          </footer>
        </main>

        <div class="actions">
          <button onclick="window.print()">
            Print / Save as PDF
          </button>
        </div>
      </body>
    </html>
  `);

  invoiceWindow.document.close();
}
