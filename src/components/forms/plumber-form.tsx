import GenericBookingForm from './generic-booking-form';

const serviceOptions = [
  'Pipe Leakage Repair',
  'Tap Installation/Repair',
  'Toilet Repair',
  'Drainage Cleaning',
  'Water Tank Cleaning',
  'Other Services',
];

export default function PlumberForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  return (
    <GenericBookingForm
      provider={provider}
      onClose={onClose}
      serviceName="Plumbers"
      serviceOptions={serviceOptions}
    />
  );
}
