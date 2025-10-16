import GenericBookingForm from './generic-booking-form';

const serviceOptions = [
  'Local House Shifting',
  'Office Shifting',
  'Inter-city Moving',
  'Vehicle Transportation',
  'Packing & Unpacking Service',
];

export default function ShiftersForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  return (
    <GenericBookingForm
      provider={provider}
      onClose={onClose}
      serviceName="Shifters"
      serviceOptions={serviceOptions}
    />
  );
}
