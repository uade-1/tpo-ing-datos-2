"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export function InstitutionHero() {
  const scrollToDemo = () => {
    document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background to-muted/20 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="text-muted-foreground">Trusted by 500+ institutions worldwide</span>
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Launch Your Scholarship Program in <span className="text-primary">Days, Not Months</span>
          </h1>

          <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
            EduScale is the complete white-label platform for managing scholarships. Deploy a fully branded portal,
            automate applications, and scale your impact without the technical complexity.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" onClick={scrollToDemo} className="gap-2">
              Request a Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#features">Explore Features</a>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Setup in 48 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>Fully white-labeled</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span>No technical expertise needed</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">Institutions Served</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">2M+</div>
            <div className="text-sm text-muted-foreground">Applications Processed</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">98%</div>
            <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-4xl font-bold text-primary">48hrs</div>
            <div className="text-sm text-muted-foreground">Average Setup Time</div>
          </div>
        </div>
      </div>
    </section>
  )
}
