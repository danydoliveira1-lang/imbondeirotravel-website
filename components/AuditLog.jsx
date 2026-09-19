"use client";

import { useMemo, useState } from "react";

function titleCase(value) {
  return String(value || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, letter =>
      letter.toUpperCase()
    );
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function recordLabel(log) {
  const values =
    log.new_values ||
    log.previous_values ||
    {};

  return (
    values.name ||
    values.title ||
    values.customer ||
    values.invoice_number ||
    values.reference ||
    log.record_id ||
    "Unknown record"
  );
}

export default function AuditLog({
  entries = [],
}) {
  const [actionFilter, setActionFilter] =
    useState("");
  const [sectionFilter, setSectionFilter] =
    useState("");
  const [administratorFilter, setAdministratorFilter] =
    useState("");

  const actions = useMemo(
    () =>
      [...new Set(
        entries
          .map(entry => entry.action)
          .filter(Boolean)
      )].sort(),
    [entries]
  );

  const sections = useMemo(
    () =>
      [...new Set(
        entries
          .map(entry => entry.section)
          .filter(Boolean)
      )].sort(),
    [entries]
  );

  const administrators = useMemo(
    () =>
      [...new Set(
        entries
          .map(entry => entry.actor_email)
          .filter(Boolean)
      )].sort(),
    [entries]
  );

  const filteredEntries = useMemo(
    () =>
      [...entries]
        .filter(
          entry =>
            !actionFilter ||
            entry.action === actionFilter
        )
        .filter(
          entry =>
            !sectionFilter ||
            entry.section === sectionFilter
        )
        .filter(
          entry =>
            !administratorFilter ||
            entry.actor_email ===
              administratorFilter
        )
        .sort(
          (first, second) =>
            new Date(second.created_at || 0) -
            new Date(first.created_at || 0)
        ),
    [
      entries,
      actionFilter,
      sectionFilter,
      administratorFilter,
    ]
  );

  const hasFilters =
    actionFilter ||
    sectionFilter ||
    administratorFilter;

  return (
    <section className="cc-audit-log">
      <div className="cc-audit-intro">
        <div>
          <span className="cc-eyebrow">
            Governance & accountability
          </span>

          <h2>Audit Log</h2>

          <p>
            Read-only history of changes made
            through the Command Centre.
          </p>
        </div>

        <strong>
          {filteredEntries.length}{" "}
          {filteredEntries.length === 1
            ? "activity"
            : "activities"}
        </strong>
      </div>

      <div className="cc-audit-filters">
        <label>
          <span>Action</span>

          <select
            value={actionFilter}
            onChange={event =>
              setActionFilter(
                event.target.value
              )
            }
          >
            <option value="">All actions</option>

            {actions.map(action => (
              <option
                key={action}
                value={action}
              >
                {titleCase(action)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Section</span>

          <select
            value={sectionFilter}
            onChange={event =>
              setSectionFilter(
                event.target.value
              )
            }
          >
            <option value="">All sections</option>

            {sections.map(section => (
              <option
                key={section}
                value={section}
              >
                {titleCase(section)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Administrator</span>

          <select
            value={administratorFilter}
            onChange={event =>
              setAdministratorFilter(
                event.target.value
              )
            }
          >
            <option value="">
              All administrators
            </option>

            {administrators.map(email => (
              <option
                key={email}
                value={email}
              >
                {email}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="cc-primary"
          disabled={!hasFilters}
          onClick={() => {
            setActionFilter("");
            setSectionFilter("");
            setAdministratorFilter("");
          }}
        >
          Reset Filters
        </button>
      </div>

      {filteredEntries.length ? (
        <div className="cc-audit-table-wrap">
          <table className="cc-audit-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Action</th>
                <th>Section</th>
                <th>Record</th>
                <th>Administrator</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {filteredEntries.map(entry => (
                <tr key={entry.id}>
                  <td>
                    {formatDateTime(
                      entry.created_at
                    )}
                  </td>

                  <td>
                    <span
                      className={`cc-audit-action ${String(
                        entry.action || ""
                      ).toLowerCase()}`}
                    >
                      {titleCase(entry.action)}
                    </span>
                  </td>

                  <td>
                    {titleCase(entry.section)}
                  </td>

                  <td>
                    <strong>
                      {recordLabel(entry)}
                    </strong>

                    <small>
                      {entry.record_id || "—"}
                    </small>
                  </td>

                  <td>
                    {entry.actor_email || "—"}
                  </td>

                  <td>
                    <details>
                      <summary>View change</summary>

                      <div className="cc-audit-change">
                        <div>
                          <strong>Before</strong>

                          <pre>
                            {entry.previous_values
                              ? JSON.stringify(
                                  entry.previous_values,
                                  null,
                                  2
                                )
                              : "No previous values"}
                          </pre>
                        </div>

                        <div>
                          <strong>After</strong>

                          <pre>
                            {entry.new_values
                              ? JSON.stringify(
                                  entry.new_values,
                                  null,
                                  2
                                )
                              : "No new values"}
                          </pre>
                        </div>
                      </div>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cc-empty">
          No audit activity matches the selected
          filters.
        </div>
      )}
    </section>
  );
}
