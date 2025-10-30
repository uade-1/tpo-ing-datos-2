import { Palette, Zap, Shield, BarChart3, Users, Mail, FileText, Globe, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Palette,
    title: "Fully White-Labeled",
    description:
      "Deploy a scholarship portal with your branding, colors, and domain. Students see your institution, not ours.",
  },
  {
    icon: Zap,
    title: "Rapid Deployment",
    description: "Go live in 48 hours. Our team handles setup, configuration, and customization for you.",
  },
  {
    icon: FileText,
    title: "Smart Application Forms",
    description: "Multi-step forms with conditional logic, document uploads, and auto-save functionality.",
  },
  {
    icon: Users,
    title: "Applicant Management",
    description: "Review, score, and manage applications with collaborative tools and custom workflows.",
  },
  {
    icon: Mail,
    title: "Automated Communications",
    description: "Pre-built email sequences for nurturing leads, application updates, and decision notifications.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Reporting",
    description: "Track application metrics, conversion rates, and program performance with real-time dashboards.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 compliant with data encryption, role-based access, and audit logs.",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Reach international students with built-in translation and localization features.",
  },
  {
    icon: Lock,
    title: "GDPR & Privacy Compliant",
    description: "Built-in compliance tools for data protection regulations worldwide.",
  },
]

export function InstitutionFeatures() {
  return (
    <section id="features" className="border-b border-border/40 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Everything You Need to Scale Your Scholarship Program
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            A complete platform designed specifically for educational institutions managing scholarship applications at
            scale.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
