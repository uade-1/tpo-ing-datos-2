import { ApplicationForm } from "@/components/application-form"

export const metadata = {
  title: "Solicitar Beca | Nombre de la Institución",
  description: "Completa tu solicitud de beca en unos pocos pasos simples.",
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Solicitud de Beca</h1>
            <p className="mt-3 text-pretty text-muted-foreground leading-relaxed">
              Completa todas las secciones para enviar tu solicitud. Tu progreso se guardará automáticamente.
            </p>
          </div>
          <ApplicationForm />
        </div>
      </div>
    </div>
  )
}
