
const ALLOWED_INSTAGRAM_TABLES = new Set(["enquiries"]);

function instagramDevelopmentConfig() {
  const url = process.env.SUPABASE_DEV_URL;
  const key = process.env.SUPABASE_DEV_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Instagram development database is not configured."
    );
  }

  if (process.env.VERCEL_ENV !== "preview") {
    throw new Error(
      "Instagram development database is restricted to Preview."
    );
  }

  if (
    process.env.VERCEL_GIT_COMMIT_REF !==
    "feature/africa-middle-east-map"
  ) {
    throw new Error(
      "Instagram development database is restricted to its development branch."
    );
  }

  return {
    url: url.replace(/\/$/, ""),
    key,
  };
}

export async function instagramSupabaseRequest(
  table,
  { method = "GET", query = "", body } = {}
) {
  if (!ALLOWED_INSTAGRAM_TABLES.has(table)) {
    throw new Error("Unsupported Instagram database table.");
  }

  const { url, key } = instagramDevelopmentConfig();

  const response = await fetch(
    `${url}/rest/v1/${table}${query ? `?${query}` : ""}`,
    {
      method,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer:
          method === "POST"
            ? "return=representation"
            : "return=representation",
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Instagram development database request failed: ${response.status}`
    );
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
