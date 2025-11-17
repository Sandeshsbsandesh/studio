import { Shield, Clock, RotateCcw, Award, CheckCircle2, Phone } from 'lucide-react';

interface GuaranteeItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const guarantees: GuaranteeItem[] = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Verified Professionals',
    description: 'Background-checked & certified',
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Same-Day Service',
    description: 'Available within 2-4 hours',
  },
  {
    icon: <RotateCcw className="w-5 h-5" />,
    title: 'Free Reschedule',
    description: 'Change anytime, no charge',
  },
  {
    icon: <Award className="w-5 h-5" />,
    title: '30-Day Warranty',
    description: 'Service guarantee included',
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: 'Transparent Pricing',
    description: 'No hidden charges',
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: '24/7 Support',
    description: "We're here to help",
  },
];

interface GuaranteesBannerProps {
  className?: string;
  showAll?: boolean;
}

export default function GuaranteesBanner({ className = '', showAll = true }: GuaranteesBannerProps) {
  const itemsToShow = showAll ? guarantees : guarantees.slice(0, 4);

  return (
    <div className={`bg-primary/5 border border-primary/20 rounded-lg p-4 md:p-5 ${className}`}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {itemsToShow.map((guarantee, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-2">
              {guarantee.icon}
            </div>
            <h3 className="font-semibold text-xs mb-0.5">{guarantee.title}</h3>
            <p className="text-[10px] leading-tight text-muted-foreground">{guarantee.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Compact version for smaller spaces
export function GuaranteesBannerCompact({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-4 py-3 ${className}`}>
      {guarantees.slice(0, 4).map((guarantee, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
            {guarantee.icon}
          </div>
          <span className="font-medium">{guarantee.title}</span>
        </div>
      ))}
    </div>
  );
}

