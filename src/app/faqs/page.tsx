// This is a placeholder file. You can edit it to add your own content.
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
    {
        question: "How do I book a service?",
        answer: "Booking a service is easy! Simply browse our service categories, choose a provider, and select a time that works for you. You'll receive a confirmation once the provider accepts your booking."
    },
    {
        question: "Are the service providers verified?",
        answer: "Yes, absolutely. We take your safety very seriously. All service providers on the UrbanEzii platform undergo a rigorous background check and verification process before they can offer services."
    },
    {
        question: "What if I'm not satisfied with the service?",
        answer: "Your satisfaction is our priority. If you're unhappy with the service, you can raise a dispute through the app. Our support team will investigate and help resolve the issue. You can also use our AI Assistant to find a higher-rated provider for next time."
    },
    {
        question: "How does payment work?",
        answer: "Payments are handled securely through our platform. You can pay using a credit/debit card, net banking, or other digital wallets. Payment is only released to the provider after you confirm the service has been completed to your satisfaction."
    },
    {
        question: "Can I cancel a booking?",
        answer: "Yes, you can cancel a booking. Please refer to our cancellation policy for details on any applicable charges, which may vary depending on how close to the appointment time you cancel."
    }
]

export default function FaqsPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline tracking-tight">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-muted-foreground">Find answers to common questions about UrbanEzii.</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg font-semibold text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
