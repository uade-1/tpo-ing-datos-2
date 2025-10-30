import { NextResponse, type NextRequest } from "next/server";

function extractSlug(host: string | null): string | null {
  if (!host) return null;
  // host may come as sub.localhost:3005 or sub.domain.tld
  const withoutPort = host.split(":")[0];
  const parts = withoutPort.split(".");
  // For *.localhost pattern, take first label
  if (parts.length >= 2 && parts[parts.length - 1] === "localhost") {
    return parts[0] || null;
  }
  // Generic subdomain: take first label if more than 2 labels
  if (parts.length > 2) return parts[0];
  return null;
}

export function middleware(req: NextRequest) {
  const host = req.headers.get("host");
  const slug = extractSlug(host) || "uade"; // default for dev

  const res = NextResponse.next();
  // Persist tenant slug for SSR fetches
  res.cookies.set("tenant-slug", slug, { path: "/" });
  return res;
}

export const config = {
  matcher: [
    "/((?!_next|api/auth|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};


