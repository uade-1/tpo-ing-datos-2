import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$499",
    period: "/month",
    description: "Perfect for small institutions getting started",
    features: [
      "Up to 500 applications/year",
      "Fully white-labeled portal",
      "Multi-step application forms",
      "Email automation",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$999",
    period: "/month",
    description: "For growing programs with advanced needs",
    features: [
      "Up to 2,000 applications/year",
      "Everything in Starter",
      "Advanced analytics & reporting",
      "Custom workflows",
      "Multi-language support",
      "Priority support",
      "Dedicated account manager",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large institutions with complex requirements",
    features: [
      "Unlimited applications",
      "Everything in Professional",
      "Custom integrations",
      "SSO & advanced security",
      "SLA guarantee",
      "White-glove onboarding",
      "Custom development",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

export function InstitutionPricing() {
  return (
    <section id="pricing" className="border-b border-border/40 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            Choose the plan that fits your institution's needs. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-border/50 ${
                plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                    Most Popular
                  </div>
                </div>
              )}
              <CardHeader className="pb-8 pt-8">
                <div className="mb-2 text-sm font-semibold text-muted-foreground">{plan.name}</div>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
                  {plan.cta}
                </Button>
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include 48-hour setup, training, and ongoing support.
            <br />
            Need a custom solution?{" "}
            <a href="#demo" className="font-medium text-primary hover:underline">
              Contact our sales team
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
