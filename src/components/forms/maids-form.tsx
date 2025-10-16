import GenericBookingForm from './generic-booking-form';

const serviceOptions = [
  'Part-time House Maid',
  'Full-time House Maid',
  'Live-in House Maid',
  'Cook & Maid',
  'Weekend Maid Service',
];

export default function MaidsForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  return (
    <GenericBookingForm
      provider={provider}
      onClose={onClose}
      serviceName="House Maids"
      serviceOptions={serviceOptions}
    />
  );
}
