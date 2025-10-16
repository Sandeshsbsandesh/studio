import GenericBookingForm from './generic-booking-form';

const serviceOptions = [
  'General Physician',
  'Pediatrician',
  'Dermatologist',
  'Emergency Consultation',
  'Health Checkup',
];

export default function DoctorForm({ provider, onClose }: { provider: any; onClose: () => void }) {
  return (
    <GenericBookingForm
      provider={provider}
      onClose={onClose}
      serviceName="Doctor On Call"
      serviceOptions={serviceOptions}
    />
  );
}
