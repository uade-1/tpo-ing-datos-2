import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProgramOverview } from "@/components/program-overview"
import { KeyBenefits } from "@/components/key-benefits"
import { ApplicationProcess } from "@/components/application-process"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { Footer } from "@/components/footer"

export default function ScholarshipLandingPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ProgramOverview />
        <KeyBenefits />
        <ApplicationProcess />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  )
}
