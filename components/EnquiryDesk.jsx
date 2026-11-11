
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const emptyForm = {
  customer_name: "",
  customer_email: "",
  customer_phone: "",
  customer_id: "",
  reservation_id: "",
  source: "manual",
  subject: "",
  destination: "",
  travel_start_date: "",
  travel_end_date: "",
  travellers: "",
  message: "",
  internal_notes: "",
  status: "new",
  assigned_to: "",
  follow_up_due_at: "",
};

const sources = [
  "manual", "website", "whatsapp",
  "instagram", "email", "telephone", "other",
];

const statuses = [
  "new", "in_progress", "quoted",
  "converted", "closed",
];

const label = value =>
  value.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());

function localDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function displayDate(value) {
  if (!value) return "Not scheduled";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function EnquiryDesk({ customers = [], reservations = [] }) {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadEnquiries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/enquiries", {
        cache: "no-store",
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.error || "Unable to load enquiries.");
      }
      setEnquiries(body.enquiries || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries]);

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return enquiries;

    return enquiries.filter(item =>
      [
        item.customer_name,
        item.customer_email,
        item.customer_phone,
        item.destination,
        item.subject,
        item.source,
        item.status,
        item.assigned_to,
      ].some(value => String(value || "").toLowerCase().includes(term))
    );
  }, [enquiries, search]);

  const metrics = useMemo(() => ({
    new: enquiries.filter(item => item.status === "new").length,
    inProgress: enquiries.filter(item => item.status === "in_progress").length,
    overdue: enquiries.filter(item =>
      item.follow_up_due_at &&
      new Date(item.follow_up_due_at) <= new Date() &&
      !["closed", "converted"].includes(item.status)
    ).length,
    converted: enquiries.filter(item => item.status === "converted").length,
  }), [enquiries]);

  function update(field, value) {
    setForm(previous => ({ ...previous, [field]: value }));
  }

  function startNew() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setNotice("");
    setFormOpen(true);
  }

  
