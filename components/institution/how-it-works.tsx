import { CheckCircle2 } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Schedule a Demo",
    description:
      "Book a 30-minute call with our team to discuss your scholarship program needs and see the platform in action.",
  },
  {
    number: "02",
    title: "Customize Your Portal",
    description:
      "We configure your white-labeled portal with your branding, application requirements, and workflows in 48 hours.",
  },
  {
    number: "03",
    title: "Launch & Onboard",
    description: "Go live with your scholarship program. We provide training and ongoing support for your team.",
  },
  {
    number: "04",
    title: "Scale Your Impact",
    description: "Monitor applications, automate communications, and make data-driven decisions to grow your program.",
  },
]

export function InstitutionHowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-border/40 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">
            From Demo to Launch in 48 Hours
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Our streamlined onboarding process gets you up and running quickly, with no technical expertise required.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-2xl font-bold text-primary">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="mb-2 text-2xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                  {index < steps.length - 1 && <div className="mt-6 h-12 w-0.5 bg-border/50" />}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-lg border border-border/50 bg-muted/30 p-8">
            <h3 className="mb-4 text-xl font-semibold">What's Included in Setup</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "Custom domain configuration",
                "Brand colors and logo integration",
                "Application form customization",
                "Email template setup",
                "Team member onboarding",
                "Analytics dashboard configuration",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
