import GenericBookingForm from './generic-booking-form';

const serviceOptions = [
  'Part-time Cook',
  'Full-time Cook',
  'Party/Event Cook',
  'Breakfast Only',
  'Lunch & Dinner',
];

export default function CooksForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  return (
    <GenericBookingForm
      provider={provider}
      onClose={onClose}
      serviceName="Personal Cooks"
      serviceOptions={serviceOptions}
    />
  );
}
