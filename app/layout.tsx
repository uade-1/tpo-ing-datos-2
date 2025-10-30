import type React from "react"
import type { Metadata } from "next"
import { headers } from "next/headers"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { InstitutionProvider } from "@/components/institution-provider"
import { ThemeInjector } from "@/components/theme-injector"
import { fetchInstitutionBySlug } from "@/lib/get-institution"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// Metadata will be generated dynamically based on institution
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const host = headersList.get("host") || ""
  const withoutPort = host.split(":")[0]
  const parts = withoutPort.split(".")
  let derivedSlug = "uade"
  
  if (parts.length >= 2 && parts[parts.length - 1] === "localhost") {
    derivedSlug = parts[0] || "uade"
  } else if (parts.length > 2) {
    derivedSlug = parts[0]
  }
  
  const institution = await fetchInstitutionBySlug(derivedSlug)
  const faviconUrl = institution?.configuracion_tema?.favicon_url
  
  return {
    title: "Scholarship Program",
    description:
      "Transform your future with our comprehensive scholarship opportunities. Apply now for merit-based, need-based, and field-specific scholarships.",
    generator: "v0.app",
    icons: faviconUrl ? {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    } : undefined,
  }
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
  const colores = theme.colores || {}

  // Build CSS variables for theme colors using hex values directly
  // These will override the default theme colors
  const cssVars: React.CSSProperties = {
    ...(colores.primario && { "--inst-primary": colores.primario }),
    ...(colores.secundario && { "--inst-secondary": colores.secundario }),
    ...(colores.acento && { "--inst-accent": colores.acento }),
    ...(colores.texto_primario && { "--inst-text-primary": colores.texto_primario }),
  } as React.CSSProperties

  return (
        <html lang="en" style={cssVars}>
          <body className={`font-sans antialiased`}>
            <InstitutionProvider
              value={{ slug: institution.slug, nombre: institution.nombre, theme, departamentos: institution.departamentos }}
            >
          <ThemeInjector />
          {children}
        </InstitutionProvider>
        <Analytics />
      </body>
    </html>
  )
}
