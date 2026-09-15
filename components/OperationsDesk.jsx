"use client";

import { useState } from "react";

const blankResource = {
  resource_type: "Guide",
  name: "",
  company: "",
  phone: "",
  email: "",
  location: "",
  languages: "",
  capacity: "",
  registration_number: "",
  status: "Active",
  notes: "",
};

const blankAssignment = {
  departure_id: "",
  resource_id: "",
  service_type: "Guide",
  role_or_service: "",
  assigned_from: "",
  assigned_until: "",
  cost: 0,
  currency: "EUR",
  confirmation_reference: "",
  status: "Planned",
  notes: "",
};

const resourceTypes = [
  "Guide",
  "Driver",
  "Vehicle",
  "Hotel",
  "Supplier",
  "Interpreter",
  "Meet & Greet",
  "Other",
];

const assignmentStatuses = [
  "Planned",
  "Confirmed",
  "Completed",
  "Cancelled",
];

function localDateTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 16);
}

function displayDateTime(value) {
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
function operationsMoney(
  value,
  currency = "EUR"
) {
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

export default function OperationsDesk({
  data,
  reload,
  flash,
}) {
  const resources = data.operations_resources || [];
  const assignments = data.departure_assignments || [];
  const departures = data.departures || [];

  const [editor, setEditor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const openResource = resource => {
    setSaveError("");
    setEditor({
      section: "operations_resources",
      record: {
        ...blankResource,
        ...resource,
      },
    });
  };

  const openAssignment = assignment => {
    setSaveError("");
    setEditor({
      section: "departure_assignments",
      record: {
        ...blankAssignment,
        ...assignment,
        assigned_from: localDateTime(
          assignment.assigned_from
        ),
        assigned_until: localDateTime(
          assignment.assigned_until
        ),
      },
    });
  };

  const closeEditor = () => {
    if (saving) return;
    setEditor(null);
    setSaveError("");
  };

  const updateRecord = (field, value) => {
    setEditor(current => ({
      ...current,
      record: {
        ...current.record,
        [field]: value,
      },
    }));
  };

  const saveRecord = async event => {
    event.preventDefault();
    setSaveError("");
    setSaving(true);

    try {
      const section = editor.section;
      const record = { ...editor.record };

      if (section === "operations_resources") {
        record.capacity =
          record.capacity === "" ||
          record.capacity === null
            ? null
            : Number(record.capacity);
      }

      if (section === "departure_assignments") {
        record.cost = Number(record.cost || 0);

        record.assigned_from = record.assigned_from
          ? new Date(
              record.assigned_from
            ).toISOString()
          : null;

        record.assigned_until = record.assigned_until
          ? new Date(
              record.assigned_until
            ).toISOString()
          : null;
      }

      const response = await fetch(
        `/api/admin/records/${section}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(record),
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "The Operations record could not be saved."
        );
      }

      if (reload) {
        await reload();
      }

      if (flash) {
        flash(
          section === "operations_resources"
            ? "Operations resource saved."
            : "Departure assignment saved."
        );
      }

      closeEditor();
    } catch (error) {
      setSaveError(
        error.message ||
          "The Operations record could not be saved."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (section, id) => {
    const confirmed = window.confirm(
      section === "operations_resources"
        ? "Delete this Operations resource?"
        : "Delete this Departure assignment?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/records/${section}?id=${encodeURIComponent(
          id
        )}`,
        {
          method: "DELETE",
        }
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ||
            "The Operations record could not be deleted."
        );
      }

      if (reload) {
        await reload();
      }

      if (flash) {
        flash(
          section === "operations_resources"
            ? "Operations resource deleted."
            : "Departure assignment deleted."
        );
      }
    } catch (error) {
      window.alert(
        error.message ||
          "The Operations record could not be deleted."
      );
    }
  };

  const resourceName = resourceId =>
    resources.find(
      resource => resource.id === resourceId
    )?.name || "Resource unavailable";

  const departureName = departureId => {
    const departure = departures.find(
      item => item.id === departureId
    );

    if (!departure) return "Departure unavailable";

    return `${departure.title} — ${departure.start_date}`;
  };
const requiredOperationsServices = [
  "guide",
  "driver",
  "vehicle",
];

const operationsReadiness = departures
  .filter(departure => {
    const status = String(
      departure.status || ""
    ).toLowerCase();

    return ![
      "cancelled",
      "completed",
    ].includes(status);
  })
  
  .map(departure => {
    const departureAssignments = assignments.filter(
  assignment => {
    const status = String(
      assignment.status || ""
    ).toLowerCase();

    return (
      assignment.departure_id === departure.id &&
      ![
        "cancelled",
        "completed",
      ].includes(status)
    );
  }
);
const assignedServiceTypes = new Set(
  departureAssignments.map(assignment =>
    String(
      assignment.service_type || ""
    )
      .trim()
      .toLowerCase()
  )
);
    const unconfirmedServices =
  requiredOperationsServices.filter(service => {
    if (!assignedServiceTypes.has(service)) {
      return false;
    }

    return !departureAssignments.some(
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
    ? "action_required"
    : unconfirmedServices.length > 0
      ? "planned"
      : "ready";

    const supportingServices =
      departureAssignments.filter(assignment =>
        [
          "hotel",
          "supplier",
          "interpreter",
          "meet & greet",
        ].includes(
          String(
            assignment.service_type || ""
          )
            .trim()
            .toLowerCase()
        )
      );
const costsByCurrency =
  departureAssignments.reduce(
    (totals, assignment) => {
      const cost = Number(
        assignment.cost || 0
      );

      if (!Number.isFinite(cost) || cost <= 0) {
        return totals;
      }

      const currency = String(
        assignment.currency || "EUR"
      )
        .trim()
        .toUpperCase();

      totals[currency] =
        (totals[currency] || 0) + cost;

      return totals;
    },
    {}
  );

const costEntries = Object.entries(
  costsByCurrency
).sort(([firstCurrency], [secondCurrency]) =>
  firstCurrency.localeCompare(secondCurrency)
);

const hasNonEurCosts = costEntries.some(
  ([currency]) => currency !== "EUR"
);
 return {
  departure,
  assignments: departureAssignments,
  activeAssignmentCount:
    departureAssignments.length,
  missingServices,
  unconfirmedServices,
  supportingServices,
  costEntries,
  hasNonEurCosts,
  readinessState,
  ready: readinessState === "ready",
};  
});
    
 const assignedResourceForService = (
  readiness,
  serviceType
) => {
  const assignment = readiness.assignments.find(
    item =>
      String(
        item.service_type || ""
      )
        .trim()
        .toLowerCase() === serviceType
  );

  return assignment
    ? resourceName(assignment.resource_id)
    : "Missing";
}; 
  return (
    <>
     <section className="cc-panel">
  <div className="cc-panel-head">
    <div>
      <span className="cc-eyebrow">
        Departure readiness
      </span>
      <h3>Operations Readiness</h3>
    </div>

    <span>
      {
        operationsReadiness.filter(
          item => item.ready
        ).length
      }{" "}
      of {operationsReadiness.length} ready
    </span>
  </div>

  {operationsReadiness.length ? (
    <div className="cc-table-wrap">
      <table className="cc-table">
        <thead>
          <tr>
            <th>Departure</th>
            <th>Guide</th>
            <th>Driver</th>
            <th>Vehicle</th>
            <th>Assignments</th>
            <th>Operations Cost</th>
            <th>Supporting Services</th>
            <th>Readiness</th>
          </tr>
        </thead>

        <tbody>
          {operationsReadiness.map(readiness => (
            <tr key={readiness.departure.id}>
              <td>
                {readiness.departure.title}
                {" — "}
                {readiness.departure.start_date}
              </td>

              <td>
                {assignedResourceForService(
                  readiness,
                  "guide"
                )}
              </td>

              <td>
                {assignedResourceForService(
                  readiness,
                  "driver"
                )}
              </td>

              <td>
                {assignedResourceForService(
                  readiness,
                  "vehicle"
                )}
              </td>
             <td>
  {readiness.activeAssignmentCount}{" "}
  {readiness.activeAssignmentCount === 1
    ? "assignment"
    : "assignments"}
</td>

<td>
  {readiness.costEntries.length
    ? readiness.costEntries
        .map(([currency, total]) =>
          operationsMoney(total, currency)
        )
        .join(" + ")
    : operationsMoney(0, "EUR")}

  {readiness.hasNonEurCosts && (
    <div>
      Includes non-EUR costs — review separately
    </div>
  )}
</td>
              <td>
                {readiness.supportingServices.length
                  ? readiness.supportingServices
                      .map(assignment =>
                        `${assignment.service_type}: ${resourceName(
                          assignment.resource_id
                        )}`
                      )
                      .join(", ")
                  : "—"}
              </td>

              <td>
                <em
                  className={`cc-status ${
                    readiness.ready
                      ? "active"
                      : "pending"
                  }`}
                >
                  {readiness.ready
                    ? "Ready"
                    : "Action Required"}
                </em>

                {!readiness.ready && (
                  <div>
                    Missing:{" "}
                    {readiness.missingServices
                      .map(service =>
                        service.replace(
                          /\b\w/g,
                          character =>
                            character.toUpperCase()
                        )
                      )
                      .join(", ")}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="cc-empty">
      No active departures require Operations planning.
    </div>
  )}
</section> 
      <section className="cc-panel">
        <div className="cc-panel-head">
          <div>
            <span className="cc-eyebrow">
              Operations directory
            </span>
            <h3>People, Partners & Resources</h3>
          </div>

          <button
            type="button"
            className="cc-primary"
            onClick={() => openResource({})}
          >
            ＋ Add Resource
          </button>
        </div>

        {resources.length ? (
          <div className="cc-table-wrap">
            <table className="cc-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {resources.map(resource => {
                  const isAssigned = assignments.some(
                    assignment =>
                      assignment.resource_id === resource.id
                  );

                  return (
                    <tr key={resource.id}>
                      <td>{resource.resource_type}</td>
                      <td>{resource.name}</td>
                      <td>{resource.company || "—"}</td>
                      <td>{resource.location || "—"}</td>
                      <td>
                        <em
                          className={`cc-status ${String(
                            resource.status || ""
                          ).toLowerCase()}`}
                        >
                          {resource.status}
                        </em>
                      </td>
                      <td>
                        <div className="cc-row-actions">
                          <button
                            type="button"
                            onClick={() =>
                              openResource(resource)
                            }
                          >
                            Edit
                          </button>

                          {isAssigned ? (
                            <button
                              type="button"
                              disabled
                              title="Assigned resources are protected from deletion"
                            >
                              Protected
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="danger"
                              onClick={() =>
                                deleteRecord(
                                  "operations_resources",
                                  resource.id
                                )
                              }
                            >
                              Delete
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
            No operational resources have been added.
          </div>
        )}
      </section>

      <section className="cc-panel">
        <div className="cc-panel-head">
          <div>
            <span className="cc-eyebrow">
              Departure operations
            </span>
            <h3>Resource Assignments</h3>
          </div>

          <button
            type="button"
            className="cc-primary"
            onClick={() => openAssignment({})}
            disabled={!resources.length || !departures.length}
            title={
              !resources.length || !departures.length
                ? "Add at least one resource and departure first"
                : "Assign a resource to a departure"
            }
          >
            ＋ Add Assignment
          </button>
        </div>

        {assignments.length ? (
          <div className="cc-table-wrap">
            <table className="cc-table">
              <thead>
                <tr>
                  <th>Departure</th>
                  <th>Resource</th>
                  <th>Service</th>
                  <th>From</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {assignments.map(assignment => (
                  <tr key={assignment.id}>
                    <td>
                      {departureName(
                        assignment.departure_id
                      )}
                    </td>
                    <td>
                      {resourceName(
                        assignment.resource_id
                      )}
                    </td>
                    <td>{assignment.service_type}</td>
                    <td>
                      {displayDateTime(
                        assignment.assigned_from
                      )}
                    </td>
                    <td>
                      <em
                        className={`cc-status ${String(
                          assignment.status || ""
                        ).toLowerCase()}`}
                      >
                        {assignment.status}
                      </em>
                    </td>
                    <td>
                      <div className="cc-row-actions">
                        <button
                          type="button"
                          onClick={() =>
                            openAssignment(assignment)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() =>
                            deleteRecord(
                              "departure_assignments",
                              assignment.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="cc-empty">
            No resources have been assigned to departures.
          </div>
        )}
      </section>

      {editor && (
        <div
          className="cc-modal-backdrop"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              closeEditor();
            }
          }}
        >
          <form
            className="cc-modal"
            onSubmit={saveRecord}
          >
            <div className="cc-modal-head">
              <div>
                <span className="cc-eyebrow">
                  Operations editor
                </span>
                <h2>
                  {editor.record.id ? "Edit" : "Add"}{" "}
                  {editor.section ===
                  "operations_resources"
                    ? "Resource"
                    : "Assignment"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                disabled={saving}
              >
                ×
              </button>
            </div>

            {editor.section ===
            "operations_resources" ? (
              <div className="cc-form-grid">
                <label>
                  Resource Type
                  <select
                    required
                    value={editor.record.resource_type}
                    onChange={event =>
                      updateRecord(
                        "resource_type",
                        event.target.value
                      )
                    }
                  >
                    {resourceTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Name
                  <input
                    required
                    value={editor.record.name}
                    onChange={event =>
                      updateRecord(
                        "name",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Company
                  <input
                    value={editor.record.company}
                    onChange={event =>
                      updateRecord(
                        "company",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Phone
                  <input
                    value={editor.record.phone}
                    onChange={event =>
                      updateRecord(
                        "phone",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    value={editor.record.email}
                    onChange={event =>
                      updateRecord(
                        "email",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Location
                  <input
                    value={editor.record.location}
                    onChange={event =>
                      updateRecord(
                        "location",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Languages
                  <input
                    value={editor.record.languages}
                    onChange={event =>
                      updateRecord(
                        "languages",
                        event.target.value
                      )
                    }
                    placeholder="Portuguese, English"
                  />
                </label>

               <label>
  Capacity
  <input
    type="number"
    min="0"
    value={editor.record.capacity}
    onInvalid={event => {
      const input = event.currentTarget;

      input.setCustomValidity(
        input.validity.rangeUnderflow
          ? "Capacity must be greater than or equal to zero."
          : "Enter a valid capacity."
      );
    }}
    onInput={event =>
      event.currentTarget.setCustomValidity("")
    }
    onChange={event =>
      updateRecord(
        "capacity",
        event.target.value
      )
    }
  />
</label>
                <label>
                  Registration Number
                  <input
                    value={
                      editor.record.registration_number
                    }
                    onChange={event =>
                      updateRecord(
                        "registration_number",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Status
                  <select
                    required
                    value={editor.record.status}
                    onChange={event =>
                      updateRecord(
                        "status",
                        event.target.value
                      )
                    }
                  >
                    <option value="Active">
                      Active
                    </option>
                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </label>

                <label className="full">
                  Notes
                  <textarea
                    rows="4"
                    value={editor.record.notes}
                    onChange={event =>
                      updateRecord(
                        "notes",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>
            ) : (
              <div className="cc-form-grid">
                <label>
                  Departure
                  <select
                    required
                    value={editor.record.departure_id}
                    onChange={event =>
                      updateRecord(
                        "departure_id",
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Choose departure
                    </option>
                    {departures.map(departure => (
                      <option
                        key={departure.id}
                        value={departure.id}
                      >
                        {departure.title} —{" "}
                        {departure.start_date}
                      </option>
                    ))}
                  </select>
                </label>

               <label>
  Resource
  <select
    required
    value={editor.record.resource_id}
    onChange={event =>
      updateRecord(
        "resource_id",
        event.target.value
      )
    }
  >
    <option value="">
      Choose{" "}
      {editor.record.service_type || "resource"}
    </option>

    {resources
      .filter(resource => {
        const resourceIsCurrent =
          resource.id ===
          editor.record.resource_id;

        const resourceIsActive =
          String(
            resource.status || "Active"
          ).toLowerCase() !== "inactive";

        const resourceMatchesService =
          String(
            resource.resource_type || ""
          )
            .trim()
            .toLowerCase() ===
          String(
            editor.record.service_type || ""
          )
            .trim()
            .toLowerCase();

        return (
          resourceMatchesService &&
          (resourceIsActive || resourceIsCurrent)
        );
      })
      .map(resource => (
        <option
          key={resource.id}
          value={resource.id}
        >
          {resource.name} —{" "}
          {resource.resource_type}
        </option>
      ))}
  </select>
</label>

<label>
  Service Type
  <select
    required
    value={editor.record.service_type}
    onChange={event => {
      const serviceType = event.target.value;

      setEditor(current => ({
        ...current,
             record: {
  ...current.record,
  service_type: serviceType,
  resource_id: "",
  role_or_service: "",
}, 
      }));
    }}
  >
    {resourceTypes.map(type => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </select>
</label>
                <label>
                  Role or Service
                  <input
                    value={
                      editor.record.role_or_service
                    }
                    onChange={event =>
                      updateRecord(
                        "role_or_service",
                        event.target.value
                      )
                    }
                    placeholder="Lead guide, airport transfer…"
                  />
                </label>

                <label>
                  Assigned From
                  <input
                    type="datetime-local"
                    value={editor.record.assigned_from}
                    onChange={event =>
                      updateRecord(
                        "assigned_from",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Assigned Until
                  <input
                    type="datetime-local"
                    value={editor.record.assigned_until}
                    onChange={event =>
                      updateRecord(
                        "assigned_until",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
  Cost
  <input
    type="number"
    min="0"
    step="0.01"
    value={editor.record.cost}
    onInvalid={event => {
      const input = event.currentTarget;

      input.setCustomValidity(
        input.validity.rangeUnderflow
          ? "Cost must be greater than or equal to zero."
          : "Enter a valid cost."
      );
    }}
    onInput={event =>
      event.currentTarget.setCustomValidity("")
    }
    onChange={event =>
      updateRecord(
        "cost",
        event.target.value
      )
    }
  />
</label>

                <label>
                  Currency
                  <input
                    required
                    value={editor.record.currency}
                    onChange={event =>
                      updateRecord(
                        "currency",
                        event.target.value.toUpperCase()
                      )
                    }
                  />
                </label>

                <label>
                  Confirmation Reference
                  <input
                    value={
                      editor.record
                        .confirmation_reference
                    }
                    onChange={event =>
                      updateRecord(
                        "confirmation_reference",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Status
                  <select
                    required
                    value={editor.record.status}
                    onChange={event =>
                      updateRecord(
                        "status",
                        event.target.value
                      )
                    }
                  >
                    {assignmentStatuses.map(status => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="full">
                  Notes
                  <textarea
                    rows="4"
                    value={editor.record.notes}
                    onChange={event =>
                      updateRecord(
                        "notes",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>
            )}

            {saveError && (
              <div className="cc-error" role="alert">
                {saveError}
              </div>
            )}

            <div className="cc-modal-actions">
              <button
                type="button"
                onClick={closeEditor}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="cc-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editor.section ===
                      "operations_resources"
                    ? "Save Resource"
                    : "Save Assignment"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
