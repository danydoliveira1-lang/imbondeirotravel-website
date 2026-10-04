import { supabaseRequest } from "./supabaseRest";

const RESERVATION_RULE_IDS = new Set([
  "enquiry_follow_up",
  "quote_follow_up",
  "hold_expiry",
]);

const HOUR = 60 * 60 * 1000;

function normaliseStatus(value) {
  return String(value || "").trim().toLowerCase().replaceAll("_", " ");
}

function validDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function addHours(date, hours) {
  return new Date(date.getTime() + Number(hours || 0) * HOUR);
}

function reservationName(reservation) {
  return reservation.customer || reservation.journey || reservation.id;
}

function makeTask(rule, reservation, { title, description, dueAt, metadata = {} }) {
  return {
    rule_id: rule.id,
    entity_type: "reservation",
    entity_id: String(reservation.id),
    title,
    description,
    severity: rule.severity,
    status: "open",
    due_at: dueAt ? dueAt.toISOString() : null,
    detected_at: new Date().toISOString(),
    completed_at: null,
    metadata: {
      customer: reservation.customer || "",
      journey: reservation.journey || "",
      reservation_status: reservation.status || "",
      ...metadata,
    },
    fingerprint: `${rule.id}:reservation:${reservation.id}`,
    updated_at: new Date().toISOString(),
  };
}

function evaluateReservation(rule, reservation, now) {
  const status = normaliseStatus(reservation.status);
  const threshold = Number(rule.threshold_hours || 0);
  const createdAt = validDate(reservation.created_at);
  const updatedAt = validDate(reservation.updated_at) || createdAt;
  const lastContactedAt = validDate(reservation.last_contacted_at);
  const followUpDueAt = validDate(reservation.follow_up_due_at);
  const name = reservationName(reservation);

  if (rule.id === "enquiry_follow_up" && status === "enquiry") {
    const dueAt = followUpDueAt || (updatedAt ? addHours(updatedAt, threshold) : null);
    const needsFollowUp = followUpDueAt
      ? followUpDueAt <= now
      : !lastContactedAt && dueAt && dueAt <= now;

    if (needsFollowUp) {
      return makeTask(rule, reservation, {
        title: `Respond to enquiry â€” ${name}`,
        description: "This enquiry has reached its follow-up deadline and needs a personal response.",
        dueAt,
      });
    }
  }

  if (rule.id === "quote_follow_up" && status === "quoted") {
    const anchor = lastContactedAt || updatedAt;
    const dueAt = followUpDueAt || (anchor ? addHours(anchor, threshold) : null);

    if (dueAt && dueAt <= now) {
      return makeTask(rule, reservation, {
        title: `Follow up on quote â€” ${name}`,
        description: "The quotation is awaiting a customer decision and has reached its follow-up deadline.",
        dueAt,
      });
    }
  }

  if (rule.id === "hold_expiry" && status === "on hold") {
    const holdExpiresAt = validDate(reservation.hold_expires_at);

    if (!holdExpiresAt) {
      return makeTask(rule, reservation, {
        title: `Set hold expiry â€” ${name}`,
        description: "This reservation is on hold but does not have an expiry date.",
        dueAt: now,
        metadata: { reason: "missing_hold_expiry" },
      });
    }

    if (holdExpiresAt <= addHours(now, threshold)) {
      return makeTask(rule, reservation, {
        title: `Review expiring hold â€” ${name}`,
        description:
          holdExpiresAt <= now
            ? "This reservation hold has expired and requires a decision."
            : "This reservation hold is approaching expiry and requires review.",
        dueAt: holdExpiresAt,
        metadata: { reason: holdExpiresAt <= now ? "expired" : "expiring" },
      });
    }
  }

  return null;
}

async function updateTask(id, body) {
  return supabaseRequest("automation_tasks", {
    method: "PATCH",
    query: `id=eq.${encodeURIComponent(id)}`,
    body,
  });
}

export async function runAutomation({ mode = "manual" } = {}) {
  const startedAt = new Date().toISOString();
  const createdRun = await supabaseRequest("automation_runs", {
    method: "POST",
    body: {
      mode,
      status: "running",
      started_at: startedAt,
    },
  });
  const run = createdRun?.[0];

  try {
    const [rules, reservations, tasks] = await Promise.all([
      supabaseRequest("automation_rules", { query: "select=*&enabled=eq.true" }),
      supabaseRequest("reservations", { query: "select=*" }),
      supabaseRequest("automation_tasks", { query: "select=*" }),
    ]);

    const activeRules = (rules || []).filter(rule => RESERVATION_RULE_IDS.has(rule.id));
    const existingByFingerprint = new Map(
      (tasks || []).map(task => [task.fingerprint, task])
    );
    const candidates = [];
    const now = new Date();

    for (const reservation of reservations || []) {
      for (const rule of activeRules) {
        const task = evaluateReservation(rule, reservation, now);
        if (task) candidates.push(task);
      }
    }

    const activeFingerprints = new Set(candidates.map(task => task.fingerprint));
    let tasksCreated = 0;
    let tasksUpdated = 0;
    let tasksResolved = 0;

    for (const candidate of candidates) {
      const existing = existingByFingerprint.get(candidate.fingerprint);

      if (!existing) {
        await supabaseRequest("automation_tasks", {
          method: "POST",
          body: candidate,
        });
        tasksCreated += 1;
      } else if (existing.status === "open") {
        await updateTask(existing.id, {
          title: candidate.title,
          description: candidate.description,
          severity: candidate.severity,
          due_at: candidate.due_at,
          metadata: candidate.metadata,
          updated_at: new Date().toISOString(),
        });
        tasksUpdated += 1;
      }
    }

    for (const existing of tasks || []) {
      if (
        existing.status === "open" &&
        RESERVATION_RULE_IDS.has(existing.rule_id) &&
        !activeFingerprints.has(existing.fingerprint)
      ) {
        await updateTask(existing.id, {
          status: "completed",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        tasksResolved += 1;
      }
    }

    const completedAt = new Date().toISOString();
    if (run?.id) {
      await supabaseRequest("automation_runs", {
        method: "PATCH",
        query: `id=eq.${encodeURIComponent(run.id)}`,
        body: {
          status: "completed",
          tasks_created: tasksCreated,
          tasks_updated: tasksUpdated,
          tasks_resolved: tasksResolved,
          completed_at: completedAt,
        },
      });
    }

    return {
      status: "completed",
      tasksCreated,
      tasksUpdated,
      tasksResolved,
      activeTasks: activeFingerprints.size,
      completedAt,
    };
  } catch (error) {
    if (run?.id) {
      await supabaseRequest("automation_runs", {
        method: "PATCH",
        query: `id=eq.${encodeURIComponent(run.id)}`,
        body: {
          status: "failed",
          error_message: error.message || "Automation failed.",
          completed_at: new Date().toISOString(),
        },
      }).catch(() => null);
    }
    throw error;
  }
}
