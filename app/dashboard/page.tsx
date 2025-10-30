import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAuthSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardClient } from "./dashboard-client";

function extractSlugFromHost(host: string | null): string {
  if (!host) return "uade";
  const withoutPort = host.split(":")[0];
  const parts = withoutPort.split(".");
  if (parts.length >= 2 && parts[parts.length - 1] === "localhost") {
    return parts[0] || "uade";
  }
  return parts[0] || "uade";
}

export default async function DashboardPage() {
  // Get institution slug from host header
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const slug = extractSlugFromHost(host);

  // Check authentication
  const authSlug = await getAuthSession(slug);
  if (!authSlug) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <form action="/api/auth/logout" method="POST">
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Welcome to {slug.toUpperCase()} Dashboard</h2>
          <p className="text-gray-600">Manage your institution's enrollment and settings</p>
        </div>
        <div className="space-y-6">
          <DashboardClient slug={slug} />
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>View enrollment statistics and analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Dashboard content coming soon...</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure institution settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Dashboard content coming soon...</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

