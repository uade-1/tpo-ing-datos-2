import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

/**
 * CUSTOMIZATION: Replace with actual student testimonials and photos
 * Update names, programs, and quotes
 */
export function Testimonials() {
  const testimonials = [
    {
      quote:
        "This scholarship transformed my life. I was able to focus entirely on my studies without financial stress, and the mentorship program connected me with industry leaders who guided my career path.",
      name: "Sarah Johnson",
      program: "Computer Science, Class of 2024",
      image: "/professional-student-portrait-female.jpg",
    },
    {
      quote:
        "As an international student, receiving this scholarship made my dream of studying abroad possible. The support from the institution went beyond financial aid—they truly invested in my success.",
      name: "Miguel Rodriguez",
      program: "Business Administration, Class of 2023",
      image: "/professional-student-portrait-male.jpg",
    },
    {
      quote:
        "The scholarship program didn't just fund my education; it opened doors to research opportunities and networking events that shaped my future. I'm now pursuing my PhD at a top university.",
      name: "Aisha Patel",
      program: "Biomedical Engineering, Class of 2024",
      image: "/professional-student-portrait-female.jpg",
    },
  ]

  return (
    <section className="border-b border-border bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Success Stories</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            Hear from scholarship recipients who have achieved their academic and career goals with our support.
          </p>
        </div>

        {/* CUSTOMIZATION POINT: Replace with actual testimonials */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border bg-card">
              <CardContent className="pt-6">
                <Quote className="h-8 w-8 text-accent/30" aria-hidden="true" />
                <blockquote className="mt-4 text-sm leading-relaxed">"{testimonial.quote}"</blockquote>
                <div className="mt-6 flex items-center gap-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full border border-border object-cover"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.program}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-16 grid gap-8 rounded-lg border border-border bg-card p-8 md:grid-cols-3">
          {/* CUSTOMIZATION POINT: Update success metrics */}
          <div className="text-center">
            <div className="text-4xl font-bold">98%</div>
            <div className="mt-2 text-sm text-muted-foreground">Graduation Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">$65K</div>
            <div className="mt-2 text-sm text-muted-foreground">Average Starting Salary</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">85%</div>
            <div className="mt-2 text-sm text-muted-foreground">Employed Within 6 Months</div>
          </div>
        </div>
      </div>
    </section>
  )
}
