import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Clock, DollarSign, Target } from "lucide-react"

const benefits = [
  {
    icon: TrendingUp,
    stat: "3x",
    label: "Increase in Applications",
    description: "Institutions see an average 3x increase in qualified applications within the first year.",
  },
  {
    icon: Clock,
    stat: "80%",
    label: "Time Saved",
    description: "Reduce administrative workload by 80% with automated workflows and smart filtering.",
  },
  {
    icon: DollarSign,
    stat: "$50K+",
    label: "Annual Savings",
    description: "Save on development, maintenance, and staffing costs compared to custom solutions.",
  },
  {
    icon: Target,
    stat: "95%",
    label: "Completion Rate",
    description: "Multi-step forms with auto-save lead to 95% application completion rates.",
  },
]

export function InstitutionBenefits() {
  return (
    <section className="border-b border-border/40 bg-muted/30 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Measurable Impact for Your Institution
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Join hundreds of institutions that have transformed their scholarship programs with EduScale.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-border/50 bg-background">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="mb-2 text-4xl font-bold text-primary">{benefit.stat}</div>
                <div className="mb-3 font-semibold">{benefit.label}</div>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
