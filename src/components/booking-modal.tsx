
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import WaterCanForm from './forms/water-can-form';
import MaidsForm from './forms/maids-form';
import ElectricianForm from './forms/electrician-form';
import PlumberForm from './forms/plumber-form';
import DoctorForm from './forms/doctor-form';
import CylinderForm from './forms/cylinder-form';
import CleanersForm from './forms/cleaners-form';
import CooksForm from './forms/cooks-form';
import LocalBuddyForm from './forms/local-buddy-form';
import ShiftersForm from './forms/shifters-form';
import PaintersForm from './forms/painters-form';


interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceSlug: string;
  provider: any;
}

const serviceForms: Record<string, React.FC<{ provider: any; onClose: () => void }>> = {
  'water-can-delivery': WaterCanForm,
  'house-maids': MaidsForm,
  'electricians': ElectricianForm,
  'plumbers': PlumberForm,
  'doctor-on-call': DoctorForm,
  'cylinder-delivery': CylinderForm,
  'cleaners': CleanersForm,
  'personal-cooks': CooksForm,
  'local-buddy': LocalBuddyForm,
  'shifters': ShiftersForm,
  'painters': PaintersForm,
};

export default function BookingModal({ isOpen, onClose, serviceSlug, provider }: BookingModalProps) {
  const FormComponent = serviceForms[serviceSlug];

  if (!FormComponent) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Service</DialogTitle>
          <DialogDescription>
            Complete the details below to book {provider?.businessName || provider?.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <FormComponent provider={provider} onClose={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
