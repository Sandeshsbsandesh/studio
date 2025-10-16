import GenericBookingForm from './generic-booking-form';

const serviceOptions = [
  'Deep Cleaning',
  'Regular House Cleaning',
  'Kitchen Cleaning',
  'Bathroom Cleaning',
  'Post-Construction Cleaning',
];

export default function CleanersForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  return (
    <GenericBookingForm
      provider={provider}
      onClose={onClose}
      serviceName="Cleaners"
      serviceOptions={serviceOptions}
    />
  );
}
