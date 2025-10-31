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
        "Esta beca transformó mi vida. Pude concentrarme completamente en mis estudios sin estrés financiero, y el programa de mentoría me conectó con líderes de la industria que guiaron mi trayectoria profesional.",
      name: "Sarah Johnson",
      program: "Ciencia de la Computación, Promoción 2024",
      image: "/professional-student-portrait-female.jpg",
    },
    {
      quote:
        "Como estudiante internacional, recibir esta beca hizo posible mi sueño de estudiar en el extranjero. El apoyo de la institución fue más allá de la ayuda financiera—realmente invirtieron en mi éxito.",
      name: "Miguel Rodriguez",
      program: "Administración de Empresas, Promoción 2023",
      image: "/professional-student-portrait-male.jpg",
    },
    {
      quote:
        "El programa de becas no solo financió mi educación; abrió puertas a oportunidades de investigación y eventos de networking que dieron forma a mi futuro. Ahora estoy cursando mi doctorado en una universidad de primer nivel.",
      name: "Aisha Patel",
      program: "Ingeniería Biomédica, Promoción 2024",
      image: "/professional-student-portrait-female.jpg",
    },
  ]

  return (
    <section className="border-b border-border bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Historias de Éxito</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            Escucha a los beneficiarios de becas que han alcanzado sus metas académicas y profesionales con nuestro apoyo.
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
            <div className="mt-2 text-sm text-muted-foreground">Tasa de Graduación</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">$65K</div>
            <div className="mt-2 text-sm text-muted-foreground">Salario Inicial Promedio</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">85%</div>
            <div className="mt-2 text-sm text-muted-foreground">Empleados en 6 Meses</div>
          </div>
        </div>
      </div>
    </section>
  )
}
