import {
  Home,
  Droplets,
  Zap,
  Wrench,
  Stethoscope,
  Flame,
  Sparkles,
  ChefHat,
  ConciergeBell,
} from 'lucide-react';

export const services = [
  {
    icon: <Droplets className="h-8 w-8" />,
    title: 'Water Can Delivery',
    description: 'Fresh and clean water at your doorstep.',
    href: '/service/water-can-delivery',
  },
  {
    icon: <Home className="h-8 w-8" />,
    title: 'House Maids',
    description: 'Reliable help for your daily chores.',
    href: '/service/house-maids',
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Electricians',
    description: 'Certified professionals for any electrical job.',
    href: '/service/electricians',
  },
  {
    icon: <Wrench className="h-8 w-8" />,
    title: 'Plumbers',
    description: 'Quick solutions for all plumbing issues.',
    href: '/service/plumbers',
  },
  {
    icon: <Stethoscope className="h-8 w-8" />,
    title: 'Doctor on Call',
    description: 'Consult with experienced doctors online.',
    href: '/service/doctor-on-call',
  },
  {
    icon: <Flame className="h-8 w-8" />,
    title: 'Cylinder Delivery',
    description: 'Fast and safe gas cylinder refills.',
    href: '/service/cylinder-delivery',
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: 'Cleaners',
    description: 'Professional cleaning for a spotless home.',
    href: '/service/cleaners',
  },
  {
    icon: <ChefHat className="h-8 w-8" />,
    title: 'Personal Cooks',
    description: 'Enjoy delicious, home-cooked meals.',
    href: '/service/personal-cooks',
  },
  {
    icon: <ConciergeBell className="h-8 w-8" />,
    title: 'Local Buddy',
    description: 'A friendly hand for shopping, errands, and help when you need it.',
    href: '/service/local-buddy',
  },
];

export const providers: Record<string, any[]> = {
  'water-can-delivery': [
    { id: 1, name: 'AquaPure Deliveries', address: '1.2 km away - Koramangala', rating: 4.8, reviews: 120 },
    { id: 2, name: 'FreshDrop Waters', address: '2.5 km away - Indiranagar', rating: 4.6, reviews: 95 },
    { id: 3, name: 'DailyH2O', address: '3.1 km away - HSR Layout', rating: 4.7, reviews: 210 },
  ],
  'house-maids': [
    { id: 1, name: 'QuickClean Co.', address: '0.8 km away - Koramangala', rating: 4.9, reviews: 300 },
    { id: 2, name: 'Happy Homes Maids', address: '2.1 km away - Indiranagar', rating: 4.7, reviews: 150 },
    { id: 3, name: 'Urban Helpers', address: '3.5 km away - HSR Layout', rating: 4.8, reviews: 250 },
  ],
  'electricians': [
    { id: 1, name: 'Sparky Solutions', address: '1.5 km away - Koramangala', rating: 4.9, reviews: 180 },
    { id: 2, name: 'Current Affairs Electric', address: '2.0 km away - Indiranagar', rating: 4.7, reviews: 110 },
    { id: 3, name: 'Power Up Electricians', address: '4.0 km away - HSR Layout', rating: 4.8, reviews: 220 },
  ],
  'plumbers': [
    { id: 1, name: 'LeakProof Plumbers', address: '1.1 km away - Koramangala', rating: 4.8, reviews: 200 },
    { id: 2, name: 'FlowFix', address: '2.3 km away - Indiranagar', rating: 4.6, reviews: 130 },
    { id: 3, name: 'Pipe Masters', address: '3.8 km away - HSR Layout', rating: 4.7, reviews: 280 },
  ],
  'doctor-on-call': [
    { id: 1, name: 'QuickHealth Clinic', address: 'N/A - Online Consultation', rating: 4.9, reviews: 500 },
    { id: 2, name: 'TeleMed Now', address: 'N/A - Online Consultation', rating: 4.8, reviews: 450 },
    { id: 3, name: 'HealOnline', address: 'N/A - Online Consultation', rating: 4.9, reviews: 600 },
  ],
  'cylinder-delivery': [
    { id: 1, name: 'GasFast Delivery', address: '1.8 km away - Koramangala', rating: 4.7, reviews: 150 },
    { id: 2, name: 'SpeedyGas', address: '2.7 km away - Indiranagar', rating: 4.5, reviews: 100 },
    { id: 3, name: 'YourGas Partner', address: '3.3 km away - HSR Layout', rating: 4.6, reviews: 190 },
  ],
  'cleaners': [
    { id: 1, name: 'Sparkle & Shine', address: '0.9 km away - Koramangala', rating: 4.9, reviews: 280 },
    { id: 2, name: 'NeatFreak Cleaners', address: '2.2 km away - Indiranagar', rating: 4.8, reviews: 180 },
    { id: 3, name: 'The Cleaning Crew', address: '3.6 km away - HSR Layout', rating: 4.8, reviews: 320 },
  ],
  'personal-cooks': [
    { id: 1, name: 'HomeGourmet Cooks', address: '1.3 km away - Koramangala', rating: 4.9, reviews: 110 },
    { id: 2, name: 'The Daily Dish', address: '2.6 km away - Indiranagar', rating: 4.8, reviews: 90 },
    { id: 3, name: 'YourPersonalChef', address: '4.2 km away - HSR Layout', rating: 4.9, reviews: 150 },
  ],
  'local-buddy': [
    { id: 1, name: 'CityPal', address: '1.0 km away - Koramangala', rating: 5.0, reviews: 80 },
    { id: 2, name: 'YourMigo', address: '2.4 km away - Indiranagar', rating: 4.9, reviews: 75 },
    { id: 3, name: 'HelpHand', address: '3.0 km away - HSR Layout', rating: 4.9, reviews: 120 },
  ],
};

export const scheduledBookings = [
  { id: 1, service: 'Water Can Delivery', providerName: 'AquaPure Deliveries', date: 'August 25, 2024', time: '2:00 PM', address: '123, Koramangala, Bangalore' },
  { id: 2, service: 'House Maids', providerName: 'QuickClean Co.', date: 'August 28, 2024', time: '10:00 AM', address: '456, Indiranagar, Bangalore' },
];

export const bookingHistory = [
  { id: 1, service: 'Electricians', providerName: 'Sparky Solutions', date: 'July 15, 2024', rating: 5 },
  { id: 2, service: 'Plumbers', providerName: 'FlowFix', date: 'June 20, 2024', rating: 4 },
  { id: 3, service: 'Water Can Delivery', providerName: 'DailyH2O', date: 'May 30, 2024', rating: 4.5 },
];