function startEdit(item) {
  setEditingId(item.id);

  setForm({
    ...emptyForm,
    ...item,

    customer_name: item.customer_name || "",
    customer_email: item.customer_email || "",
    customer_phone: item.customer_phone || "",
    customer_id: item.customer_id || "",
    reservation_id: item.reservation_id || "",

    source: item.source || "manual",
    subject: item.subject || "",
    destination: item.destination || "",

    travel_start_date: item.travel_start_date || "",
    travel_end_date: item.travel_end_date || "",
    travellers: item.travellers ?? "",

    message: item.message || "",
    internal_notes: item.internal_notes || "",

    status: item.status || "new",
    assigned_to: item.assigned_to || "",

    follow_up_due_at: localDateTime(item.follow_up_due_at),
  });

  setError("");
  setNotice("");
  setFormOpen(true);
}


  function selectCustomer(id) {
    const customer = customers.find(item => item.id === id);

    setForm(previous => ({
      ...previous,
      customer_id: id,
      reservation_id: "",
      ...(customer ? {
        customer_name: customer.name || "",
        customer_email: customer.email || "",
        customer_phone: customer.phone || "",
      } : {}),
    }));
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        customer_name: String(form.customer_name ?? "").trim(),
        customer_email: form.customer_email.trim() || null,
        customer_phone: form.customer_phone.trim() || null,
        customer_id: form.customer_id || null,
        reservation_id: form.reservation_id || null,
        source: form.source,
        subject: form.subject.trim() || null,
        destination: form.destination.trim() || null,
        travel_start_date: form.travel_start_date || null,
        travel_end_date: form.travel_end_date || null,
        travellers: form.travellers === ""
          ? null : Number(form.travellers),
        message: form.message.trim() || null,
        internal_notes: form.internal_notes.trim() || null,
        status: form.status,
        assigned_to: form.assigned_to.trim() || null,
        follow_up_due_at: form.follow_up_due_at
          ? new Date(form.follow_up_due_at).toISOString()
          : null,
      };

      if (!payload.customer_name) {
        throw new Error("Customer name is required.");
      }

      if (payload.status === "converted" && !payload.reservation_id) {
        throw new Error("Link a reservation before marking an enquiry converted.");
      }

      const response = await fetch("/api/admin/enquiries", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingId ? { id: editingId, ...payload } : payload
        ),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error || "Unable to save enquiry.");
      }

      setFormOpen(false);
      setEditingId(null);
      setNotice(editingId ? "Enquiry updated." : "Enquiry registered.");
      await loadEnquiries();
    } catch (err) {
      setError(err.message || "Unable to save enquiry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="cc-dashboard">
      <section className="cc-welcome">
        <div>
          <span>IMBONDEIRO TRAVEL · CUSTOMER RELATIONS</span>
          <h2>Every enquiry.<br />One thoughtful response.</h2>
          
<p>
  Register and manage travel enquiries from Instagram,
  WhatsApp, email, the website and direct customer contact.
</p>

          <button type="button" className="cc-primary" onClick={startNew}>
            + Register New Enquiry
          </button>
        </div>
        <div className="cc-orbit">
          <span>ENQUIRY DESK</span>
          <strong>{enquiries.length}</strong>
          <small>recorded enquiries</small>
        </div>
      </section>

      <section className="cc-stat-grid">
        {[
          ["New enquiries", metrics.new],
          ["In progress", metrics.inProgress],
          ["Follow-ups due", metrics.overdue],
          ["Converted", metrics.converted],
        ].map(([name, count]) => (
          <article key={name}>
            <span>{name}</span>
            <strong>{count}</strong>
            <small>Live enquiry records</small>
          </article>
        ))}
      </section>

      <section className="cc-panel">
        <div className="cc-panel-head">
          <div>
            <span className="cc-eyebrow">Customer relationship management</span>
            <h3>Enquiry Register</h3>
          </div>
          <button type="button" onClick={loadEnquiries}>
            Refresh
          </button>
        </div>

        <input
          type="search"
          aria-label="Search enquiries"
          placeholder="Search customer, destination, source or consultant"
          value={search}
          onChange={event => setSearch(event.target.value)}
          style={{ width: "100%", padding: 12, marginBottom: 18 }}
        />

        {notice && <p role="status">{notice}</p>}
        {error && <div className="cc-error" role="alert">{error}</div>}
        {loading && <p>Loading enquiries…</p>}

        {!loading && filtered.length === 0 && (
          <p>
            No matching enquiries. Use Register New Enquiry to create
            the first record.
          </p>
        )}

        <div className="cc-activity">
          {!loading && filtered.map(item => (
            <div key={item.id}>
              <span className="cc-dot" />
              <div>
                <strong>{item.customer_name}</strong>
                <span>
                  {item.destination || "Destination to be confirmed"}
                  {" · "}{label(item.source)}
                  {" · "}{item.assigned_to || "Unassigned"}
                </span>
                <span>
                  Follow-up: {displayDate(item.follow_up_due_at)}
                </span>
              </div>
              <em className={`cc-status ${item.status}`}>
                {label(item.status)}
              </em>
              <button type="button" onClick={() => startEdit(item)}>
                Open / Edit
              </button>
            </div>
          ))}
        </div>
      </section>

      {formOpen && (
        <section className="cc-panel">
          <div className="cc-panel-head">
            <div>
              <span className="cc-eyebrow">Enquiry management</span>
              <h3>{editingId ? "Edit Enquiry" : "Register New Enquiry"}</h3>
            </div>
            <button type="button" onClick={() => setFormOpen(false)}>
              Close
            </button>
          </div>

          <form onSubmit={save} style={{ display: "grid", gap: 14 }}>
            <label>
              Existing customer (optional)
              <select value={form.customer_id || ""}
                onChange={event => selectCustomer(event.target.value)}>
                <option value="">New or unlinked customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Customer name *
              <input required value={form.customer_name || ""}
                onChange={event => update("customer_name", event.target.value)} />
            </label>

            <label>
              Email
              <input type="email" value={form.customer_email || ""}
                onChange={event => update("customer_email", event.target.value)} />
            </label>

            <label>
              Phone
              <input type="tel" value={form.customer_phone || ""}
                onChange={event => update("customer_phone", event.target.value)} />
            </label>

            <label>
              Enquiry source
              <select value={form.source}
                onChange={event => update("source", event.target.value)}>
                {sources.map(source => (
                  <option key={source} value={source}>{label(source)}</option>
                ))}
              </select>
            </label>

            <label>
              Subject
              <input value={form.subject || ""}
                onChange={event => update("subject", event.target.value)} />
            </label>

            <label>
              Destination
              <input value={form.destination || ""}
                onChange={event => update("destination", event.target.value)} />
            </label>

            <label>
              Travel start date
              <input type="date" value={form.travel_start_date || ""}
                onChange={event => update("travel_start_date", event.target.value)} />
            </label>

            <label>
              Travel end date
              <input type="date" value={form.travel_end_date || ""}
                onChange={event => update("travel_end_date", event.target.value)} />
            </label>

            <label>
              Travellers
              <input type="number" min="1" step="1"
                value={form.travellers ?? ""}
                onChange={event => update("travellers", event.target.value)} />
            </label>

            <label>
              Customer message
              <textarea rows="4" value={form.message || ""}
                onChange={event => update("message", event.target.value)} />
            </label>

            <label>
              Internal notes
              <textarea rows="3" value={form.internal_notes || ""}
                onChange={event => update("internal_notes", event.target.value)} />
            </label>

            <label>
              Assigned consultant
              <input value={form.assigned_to || ""}
                onChange={event => update("assigned_to", event.target.value)} />
            </label>

            <label>
              Follow-up date and time
              <input type="datetime-local"
                value={form.follow_up_due_at || ""}
                onChange={event => update("follow_up_due_at", event.target.value)} />
            </label>

            <label>
              Status
              <select value={form.status}
                onChange={event => update("status", event.target.value)}>
                {statuses.map(status => (
                  <option key={status} value={status}>{label(status)}</option>
                ))}
              </select>
            </label>

            <label>
              Linked reservation (optional)
              <select value={form.reservation_id || ""}
                onChange={event => update("reservation_id", event.target.value)}>
                <option value="">No linked reservation</option>
                {reservations
                  .filter(reservation =>
                    !form.customer_id ||
                    !reservation.customer_id ||
                    reservation.customer_id === form.customer_id
                  )
                  .map(reservation => (
                    <option key={reservation.id} value={reservation.id}>
                      {reservation.id} — {reservation.customer}
                    </option>
                  ))}
              </select>
            </label>

            {error && <div className="cc-error" role="alert">{error}</div>}

            <button type="submit" className="cc-primary" disabled={saving}>
              {saving ? "Saving…" : editingId ? "Save Changes" : "Register Enquiry"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
