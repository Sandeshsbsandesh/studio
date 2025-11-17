import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface ServiceFAQProps {
  serviceType?: string;
  className?: string;
}

// General FAQs that apply to all services
const generalFAQs: FAQItem[] = [
  {
    question: 'How do I book a service?',
    answer: 'Browse available providers, compare their ratings and prices, then click "Book Now". Choose your preferred date and time, fill in your details, and confirm. You\'ll receive instant confirmation.',
  },
  {
    question: 'How much does the service cost?',
    answer: 'Pricing varies by provider and service type. Each provider displays their transparent pricing on their profile. What you see is what you pay - no hidden charges.',
  },
  {
    question: 'Are your service providers verified?',
    answer: 'Yes! All providers are background-checked, certified, and verified. We ensure they meet our quality standards before onboarding.',
  },
  {
    question: 'How quickly can someone reach my location?',
    answer: 'Most providers are available within 2-4 hours. Many offer same-day service. Emergency services can arrive even faster.',
  },
  {
    question: 'What if I need to reschedule?',
    answer: 'You can reschedule anytime for free! Just go to "My Bookings" and select a new date/time. No cancellation fees if done before 4 hours of appointment.',
  },
  {
    question: 'Is there a service warranty?',
    answer: 'Yes! All services come with a 30-day warranty. If the same issue occurs within 30 days, we\'ll fix it for free.',
  },
  {
    question: 'Do I need to provide any tools or materials?',
    answer: 'Basic tools are provided by the professional. You may need to provide a ladder if required. Spare parts and materials are charged separately.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, UPI, debit/credit cards, and digital wallets. Payment is typically made after service completion and your satisfaction.',
  },
  {
    question: 'What if I\'m not satisfied with the service?',
    answer: 'Customer satisfaction is our priority. Contact our support immediately if you\'re unsatisfied. We\'ll work to resolve the issue or provide a refund/redo as appropriate.',
  },
  {
    question: 'Can I choose my preferred provider?',
    answer: 'Absolutely! That\'s what makes UrbanEzii unique. You can view multiple providers, compare their ratings, experience, and prices, then choose who you prefer.',
  },
];

// Service-specific FAQs (can be expanded based on service type)
const electricianFAQs: FAQItem[] = [
  {
    question: 'Do you handle emergency electrical issues?',
    answer: 'Yes! Many of our electricians offer emergency services for issues like power outages, short circuits, or electrical fires. Contact them directly for immediate assistance.',
  },
  {
    question: 'What electrical work is covered?',
    answer: 'We cover fan repair/installation, switch/socket work, wiring, lighting, appliance installation, MCB replacement, and more. Check provider profiles for specific services.',
  },
];

const plumberFAQs: FAQItem[] = [
  {
    question: 'Do you fix leaking pipes and taps?',
    answer: 'Yes! Our plumbers handle all types of leaks, blockages, installations, and repairs for taps, pipes, toilets, and drainage systems.',
  },
];

export default function ServiceFAQ({ serviceType = 'general', className = '' }: ServiceFAQProps) {
  // Combine general FAQs with service-specific ones
  let serviceFAQs: FAQItem[] = [...generalFAQs];
  
  if (serviceType.toLowerCase().includes('electrician')) {
    serviceFAQs = [...electricianFAQs, ...generalFAQs];
  } else if (serviceType.toLowerCase().includes('plumber')) {
    serviceFAQs = [...plumberFAQs, ...generalFAQs];
  }

  // Limit to top 10 FAQs for better UX
  const displayFAQs = serviceFAQs.slice(0, 10);

  return (
    <div className={`bg-card border rounded-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold font-headline mb-6">Frequently Asked Questions</h2>
      
      <Accordion type="single" collapsible className="w-full">
        {displayFAQs.map((faq, index) => (
          <AccordionItem key={index} value={`faq-${index}`}>
            <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
              <span className="font-semibold">{faq.question}</span>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
        <p className="text-sm text-center">
          <strong>Still have questions?</strong>{' '}
          <a href="tel:+919740529651" className="text-primary hover:underline">
            Call us at +91-974-052-9651
          </a>{' '}
          or{' '}
          <a href="/contact" className="text-primary hover:underline">
            contact support
          </a>
        </p>
      </div>
    </div>
  );
}

