import { CheckCircle2, XCircle, Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ServiceScopeProps {
  serviceType?: string;
  className?: string;
}

export default function ServiceScope({ serviceType = 'general', className = '' }: ServiceScopeProps) {
  const included = [
    'Professional inspection and diagnosis',
    'Basic repair and installation work',
    'Standard wiring (up to 2 meters)',
    '30-day service warranty',
    'Cleanup after work completion',
    'Safety and quality checks',
  ];

  const notIncluded = [
    'Spare parts and materials (charged separately)',
    'Major rewiring work (beyond 2 meters)',
    'Specialized equipment or tools',
    'Structural modifications',
    'Ladder or scaffolding (customer provides)',
  ];

  const additionalNotes = [
    'Final price depends on actual work scope',
    'Spare parts charged as per market rate with receipt',
    'We use only quality, branded materials',
    'Additional charges communicated before work begins',
  ];

  return (
    <div className={`bg-card border rounded-lg overflow-hidden ${className}`}>
      <Accordion type="single" collapsible className="w-full">
        {/* What's Included */}
        <AccordionItem value="included" className="border-b">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span className="font-semibold">What's Included in the Service</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <ul className="space-y-2">
              {included.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* What's NOT Included */}
        <AccordionItem value="not-included" className="border-b">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <XCircle className="w-5 h-5 text-orange-500" />
              <span className="font-semibold">Additional Charges May Apply For</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <ul className="space-y-2">
              {notIncluded.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Important Notes */}
        <AccordionItem value="notes">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-blue-500" />
              <span className="font-semibold">Important Notes</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-4">
            <ul className="space-y-2">
              {additionalNotes.map((note, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{note}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

// Compact version for booking modal
export function ServiceScopeCompact() {
  return (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg text-sm">
      <div>
        <p className="font-semibold mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
          Included:
        </p>
        <p className="text-muted-foreground">
          Inspection, basic repair, standard wiring (up to 2m), 30-day warranty
        </p>
      </div>
      <div>
        <p className="font-semibold mb-2 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-orange-500" />
          Extra charges:
        </p>
        <p className="text-muted-foreground">
          Spare parts, major wiring, specialized equipment
        </p>
      </div>
    </div>
  );
}

