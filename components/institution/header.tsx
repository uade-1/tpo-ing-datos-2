"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GraduationCap } from "lucide-react"

export function InstitutionHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/enroll-institution" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">EduScale</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Customers
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="#demo">Request Demo</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="#demo">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
