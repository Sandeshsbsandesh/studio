import GenericBookingForm from './generic-booking-form';

const serviceOptions = [
  'Fan Service (Installation/Repair)',
  'Geyser Service (Installation/Repair)',
  'Kitchen Appliances (Installation/Repair)',
  'TV Service (Installation/Repair)',
  'Other Services',
];

export default function ElectricianForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  return (
    <GenericBookingForm
      provider={provider}
      onClose={onClose}
      serviceName="Electricians"
      serviceOptions={serviceOptions}
    />
  );
}
