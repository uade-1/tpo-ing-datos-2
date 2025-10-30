"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useInstitution } from "@/components/institution-provider"

/**
 * CUSTOMIZATION: Update headline, description, and hero image
 * Customize CTA button text and form fields
 */
export function HeroSection() {
  const inst = useInstitution()
  return (
    <section className="relative overflow-hidden border-b border-border bg-background">
      <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-sm">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-muted-foreground">Now Accepting Applications for 2025-2026</span>
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {inst.theme?.mensajes?.titulo_bienvenida || "Transform Your Future with Our Scholarship Program"}
            </h1>

            <p className="text-pretty text-lg text-muted-foreground leading-relaxed">
              {inst.theme?.mensajes?.subtitulo_bienvenida ||
                "Join thousands of students who have achieved their academic dreams through our comprehensive scholarship opportunities."}
            </p>

            <div className="space-y-3">
              <Link href="/apply">
                <Button size="lg" className="w-full font-medium sm:w-auto">
                  Apply Now
                </Button>
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              By submitting, you agree to receive information about our scholarship programs.
            </p>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted lg:aspect-square">
            <img
              src="/diverse-students-studying-on-campus.jpg"
              alt="Students on campus"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
