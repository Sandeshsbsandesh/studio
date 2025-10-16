import GenericBookingForm from './generic-booking-form';

const serviceOptions = [
  '20L Water Can',
  '25L Water Can',
  'Bulk Order (5+ Cans)',
  'Monthly Subscription',
  'Emergency Delivery',
];

export default function WaterCanForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  return (
    <GenericBookingForm
      provider={provider}
      onClose={onClose}
      serviceName="Water Can Delivery"
      serviceOptions={serviceOptions}
    />
  );
}
