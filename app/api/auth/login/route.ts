import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { setAuthSession, validateCredentials } from "@/lib/auth";

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
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Username and password are required",
          },
        },
        { status: 400 }
      );
    }

    // Get institution slug from host header
    const headersList = await headers();
    const host = headersList.get("host") || "";
    const expectedSlug = extractSlugFromHost(host);

    // Validate credentials
    if (!validateCredentials(username, password, expectedSlug)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid credentials",
          },
        },
        { status: 401 }
      );
    }

    // Set authentication session
    await setAuthSession(expectedSlug);

    return NextResponse.json({
      success: true,
      data: {
        message: "Login successful",
        slug: expectedSlug,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "An error occurred during login",
        },
      },
      { status: 500 }
    );
  }
}

