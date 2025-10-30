import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "EduScale transformed our scholarship program. We went from managing applications in spreadsheets to a professional, automated system in just two days. Applications increased by 250% in the first semester.",
    author: "Dr. Sarah Mitchell",
    role: "Director of Financial Aid",
    institution: "Pacific Coast University",
    rating: 5,
  },
  {
    quote:
      "The white-label solution was exactly what we needed. Our students have no idea they're using a third-party platform - it looks and feels like it was built in-house. The ROI has been incredible.",
    author: "James Chen",
    role: "VP of Enrollment",
    institution: "Metropolitan College",
    rating: 5,
  },
  {
    quote:
      "Implementation was seamless. The EduScale team handled everything, and we were live in 48 hours as promised. The automated email sequences alone have saved us hundreds of hours.",
    author: "Maria Rodriguez",
    role: "Scholarship Coordinator",
    institution: "Riverside Institute",
    rating: 5,
  },
]

export function InstitutionTestimonials() {
  return (
    <section id="testimonials" className="border-b border-border/40 bg-muted/30 py-20 md:py-32">
      <div className="container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-5xl">
            Trusted by Leading Institutions
          </h2>
          <p className="text-pretty text-lg text-muted-foreground">
            See what scholarship administrators are saying about EduScale.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border/50 bg-background">
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="mb-6 text-sm leading-relaxed">"{testimonial.quote}"</blockquote>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.institution}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
