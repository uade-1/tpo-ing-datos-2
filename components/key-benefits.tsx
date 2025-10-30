import { Award, TrendingUp, Network, Heart } from "lucide-react"

/**
 * CUSTOMIZATION: Update benefits to reflect institution-specific advantages
 * Replace statistics and descriptions with actual data
 */
export function KeyBenefits() {
  const benefits = [
    {
      icon: Award,
      stat: "$50M+",
      label: "Awarded Annually",
      description: "We invest significantly in student success through comprehensive scholarship funding.",
    },
    {
      icon: TrendingUp,
      stat: "95%",
      label: "Graduate Success Rate",
      description: "Our scholarship recipients achieve exceptional outcomes and career advancement.",
    },
    {
      icon: Network,
      stat: "10,000+",
      label: "Alumni Network",
      description: "Join a global community of successful graduates and industry leaders.",
    },
    {
      icon: Heart,
      stat: "100%",
      label: "Student Support",
      description: "Comprehensive mentorship, counseling, and academic support services.",
    },
  ]

  return (
    <section id="benefits" className="border-b border-border bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Why Choose Our Institution</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            We're committed to providing exceptional educational opportunities and comprehensive support for all our
            scholarship recipients.
          </p>
        </div>

        {/* CUSTOMIZATION POINT: Update benefit cards with institution data */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                  <Icon className="h-8 w-8 text-accent" aria-hidden="true" />
                </div>
                <div className="text-4xl font-bold">{benefit.stat}</div>
                <div className="mt-2 text-sm font-medium text-muted-foreground">{benefit.label}</div>
                <p className="mt-3 text-pretty text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>

        {/* Additional benefits list */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {/* CUSTOMIZATION POINT: Update additional benefits */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold">World-Class Faculty</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Learn from renowned professors and industry experts committed to your success.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold">Modern Facilities</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Access state-of-the-art laboratories, libraries, and learning spaces.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold">Career Services</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Benefit from dedicated career counseling and job placement assistance.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
