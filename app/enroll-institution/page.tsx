import { InstitutionHero } from "@/components/institution/hero"
import { InstitutionFeatures } from "@/components/institution/features"
import { InstitutionBenefits } from "@/components/institution/benefits"
import { InstitutionHowItWorks } from "@/components/institution/how-it-works"
import { InstitutionPricing } from "@/components/institution/pricing"
import { InstitutionTestimonials } from "@/components/institution/testimonials"
import { InstitutionCTA } from "@/components/institution/cta"
import { InstitutionFooter } from "@/components/institution/footer"
import { InstitutionHeader } from "@/components/institution/header"

export const metadata = {
  title: "EduScale - White-Label Scholarship Management Platform",
  description:
    "Transform your scholarship program with EduScale. Launch a fully branded scholarship portal in days, not months. Streamline applications, automate workflows, and scale your impact.",
}

export default function InstitutionEnrollPage() {
  return (
    <div className="min-h-screen bg-background">
      <InstitutionHeader />
      <InstitutionHero />
      <InstitutionFeatures />
      <InstitutionBenefits />
      <InstitutionHowItWorks />
      <InstitutionTestimonials />
      <InstitutionPricing />
      <InstitutionCTA />
      <InstitutionFooter />
    </div>
  )
}
