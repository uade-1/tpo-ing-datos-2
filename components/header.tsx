"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useInstitution } from "@/components/institution-provider"

/**
 * CUSTOMIZATION: Replace logo text with institution logo image
 * Update navigation links to match institution structure
 */
export function Header() {
  const inst = useInstitution()
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Institution logo + name */}
        <div className="flex items-center gap-2">
          {inst.theme?.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={inst.theme.logo_url} 
              alt={inst.nombre} 
              className="h-10 w-auto max-w-[120px] object-contain" 
              onError={(e) => {
                console.error("[Header] Failed to load logo:", inst.theme?.logo_url);
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="h-8 w-8 rounded bg-primary" aria-hidden="true" />
          )}
          <span className="text-lg font-semibold">{inst.nombre}</span>
        </div>

        {/* CUSTOMIZATION POINT: Update navigation links */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          <a
            href="#programs"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Programs
          </a>
          <a
            href="#benefits"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Benefits
          </a>
          <a
            href="#process"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Apply
          </a>
          <a href="#faq" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            FAQ
          </a>
        </nav>

        <Link href="/apply">
          <Button size="sm" className="font-medium">
            Apply Now
          </Button>
        </Link>
      </div>
    </header>
  )
}
