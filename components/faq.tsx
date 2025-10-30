import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

/**
 * CUSTOMIZATION: Update FAQ questions and answers to match institution policies
 * Add or remove questions based on common inquiries
 */
export function FAQ() {
  const faqs = [
    {
      question: "Who is eligible to apply for scholarships?",
      answer:
        "Our scholarships are open to both domestic and international students who meet our academic requirements. Generally, applicants should have a minimum GPA of 3.0 (or equivalent), demonstrate academic excellence, and show commitment to their field of study. Specific eligibility criteria may vary by scholarship type.",
    },
    {
      question: "When is the application deadline?",
      answer:
        "We have two application deadlines: Early Application (December 1) and Regular Application (February 15). We encourage early application as some scholarships are awarded on a rolling basis. Late applications may be considered on a case-by-case basis depending on available funding.",
    },
    {
      question: "Can I apply for multiple scholarships?",
      answer:
        "Yes! You can apply for multiple scholarship programs with a single application. Our system will automatically consider you for all scholarships for which you meet the eligibility criteria. You only need to submit one comprehensive application.",
    },
    {
      question: "What documents do I need to submit?",
      answer:
        "Required documents include: official transcripts, standardized test scores (if applicable), two letters of recommendation, a personal statement (500-1000 words), and proof of enrollment or acceptance. International students may need to provide additional documentation such as English proficiency test scores.",
    },
    {
      question: "How much funding can I receive?",
      answer:
        "Scholarship amounts vary based on the program and individual circumstances. Awards range from partial tuition coverage to full-ride scholarships that include tuition, fees, room, board, and a stipend for books and supplies. The average scholarship award is $15,000 per academic year.",
    },
    {
      question: "Is the scholarship renewable?",
      answer:
        "Most of our scholarships are renewable for up to four years (or the duration of your program) provided you maintain satisfactory academic progress, typically a minimum GPA of 3.0, and continue to meet the scholarship requirements. Renewal is reviewed annually.",
    },
    {
      question: "When will I hear about my application status?",
      answer:
        "Application decisions are typically communicated 8-10 weeks after the deadline. Early applicants may hear back sooner. All applicants will receive notification via email and through their application portal, regardless of the decision.",
    },
    {
      question: "Can I defer my scholarship to a later term?",
      answer:
        "Deferral requests are considered on a case-by-case basis and must be submitted in writing with a valid reason. Generally, scholarships can be deferred for up to one academic year. Please contact our scholarship office to discuss your specific situation.",
    },
  ]

  return (
    <section id="faq" className="border-b border-border bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">Frequently Asked Questions</h2>
            <p className="mt-4 text-pretty text-lg text-muted-foreground leading-relaxed">
              Find answers to common questions about our scholarship programs and application process.
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
            <h3 className="text-xl font-semibold">Still have questions?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Our scholarship team is here to help you through the application process.
            </p>
            <Button variant="outline" className="mt-4 bg-transparent">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
