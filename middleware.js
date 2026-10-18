import { NextResponse } from "next/server";

function showComingSoon(request) {
  const url = request.nextUrl.clone();
  url.pathname = "/coming-soon";
  url.search = "";
  return NextResponse.rewrite(url);
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const internalRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api" ||
    pathname.startsWith("/api/");

  const comingSoonRoute =
    pathname === "/coming-soon" ||
    pathname.startsWith("/coming-soon/");

  const staticAsset =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/assets/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[a-zA-Z0-9]+$/.test(pathname);

  if (internalRoute || comingSoonRoute || staticAsset) {
    return NextResponse.next();
  }

  // Emergency override. Keep SITE_MODE unset for Command Centre control.
  const environmentMode = process.env.SITE_MODE;
  if (environmentMode === "coming_soon") return showComingSoon(request);
  if (environmentMode === "live") return NextResponse.next();

  try {
    const modeUrl = new URL("/api/public/site-mode", request.url);
    const response = await fetch(modeUrl, {
      cache: "no-store",
      headers: { "x-imbondeiro-site-mode-check": "1" },
    });

    // A failed or unrecognised response must not reveal the public site.
    if (!response.ok) return showComingSoon(request);

    const body = await response.json();
    if (body?.mode === "live") return NextResponse.next();
    return showComingSoon(request);
  } catch (error) {
    console.error("Website visibility check failed:", error);
    return showComingSoon(request);
  }
}

export const config = {
  matcher: "/:path*",
};
