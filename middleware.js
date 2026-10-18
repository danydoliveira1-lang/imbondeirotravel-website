import { NextResponse } from "next/server";

function showComingSoon(request) {
  const comingSoonUrl = request.nextUrl.clone();
  comingSoonUrl.pathname = "/coming-soon";

  return NextResponse.rewrite(comingSoonUrl);
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const protectedInternalRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api" ||
    pathname.startsWith("/api/");

  const comingSoonRoute =
    pathname === "/coming-soon" ||
    pathname.startsWith("/coming-soon/");

  const requiredWebsiteAsset =
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/assets/") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    /\.[a-zA-Z0-9]+$/.test(pathname);

  if (
    protectedInternalRoute ||
    comingSoonRoute ||
    requiredWebsiteAsset
  ) {
    return NextResponse.next();
  }

  /*
   * Vercel emergency override:
   * SITE_MODE=coming_soon always hides public pages.
   * SITE_MODE=live always keeps public pages visible.
   * When unset, the Command Centre database setting controls it.
   */
  const environmentMode = process.env.SITE_MODE;

  if (environmentMode === "coming_soon") {
    return showComingSoon(request);
  }

  if (environmentMode === "live") {
    return NextResponse.next();
  }

  try {
    const modeUrl = new URL(
      "/api/public/site-mode",
      request.url
    );

    const response = await fetch(modeUrl, {
      cache: "no-store",
      headers: {
        "x-imbondeiro-site-mode-check": "1",
      },
    });

    if (!response.ok) {
      return NextResponse.next();
    }

    const body = await response.json();

    if (body.mode === "coming_soon") {
      return showComingSoon(request);
    }
  } catch (error) {
    console.error(
      "Website visibility check failed:",
      error
    );
  }

  // Fail open: a temporary settings error must not
  // unexpectedly hide the website.
  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
