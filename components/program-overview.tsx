import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GraduationCap, BookOpen, Users, Globe } from "lucide-react";

/**
 * CUSTOMIZATION: Update program types, fields of study, and eligibility criteria
 * Replace icons with institution-specific program icons
 */
export function ProgramOverview() {
  const programs = [
    {
      icon: GraduationCap,
      title: "Becas por Mérito",
      description:
        "Otorgadas a estudiantes que demuestran logros académicos excepcionales y potencial de liderazgo.",
    },
    {
      icon: BookOpen,
      title: "Premios Específicos por Área",
      description:
        "Financiamiento especializado para estudiantes que cursan programas de STEM, Artes, Negocios y Humanidades.",
    },
    {
      icon: Users,
      title: "Apoyo Basado en Necesidad",
      description:
        "Asistencia financiera para estudiantes talentosos que requieren apoyo para continuar su educación.",
    },
    {
      icon: Globe,
      title: "Oportunidades Internacionales",
      description:
        "Becas diseñadas para estudiantes internacionales que buscan estudiar en nuestra institución.",
    },
  ];

  return (
    <section
      id="programs"
      className="border-b border-border bg-background py-16 md:py-24"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Programas de Becas
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
            Ofrecemos una amplia gama de oportunidades de becas para apoyar a
            los estudiantes en cada etapa de su viaje académico.
          </p>
        </div>

        {/* CUSTOMIZATION POINT: Update program cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((program, index) => {
            const Icon = program.icon;
            return (
              <Card key={index} className="border-border">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-6 w-6 text-accent" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">{program.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {program.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Eligibility section */}
        <div className="mt-16">
          <Card className="border-border bg-muted/50">
            <CardHeader>
              <CardTitle className="text-2xl">
                Requisitos de Elegibilidad
              </CardTitle>
              <CardDescription className="text-base">
                Criterios generales para la consideración de becas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* CUSTOMIZATION POINT: Update eligibility criteria */}
              <ul className="grid gap-3 sm:grid-cols-2">
                <li className="flex items-start gap-2">
                  <span
                    className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-relaxed">
                    Promedio mínimo de 7 o equivalente
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-relaxed">
                    Excelencia académica demostrada
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-relaxed">
                    Cartas de recomendación sólidas
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-relaxed">
                    Carta de presentación convincente
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-relaxed">
                    Inscripción en programas elegibles
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span
                    className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-relaxed">
                    Cumplimiento de fechas límite de solicitud
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
