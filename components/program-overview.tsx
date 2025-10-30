import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, BookOpen, Users, Globe } from "lucide-react"

/**
 * CUSTOMIZATION: Update program types, fields of study, and eligibility criteria
 * Replace icons with institution-specific program icons
 */
export function ProgramOverview() {
  const programs = [
    {
      icon: GraduationCap,
      title: "Merit-Based Scholarships",
      description: "Awarded to students demonstrating exceptional academic achievement and leadership potential.",
    },
    {
      icon: BookOpen,
      title: "Field-Specific Awards",
      description: "Specialized funding for students pursuing STEM, Arts, Business, and Humanities programs.",
    },
    {
      icon: Users,
      title: "Need-Based Support",
      description: "Financial assistance for talented students who require support to pursue their education.",
    },
    {
      icon: Globe,
      title: "International Opportunities",
      description: "Scholarships designed for international students seeking to study at our institution.",
    },
  ]

  return (
    <section id="programs" className="border-b border-border bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Scholarship Programs</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            We offer a diverse range of scholarship opportunities to support students at every stage of their academic
            journey.
          </p>
        </div>

        {/* CUSTOMIZATION POINT: Update program cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program, index) => {
            const Icon = program.icon
            return (
              <Card key={index} className="border-border">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">{program.description}</CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Eligibility section */}
        <div className="mt-16">
          <Card className="border-border bg-muted/50">
            <CardHeader>
              <CardTitle className="text-2xl">Eligibility Requirements</CardTitle>
              <CardDescription className="text-base">General criteria for scholarship consideration</CardDescription>
            </CardHeader>
            <CardContent>
              {/* CUSTOMIZATION POINT: Update eligibility criteria */}
              <ul className="grid gap-3 sm:grid-cols-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span className="text-sm leading-relaxed">Minimum GPA of 3.0 or equivalent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span className="text-sm leading-relaxed">Demonstrated academic excellence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span className="text-sm leading-relaxed">Strong letters of recommendation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span className="text-sm leading-relaxed">Compelling personal statement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span className="text-sm leading-relaxed">Enrollment in eligible programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span className="text-sm leading-relaxed">Meeting application deadlines</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
