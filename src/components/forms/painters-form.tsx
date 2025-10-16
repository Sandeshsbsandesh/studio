import GenericBookingForm from './generic-booking-form';

const serviceOptions = [
  'Interior Painting',
  'Exterior Painting',
  'Wall Texture',
  'Wood Polishing',
  'Waterproofing',
];

export default function PaintersForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  return (
    <GenericBookingForm
      provider={provider}
      onClose={onClose}
      serviceName="Painters"
      serviceOptions={serviceOptions}
    />
  );
}
