"use client";

import { useEffect, useMemo, useState } from "react";

const billingFields = [
  "legal_company_name",
  "company_registration_number",
  "issuing_country",
  "registered_address",
  "tax_registration_number",
  "invoice_prefix",
  "default_tax_rate",
  "payment_instructions",
  "tax_invoice_enabled"
];

export default function BillingSettings({
  company = {},
  reload,
  flash
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(company);

  useEffect(() => {
    if (!editing) setForm(company);
  }, [company, editing]);

  const billingReady = useMemo(
    () =>
      [
        form.legal_company_name,
        form.issuing_country,
        form.registered_address,
        form.tax_registration_number,
        form.invoice_prefix
      ].every(value => String(value || "").trim()),
    [form]
  );

  const update = (field, value) => {
    setForm(current => ({
      ...current,
      [field]: value
    }));
  };

  const cancel = () => {
    setForm(company);
    setEditing(false);
  };

  const saveBilling = async event => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = Object.fromEntries(
        billingFields.map(field => [field, form[field]])
      );

      if (!billingReady) {
        payload.tax_invoice_enabled = false;
      }

      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        flash(result.error || "Billing settings save failed.");
        return;
      }

      await reload();
      setEditing(false);
      flash("Billing and tax settings updated.");
    } catch {
      flash("Billing settings save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="cc-panel">
      <div className="cc-panel-head">
        <div>
          <span className="cc-eyebrow">
            Tax invoice readiness
          </span>

          <h3>Billing &amp; Tax Identity</h3>
        </div>

        <div className="cc-row-actions">
          <span
            className={`cc-status ${
              billingReady &&
              company.tax_invoice_enabled
                ? "paid"
                : "pending"
            }`}
          >
            {billingReady &&
            company.tax_invoice_enabled
              ? "Invoice enabled"
              : billingReady
                ? "Ready to enable"
                : "Setup required"}
          </span>

          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
            >
              Configure Billing Details
            </button>
          ) : (
            <button
              type="button"
              onClick={cancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <p>
        Configure the legal identity used on future tax
        invoices. Tax Invoice controls remain locked until
        all required details are complete.
      </p>

      <div className="cc-stat-grid">
        <article>
          <span>Legal Company Name</span>

          {editing ? (
            <input
              value={form.legal_company_name || ""}
              onChange={event =>
                update(
                  "legal_company_name",
                  event.target.value
                )
              }
              placeholder="Registered legal name"
            />
          ) : (
            <strong>
              {company.legal_company_name ||
                "Not configured"}
            </strong>
          )}

          <small>Name registered with the authorities</small>
        </article>

        <article>
          <span>Company Registration Number</span>

          {editing ? (
            <input
              value={
                form.company_registration_number || ""
              }
              onChange={event =>
                update(
                  "company_registration_number",
                  event.target.value
                )
              }
              placeholder="Optional until confirmed"
            />
          ) : (
            <strong>
              {company.company_registration_number ||
                "Not configured"}
            </strong>
          )}

          <small>Legal business registration identifier</small>
        </article>

        <article>
          <span>Issuing Country</span>

          {editing ? (
            <select
              value={form.issuing_country || ""}
              onChange={event =>
                update(
                  "issuing_country",
                  event.target.value
                )
              }
            >
              <option value="">
                Choose issuing country
              </option>
              <option value="Angola">Angola</option>
              <option value="Portugal">Portugal</option>
              <option value="South Africa">
                South Africa
              </option>
            </select>
          ) : (
            <strong>
              {company.issuing_country ||
                "Not configured"}
            </strong>
          )}

          <small>Legal entity issuing the invoice</small>
        </article>

        <article>
          <span>Tax / VAT Registration Number</span>

          {editing ? (
            <input
              value={
                form.tax_registration_number || ""
              }
              onChange={event =>
                update(
                  "tax_registration_number",
                  event.target.value
                )
              }
              placeholder="Enter only when confirmed"
            />
          ) : (
            <strong>
              {company.tax_registration_number ||
                "Not configured"}
            </strong>
          )}

          <small>Confirmed tax identifier</small>
        </article>
      </div>

      <div className="cc-stat-grid">
        <article>
          <span>Registered Address</span>

          {editing ? (
            <textarea
              rows="4"
              value={form.registered_address || ""}
              onChange={event =>
                update(
                  "registered_address",
                  event.target.value
                )
              }
              placeholder="Full registered business address"
            />
          ) : (
            <strong>
              {company.registered_address ||
                "Not configured"}
            </strong>
          )}

          <small>Address shown on official documents</small>
        </article>

        <article>
          <span>Invoice Prefix</span>

          {editing ? (
            <input
              value={form.invoice_prefix || ""}
              onChange={event =>
                update(
                  "invoice_prefix",
                  event.target.value.toUpperCase()
                )
              }
              placeholder="INV"
            />
          ) : (
            <strong>
              {company.invoice_prefix || "INV"}
            </strong>
          )}

          <small>Beginning of future invoice numbers</small>
        </article>

        <article>
          <span>Default Tax Rate (%)</span>

          {editing ? (
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={form.default_tax_rate ?? 0}
              onChange={event =>
                update(
                  "default_tax_rate",
                  event.target.value
                )
              }
            />
          ) : (
            <strong>
              {Number(
                company.default_tax_rate || 0
              ).toFixed(2)}
              %
            </strong>
          )}

          <small>Must be confirmed by the accountant</small>
        </article>

        <article>
          <span>Tax Invoice Activation</span>

          {editing ? (
            <label>
              <input
                type="checkbox"
                checked={
                  form.tax_invoice_enabled === true
                }
                disabled={!billingReady}
                onChange={event =>
                  update(
                    "tax_invoice_enabled",
                    event.target.checked
                  )
                }
              />

              Enable Tax Invoices
            </label>
          ) : (
            <strong>
              {company.tax_invoice_enabled
                ? "Enabled"
                : "Disabled"}
            </strong>
          )}

          <small>
            Available only after required details are complete
          </small>
        </article>
      </div>

      <div className="cc-panel">
        <span className="cc-eyebrow">
          Payment instructions
        </span>

        {editing ? (
          <textarea
            rows="4"
            value={form.payment_instructions || ""}
            onChange={event =>
              update(
                "payment_instructions",
                event.target.value
              )
            }
            placeholder="Approved payment instructions for invoices"
          />
        ) : (
          <p>
            {company.payment_instructions ||
              "Not configured"}
          </p>
        )}
      </div>

      {editing && (
        <div className="cc-row-actions">
          <button
            type="button"
            className="cc-primary"
            disabled={saving}
            onClick={saveBilling}
          >
            {saving
              ? "Saving..."
              : "Save Billing Details"}
          </button>
        </div>
      )}
    </section>
  );
}
