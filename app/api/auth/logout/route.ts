import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { clearAuthSession } from "@/lib/auth";

function extractSlugFromHost(host: string | null): string {
  if (!host) return "uade";
  const withoutPort = host.split(":")[0];
  const parts = withoutPort.split(".");
  if (parts.length >= 2 && parts[parts.length - 1] === "localhost") {
    return parts[0] || "uade";
  }
  return parts[0] || "uade";
}

export async function POST(req: NextRequest) {
  try {
    // Get institution slug from host header
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const slug = extractSlugFromHost(host);

    // Clear authentication session
    await clearAuthSession(slug);

    // Redirect to login page
    return NextResponse.redirect(new URL("/login", req.url));
  } catch (error) {
    console.error("Logout error:", error);
    // Even if there's an error, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

