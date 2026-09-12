"use client";

import { useState } from "react";
import { printTaxInvoice } from "./printTaxInvoice";

export default function InvoiceRegister({
  invoices = [],
  reload,
  flash,
}) {
  const [voidingId, setVoidingId] = useState("");

  const sortedInvoices = [...invoices].sort(
    (a, b) =>
      new Date(b.issued_at || 0) -
      new Date(a.issued_at || 0)
  );

  const formatMoney = invoice =>
    `${invoice.currency || "EUR"} ${Number(
      invoice.total || 0
    ).toFixed(2)}`;

  const formatDate = value => {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? String(value)
      : date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  };

  const voidInvoice = async invoice => {
    const reason = window.prompt(
      `Why are you voiding Tax Invoice ${invoice.invoice_number}?\n\nA reason is mandatory and will become part of the permanent audit record.`
    );

    if (reason === null) return;

    const cleanReason = reason.trim();

    if (!cleanReason) {
      window.alert(
        "A reason is required to void a Tax Invoice."
      );
      return;
    }

    const confirmed = window.confirm(
      `Void Tax Invoice ${invoice.invoice_number}?\n\nThis action cannot be reversed. The invoice will remain in the register with Void status.`
    );

    if (!confirmed) return;

    setVoidingId(invoice.id);

    try {
      const response = await fetch("/api/admin/invoices", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoice_id: invoice.id,
          void_reason: cleanReason,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ||
            "The Tax Invoice could not be voided."
        );
      }

      if (reload) {
        await reload();
      }

      if (flash) {
        flash(
          `Tax Invoice ${invoice.invoice_number} marked as Void.`
        );
      }
    } catch (error) {
      window.alert(
        error.message ||
          "The Tax Invoice could not be voided."
      );
    } finally {
      setVoidingId("");
    }
  };

  return (
    <section className="cc-panel">
      <div className="cc-panel-head">
        <div>
          <span className="cc-eyebrow">
            Permanent financial record
          </span>
          <h3>Tax Invoice Register</h3>
        </div>

        <span>
          {sortedInvoices.length} invoice
          {sortedInvoices.length === 1 ? "" : "s"}
        </span>
      </div>

      {sortedInvoices.length ? (
        <div className="cc-table-wrap">
          <table className="cc-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Issued</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {sortedInvoices.map(invoice => {
                const isVoid =
                  String(
                    invoice.status || ""
                  ).toLowerCase() === "void";

                return (
                  <tr key={invoice.id}>
                    <td>{invoice.invoice_number}</td>
                    <td>
                      {invoice.customer_name || "—"}
                    </td>
                    <td>{formatDate(invoice.issued_at)}</td>
                    <td>
                      <em
                        className={`cc-status ${String(
                          invoice.status || ""
                        ).toLowerCase()}`}
                      >
                        {invoice.status}
                      </em>
                    </td>
                    <td>{formatMoney(invoice)}</td>
                    <td>
                      <div className="cc-row-actions">
                        <button
                          type="button"
                          onClick={() =>
                            printTaxInvoice(invoice)
                          }
                        >
                          Open
                        </button>

                        {!isVoid && (
                          <button
                            type="button"
                            className="danger"
                            disabled={
                              voidingId === invoice.id
                            }
                            onClick={() =>
                              voidInvoice(invoice)
                            }
                          >
                            {voidingId === invoice.id
                              ? "Voiding..."
                              : "Void"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cc-empty">
          No official Tax Invoices have been issued.
          Preview documents do not appear in this register.
        </div>
      )}
    </section>
  );
}
