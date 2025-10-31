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
      title: "Crea Tu Cuenta",
      description: "Regístrate en nuestro portal de solicitudes y completa tu perfil con información básica.",
      timeline: "Comienza en cualquier momento",
    },
    {
      number: 2,
      title: "Envía los Documentos Requeridos",
      description: "Sube transcripciones, resultados de exámenes, cartas de recomendación y tu carta de presentación.",
      timeline: "2-3 semanas",
    },
    {
      number: 3,
      title: "Completa el Formulario de Solicitud",
      description:
        "Completa la solicitud de beca integral con tus logros académicos y extracurriculares.",
      timeline: "1-2 semanas",
    },
    {
      number: 4,
      title: "Revisa y Envía",
      description:
        "Revisa todos los materiales para verificar su precisión y completitud, luego envía tu solicitud antes de la fecha límite.",
      timeline: "Antes de la fecha límite",
    },
    {
      number: 5,
      title: "Proceso de Entrevista",
      description: "Los candidatos seleccionados serán invitados a una entrevista con nuestro comité de becas.",
      timeline: "4-6 semanas después del envío",
    },
    {
      number: 6,
      title: "Recibe la Decisión",
      description: "Las decisiones de becas se comunican por correo electrónico y en tu portal de solicitudes.",
      timeline: "8-10 semanas después del envío",
    },
  ]

  return (
    <section id="process" className="border-b border-border bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Proceso de Solicitud</h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            Sigue estos pasos simples para solicitar nuestro programa de becas. Hemos diseñado el proceso para que sea
            directo y accesible.
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
          <h3 className="text-center text-2xl font-bold">Fechas Importantes</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* CUSTOMIZATION POINT: Update application deadlines */}
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">1 Dic, 2025</div>
              <div className="mt-2 text-sm font-medium">Fecha Límite de Solicitud Temprana</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">15 Feb, 2026</div>
              <div className="mt-2 text-sm font-medium">Fecha Límite de Solicitud Regular</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">1 Abr, 2026</div>
              <div className="mt-2 text-sm font-medium">Notificación de Decisión</div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/apply">
            <Button size="lg" className="font-medium">
              Comienza Tu Solicitud
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
