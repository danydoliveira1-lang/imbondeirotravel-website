import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const comingSoonEnabled =
    process.env.SITE_MODE === "coming_soon";

  if (!comingSoonEnabled) {
    return NextResponse.next();
  }

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

  const comingSoonUrl = request.nextUrl.clone();
  comingSoonUrl.pathname = "/coming-soon";

  return NextResponse.rewrite(comingSoonUrl);
}

export const config = {
  matcher: "/:path*",
};
