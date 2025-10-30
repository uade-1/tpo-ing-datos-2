import { ApplicationForm } from "@/components/application-form"

export const metadata = {
  title: "Apply for Scholarship | Institution Name",
  description: "Complete your scholarship application in a few simple steps.",
}

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Scholarship Application</h1>
            <p className="mt-3 text-pretty text-muted-foreground leading-relaxed">
              Complete all sections to submit your application. Your progress will be saved automatically.
            </p>
          </div>
          <ApplicationForm />
        </div>
      </div>
    </div>
  )
}
