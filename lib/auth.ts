import { cookies } from "next/headers";

const AUTH_COOKIE_PREFIX = "institution-auth-";
const AUTH_PASSWORD = "123456"; // Hardcoded password for all institutions

/**
 * Set authentication session for an institution
 */
export async function setAuthSession(slug: string): Promise<void> {
  const cookieStore = await cookies();
  const cookieName = `${AUTH_COOKIE_PREFIX}${slug}`;
  const token = `${slug}:${Date.now()}`;
  
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

/**
 * Get and validate authentication session
 * Returns the institution slug if authenticated, null otherwise
 */
export async function getAuthSession(slug: string): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieName = `${AUTH_COOKIE_PREFIX}${slug}`;
  const token = cookieStore.get(cookieName)?.value;
  
  if (!token) {
    return null;
  }
  
  // Validate token format: slug:timestamp
  const [tokenSlug] = token.split(":");
  if (tokenSlug === slug) {
    return slug;
  }
  
  return null;
}

/**
 * Clear authentication session
 */
export async function clearAuthSession(slug: string): Promise<void> {
  const cookieStore = await cookies();
  const cookieName = `${AUTH_COOKIE_PREFIX}${slug}`;
  cookieStore.delete(cookieName);
}

/**
 * Validate login credentials
 * Username must match the institution slug, password must be "123456"
 */
export function validateCredentials(
  username: string,
  password: string,
  expectedSlug: string
): boolean {
  return username === expectedSlug && password === AUTH_PASSWORD;
}

