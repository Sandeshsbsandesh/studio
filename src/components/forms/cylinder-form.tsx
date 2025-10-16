import GenericBookingForm from './generic-booking-form';

const serviceOptions = [
  '14.2 KG Commercial Cylinder',
  '5 KG Domestic Cylinder',
  'Cylinder Replacement',
  'Emergency Delivery',
  'New Connection',
];

export default function CylinderForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  return (
    <GenericBookingForm
      provider={provider}
      onClose={onClose}
      serviceName="Cylinder Delivery"
      serviceOptions={serviceOptions}
    />
  );
}
