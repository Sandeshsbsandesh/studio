import GenericBookingForm from './generic-booking-form';

const serviceOptions = [
  'City Tour Guide',
  'Shopping Assistant',
  'Local Transportation Help',
  'Language Translation',
  'Event Companion',
];

export default function LocalBuddyForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  return (
    <GenericBookingForm
      provider={provider}
      onClose={onClose}
      serviceName="Local Buddy"
      serviceOptions={serviceOptions}
    />
  );
}
