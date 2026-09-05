const allowedTables = new Set(["tours", "departures", "reservations", "customers", "media", "payments", "company_settings"]);

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured.");
  return { url: url.replace(/\/$/, ""), key };
}

export async function supabaseRequest(table, { method = "GET", query = "", body } = {}) {
  if (!allowedTables.has(table)) throw new Error("Unsupported Command Centre section.");
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${table}${query ? `?${query}` : ""}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: method === "POST" ? "return=representation,resolution=merge-duplicates" : method === "DELETE" ? "return=minimal" : "return=representation",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(await response.text());
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export async function getAllCommandCentreData() {
  const sections = ["tours", "departures", "reservations", "customers", "media", "payments", "company_settings"];
  const entries = await Promise.all(sections.map(async section => [section, await supabaseRequest(section, { query: "select=*&order=created_at.desc" })]));
  return Object.fromEntries(entries);
}
