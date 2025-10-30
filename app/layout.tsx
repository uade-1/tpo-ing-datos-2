import type React from "react"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { InstitutionProvider } from "@/components/institution-provider"
import { fetchInstitutionBySlug } from "@/lib/get-institution"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Scholarship Program",
  description:
    "Transform your future with our comprehensive scholarship opportunities. Apply now for merit-based, need-based, and field-specific scholarships.",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Extract tenant slug from host header
  const headersList = await headers()
  const host = headersList.get("host") || ""
  const withoutPort = host.split(":")[0]
  const parts = withoutPort.split(".")
  let derivedSlug = "uade" // default fallback
  
  // Extract subdomain from *.localhost pattern
  if (parts.length >= 2 && parts[parts.length - 1] === "localhost") {
    derivedSlug = parts[0] || "uade"
  } else if (parts.length > 2) {
    // Generic subdomain pattern
    derivedSlug = parts[0]
  }
  
  const institution = (await fetchInstitutionBySlug(derivedSlug)) || {
    nombre: derivedSlug.toUpperCase(),
    slug: derivedSlug,
    configuracion_tema: {},
  }
  const theme = institution.configuracion_tema || {}

  return (
    <html lang="en">
      <head>
        {/* Favicon override if provided */}
        {theme.favicon_url ? (
          <link rel="icon" href={theme.favicon_url} />
        ) : null}
      </head>
      <body className={`font-sans antialiased`}>
        <InstitutionProvider
          value={{ slug: institution.slug, nombre: institution.nombre, theme }}
        >
          {children}
        </InstitutionProvider>
        <Analytics />
      </body>
    </html>
  )
}
