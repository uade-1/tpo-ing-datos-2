import { Button } from "@/components/ui/button"
import Link from "next/link"

/**
 * CUSTOMIZATION: Update application steps to match institution process
 * Modify deadlines and requirements
 */
export function ApplicationProcess() {
  const steps = [
    {
      number: 1,
      title: "Create Your Account",
      description: "Register on our application portal and complete your profile with basic information.",
      timeline: "Start anytime",
    },
    {
      number: 2,
      title: "Submit Required Documents",
      description: "Upload transcripts, test scores, letters of recommendation, and your personal statement.",
      timeline: "2-3 weeks",
    },
    {
      number: 3,
      title: "Complete Application Form",
      description:
        "Fill out the comprehensive scholarship application with your academic and extracurricular achievements.",
      timeline: "1-2 weeks",
    },
    {
      number: 4,
      title: "Review and Submit",
      description:
        "Review all materials for accuracy and completeness, then submit your application before the deadline.",
      timeline: "Before deadline",
    },
    {
      number: 5,
      title: "Interview Process",
      description: "Selected candidates will be invited for an interview with our scholarship committee.",
      timeline: "4-6 weeks after submission",
    },
    {
      number: 6,
      title: "Receive Decision",
      description: "Scholarship decisions are communicated via email and your application portal.",
      timeline: "8-10 weeks after submission",
    },
  ]

  return (
    <section id="process" className="border-b border-border bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Application Process</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            Follow these simple steps to apply for our scholarship program. We've designed the process to be
            straightforward and accessible.
          </p>
        </div>

        {/* CUSTOMIZATION POINT: Update application steps */}
        <div className="mt-12 space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex gap-6">
              {/* Step number */}
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-accent bg-background font-bold text-accent">
                  {step.number}
                </div>
                {index < steps.length - 1 && <div className="mt-2 h-full w-0.5 bg-border" aria-hidden="true" />}
              </div>

              {/* Step content */}
              <div className="flex-1 pb-8">
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <span className="inline-flex w-fit items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {step.timeline}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important dates */}
        <div className="mt-16 rounded-lg border border-border bg-accent/5 p-8">
          <h3 className="text-center text-2xl font-bold">Important Dates</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* CUSTOMIZATION POINT: Update application deadlines */}
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">Dec 1, 2025</div>
              <div className="mt-2 text-sm font-medium">Early Application Deadline</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">Feb 15, 2026</div>
              <div className="mt-2 text-sm font-medium">Regular Application Deadline</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">Apr 1, 2026</div>
              <div className="mt-2 text-sm font-medium">Decision Notification</div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/apply">
            <Button size="lg" className="font-medium">
              Start Your Application
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
