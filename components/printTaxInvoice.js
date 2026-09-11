export function printTaxInvoice(invoice) {
  if (!invoice) {
    window.alert("Tax Invoice data is unavailable.");
    return;
  }

  const escapeHtml = value =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const formatMoney = value =>
    `${escapeHtml(invoice.currency || "EUR")} ${Number(
      value || 0
    ).toFixed(2)}`;

  const formatDate = value => {
    if (!value) return "Not recorded";

    const date = new Date(
      String(value).includes("T")
        ? value
        : `${value}T12:00:00`
    );

    return Number.isNaN(date.getTime())
      ? escapeHtml(value)
      : date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
  };

  const invoiceWindow = window.open(
    "",
    "_blank",
    "width=900,height=850"
  );

  if (!invoiceWindow) {
    window.alert(
      "The Tax Invoice window was blocked. Please allow pop-ups for this website and try again."
    );
    return;
  }

  const isVoid =
    String(invoice.status || "").toLowerCase() === "void";

  invoiceWindow.document.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Tax Invoice ${escapeHtml(
          invoice.invoice_number || ""
        )}</title>

        <style>
          * {
            box-sizing: border-box;
          }

          html,
          body {
            margin: 0;
          }

          body {
            background: #ece9e1;
            color: #132a23;
            font-family: Arial, sans-serif;
          }

          .invoice {
            width: min(794px, calc(100% - 32px));
            min-height: 1050px;
            margin: 24px auto;
            padding: 48px 52px;
            background: #fffdf8;
            border-top: 10px solid #0b3027;
            box-shadow: 0 15px 45px rgba(0, 0, 0, .12);
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 30px;
            padding-bottom: 24px;
            border-bottom: 1px solid #d9cfb8;
          }

          .brand {
            color: #0b3027;
            font-family: Georgia, serif;
            font-size: 29px;
            letter-spacing: .07em;
          }

          .tagline {
            margin-top: 6px;
            color: #a67f2d;
            font-family: Georgia, serif;
            font-style: italic;
          }

          .document-title {
            text-align: right;
          }

          .document-title h1 {
            margin: 0 0 7px;
            font-family: Georgia, serif;
            font-size: 32px;
            font-weight: 500;
          }

          .document-title strong {
            font-size: 13px;
            letter-spacing: .08em;
          }

          .status {
            display: inline-block;
            margin-top: 18px;
            padding: 7px 13px;
            border-radius: 20px;
            background: ${
              isVoid ? "#ead9d6" : "#dce9df"
            };
            color: ${isVoid ? "#842f25" : "#1c593b"};
            font-size: 11px;
            font-weight: bold;
            letter-spacing: .06em;
            text-transform: uppercase;
          }

          .void-warning {
            margin-top: 14px;
            padding: 12px 15px;
            border: 1px solid #b85d50;
            color: #842f25;
            font-weight: bold;
          }

          .identity-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 18px;
            margin: 22px 0;
          }

          .identity-card {
            min-height: 138px;
            padding: 19px;
            background: #f3efe5;
            border-left: 4px solid #bd963f;
          }

          .label {
            display: block;
            margin-bottom: 7px;
            color: #746c5d;
            font-size: 10px;
            letter-spacing: .1em;
            text-transform: uppercase;
          }

          .identity-card strong {
            display: block;
            margin-bottom: 7px;
            font-family: Georgia, serif;
            font-size: 20px;
          }

          .identity-card p {
            margin: 4px 0;
            font-size: 12px;
            line-height: 1.45;
            white-space: pre-line;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            padding: 10px 8px;
            border-bottom: 1px solid #ded8ca;
            text-align: left;
            vertical-align: top;
          }

          th {
            color: #746c5d;
            font-size: 10px;
            letter-spacing: .08em;
            text-transform: uppercase;
          }

          .right {
            text-align: right;
          }

          .summary {
            width: 56%;
            margin: 20px 0 0 auto;
          }

          .summary div {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding: 8px 10px;
            border-bottom: 1px solid #ded8ca;
          }

          .summary span {
            color: #746c5d;
            font-size: 10px;
            letter-spacing: .07em;
            text-transform: uppercase;
          }

          .summary .total {
            margin-top: 6px;
            padding: 15px;
            border: 0;
            background: #0b3027;
            color: white;
          }

          .summary .total span {
            color: #dfc98f;
          }

          .summary .total strong {
            font-family: Georgia, serif;
            font-size: 22px;
          }

          .payment {
            margin-top: 20px;
            padding: 15px 18px;
            border: 1px solid #d9cfb8;
          }

          .payment p {
            margin: 6px 0 0;
            font-size: 12px;
            line-height: 1.5;
            white-space: pre-line;
          }

          .footer {
            margin-top: 25px;
            padding-top: 15px;
            border-top: 1px solid #d9cfb8;
            color: #746c5d;
            font-size: 10px;
            line-height: 1.6;
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
            html,
            body {
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
              padding: 11mm 14mm 9mm;
              border-top-width: 3mm;
              box-shadow: none;
              overflow: hidden;
              page-break-after: avoid;
              break-after: avoid-page;
            }

            .header {
              padding-bottom: 15px;
            }

            .brand {
              font-size: 24px;
            }

            .document-title h1 {
              font-size: 27px;
            }

            .status {
              margin-top: 12px;
              padding: 5px 11px;
            }

            .identity-grid {
              gap: 12px;
              margin: 15px 0;
            }

            .identity-card {
              min-height: 112px;
              padding: 14px;
            }

            .identity-card strong {
              font-size: 18px;
            }

            th,
            td {
              padding: 7px 6px;
            }

            .summary {
              margin-top: 13px;
            }

            .summary div {
              padding: 6px 9px;
            }

            .summary .total {
              padding: 11px;
            }

            .payment {
              margin-top: 13px;
              padding: 11px 14px;
            }

            .footer {
              margin-top: 16px;
              padding-top: 11px;
            }

            .actions {
              display: none;
            }

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
              <h1>Tax Invoice</h1>
              <strong>${escapeHtml(
                invoice.invoice_number || "Number unavailable"
              )}</strong>
              <div>${formatDate(invoice.issued_at)}</div>
            </div>
          </header>

          <div class="status">
            ${escapeHtml(invoice.status || "Issued")}
          </div>

          ${
            isVoid
              ? `
                <div class="void-warning">
                  VOID DOCUMENT
                  ${
                    invoice.void_reason
                      ? ` · ${escapeHtml(invoice.void_reason)}`
                      : ""
                  }
                </div>
              `
              : ""
          }

          <section class="identity-grid">
            <div class="identity-card">
              <span class="label">Issued by</span>
              <strong>${escapeHtml(
                invoice.legal_company_name ||
                  "Legal company name unavailable"
              )}</strong>
              <p>${escapeHtml(
                invoice.registered_address ||
                  "Registered address unavailable"
              )}</p>
              <p>${escapeHtml(
                invoice.issuing_country ||
                  "Issuing country unavailable"
              )}</p>
              ${
                invoice.company_registration_number
                  ? `<p>Company registration: ${escapeHtml(
                      invoice.company_registration_number
                    )}</p>`
                  : ""
              }
              <p>Tax/VAT number: ${escapeHtml(
                invoice.tax_registration_number ||
                  "Not recorded"
              )}</p>
            </div>

            <div class="identity-card">
              <span class="label">Billed to</span>
              <strong>${escapeHtml(
                invoice.customer_name ||
                  "Customer not specified"
              )}</strong>
              <p>${escapeHtml(
                invoice.journey ||
                  "Journey not specified"
              )}</p>
              <p>Travellers: ${escapeHtml(
                invoice.travellers || 0
              )}</p>
            </div>
          </section>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Departure</th>
                <th class="right">Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  <strong>${escapeHtml(
                    invoice.journey ||
                      "Travel services"
                  )}</strong>
                  ${
                    invoice.departure_title
                      ? `<div>${escapeHtml(
                          invoice.departure_title
                        )}</div>`
                      : ""
                  }
                </td>
                <td>${formatDate(invoice.departure_date)}</td>
                <td class="right">${formatMoney(
                  invoice.subtotal
                )}</td>
              </tr>
            </tbody>
          </table>

          <section class="summary">
            <div>
              <span>Subtotal</span>
              <strong>${formatMoney(invoice.subtotal)}</strong>
            </div>

            <div>
              <span>
                Tax (${Number(invoice.tax_rate || 0).toFixed(2)}%)
              </span>
              <strong>${formatMoney(invoice.tax_amount)}</strong>
            </div>

            <div class="total">
              <span>Total</span>
              <strong>${formatMoney(invoice.total)}</strong>
            </div>
          </section>

          ${
            invoice.payment_instructions
              ? `
                <section class="payment">
                  <span class="label">Payment instructions</span>
                  <p>${escapeHtml(
                    invoice.payment_instructions
                  )}</p>
                </section>
              `
              : ""
          }

          <footer class="footer">
            <strong>${escapeHtml(
              invoice.legal_company_name ||
                "Imbondeiro Travel"
            )}</strong><br>
            ${escapeHtml(
              invoice.registered_address || ""
            )}<br>
            Tax/VAT number:
            ${escapeHtml(
              invoice.tax_registration_number || "Not recorded"
            )}
            · Invoice:
            ${escapeHtml(invoice.invoice_number || "Not recorded")}
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
