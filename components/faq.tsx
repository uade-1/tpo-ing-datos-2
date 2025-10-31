import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

/**
 * CUSTOMIZATION: Update FAQ questions and answers to match institution policies
 * Add or remove questions based on common inquiries
 */
export function FAQ() {
  const faqs = [
    {
      question: "¿Quién es elegible para solicitar becas?",
      answer:
        "Nuestras becas están abiertas tanto para estudiantes nacionales como internacionales que cumplan con nuestros requisitos académicos. Generalmente, los solicitantes deben tener un promedio mínimo de 3.0 (o equivalente), demostrar excelencia académica y mostrar compromiso con su campo de estudio. Los criterios de elegibilidad específicos pueden variar según el tipo de beca.",
    },
    {
      question: "¿Cuándo es la fecha límite de solicitud?",
      answer:
        "Tenemos dos fechas límite de solicitud: Solicitud Temprana (1 de diciembre) y Solicitud Regular (15 de febrero). Fomentamos la solicitud temprana ya que algunas becas se otorgan de forma continua. Las solicitudes tardías pueden ser consideradas caso por caso según el financiamiento disponible.",
    },
    {
      question: "¿Puedo solicitar múltiples becas?",
      answer:
        "¡Sí! Puedes solicitar múltiples programas de becas con una sola solicitud. Nuestro sistema te considerará automáticamente para todas las becas para las que cumplas los criterios de elegibilidad. Solo necesitas enviar una solicitud integral.",
    },
    {
      question: "¿Qué documentos necesito enviar?",
      answer:
        "Los documentos requeridos incluyen: transcripciones oficiales, resultados de exámenes estandarizados (si aplica), dos cartas de recomendación, una carta de presentación (500-1000 palabras) y comprobante de inscripción o aceptación. Los estudiantes internacionales pueden necesitar proporcionar documentación adicional como resultados de exámenes de competencia en inglés.",
    },
    {
      question: "¿Cuánto financiamiento puedo recibir?",
      answer:
        "Los montos de las becas varían según el programa y las circunstancias individuales. Los premios van desde cobertura parcial de matrícula hasta becas completas que incluyen matrícula, tarifas, alojamiento, comida y un estipendio para libros y suministros. El premio promedio de beca es de $15,000 por año académico.",
    },
    {
      question: "¿La beca es renovable?",
      answer:
        "La mayoría de nuestras becas son renovables por hasta cuatro años (o la duración de tu programa) siempre que mantengas un progreso académico satisfactorio, típicamente un promedio mínimo de 3.0, y continúes cumpliendo con los requisitos de la beca. La renovación se revisa anualmente.",
    },
    {
      question: "¿Cuándo sabré sobre el estado de mi solicitud?",
      answer:
        "Las decisiones de las solicitudes generalmente se comunican 8-10 semanas después de la fecha límite. Los solicitantes tempranos pueden recibir respuesta antes. Todos los solicitantes recibirán una notificación por correo electrónico y a través de su portal de solicitudes, independientemente de la decisión.",
    },
    {
      question: "¿Puedo diferir mi beca a un período posterior?",
      answer:
        "Las solicitudes de diferimiento se consideran caso por caso y deben enviarse por escrito con una razón válida. Generalmente, las becas pueden diferirse hasta un año académico. Por favor contacta a nuestra oficina de becas para discutir tu situación específica.",
    },
  ]

  return (
    <section id="faq" className="border-b border-border bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Preguntas Frecuentes</h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
              Encuentra respuestas a preguntas comunes sobre nuestros programas de becas y proceso de solicitud.
            </p>
          </div>

          {/* CUSTOMIZATION POINT: Update FAQ items */}
          <Accordion type="single" collapsible className="mt-12">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 rounded-lg border border-border bg-muted/50 p-8 text-center">
            <h3 className="text-xl font-semibold">¿Aún tienes preguntas?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Nuestro equipo de becas está aquí para ayudarte durante el proceso de solicitud.
            </p>
            <Button variant="outline" className="mt-4 bg-transparent">
              Contactar Soporte
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
