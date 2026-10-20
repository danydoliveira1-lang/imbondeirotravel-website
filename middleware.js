import { NextResponse } from "next/server";

function showComingSoon(request) {
  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  url.search = "";
  return NextResponse.rewrite(url);
}

function isExempt(pathname) {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api" ||
    pathname.startsWith("/api/") ||
    pathname === "/coming-soon" ||
    pathname.startsWith("/coming-soon/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/assets/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

export async function middleware(request) {
  if (isExempt(request.nextUrl.pathname)) return NextResponse.next();

  // Emergency override. Leave SITE_MODE unset for Command Centre control.
  const override = process.env.SITE_MODE?.trim();
  if (override === "coming_soon") return showComingSoon(request);
  if (override === "live") return NextResponse.next();

  try {
    const base = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!base || !key) throw new Error("Missing Supabase configuration");

    const query = new URLSearchParams({
      select: "website_mode",
      id: "eq.imbondeiro-travel",
      limit: "1",
    });
    const response = await fetch(`${base}/rest/v1/company_settings?${query}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Supabase status ${response.status}`);
    const rows = await response.json();
    const mode = rows?.[0]?.website_mode;
    if (mode === "live") return NextResponse.next();
    if (mode === "coming_soon") return showComingSoon(request);
    throw new Error("Unrecognised or missing website mode");
  } catch (error) {
    console.error("Website visibility check failed:", error);
    // Fail closed for public pages; admin and APIs remain accessible.
    return showComingSoon(request);
  }
}

export const config = { matcher: "/:path*" };
