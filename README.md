# UrbanEzii - Your Local Service Bridge

![UrbanEzii](public/logo.png)

UrbanEzii is a comprehensive local services marketplace platform that connects users with trusted service providers in their area. From plumbing and electrical work to cleaning and personal cooks, find and book verified professionals for all your home needs in one place.

## 🌟 Features

- **Wide Range of Services**: Access to 11+ categories of local services
- **Verified Professionals**: All service providers are background-checked and verified
- **Easy Booking System**: Streamlined booking process with just a few clicks
- **AI-Powered Recommendations**: Smart assistant suggests the best alternatives based on ratings and distance
- **Provider Dashboard**: Comprehensive dashboard for service providers to manage bookings
- **Secure Authentication**: User and provider authentication with Firebase
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Data**: Integration with Firebase Firestore for real-time updates

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **AI**: Google Genkit for AI-powered features
- **Fonts**: Poppins (Headlines), PT Sans (Body)
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd studio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # Google AI (for Genkit)
   GOOGLE_API_KEY=your_google_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3001](http://localhost:3001) in your browser.

5. **Run AI development server (optional)**
   ```bash
   npm run genkit:watch
   ```

## 🏗️ Project Structure

```
studio/
├── src/
│   ├── ai/                    # AI flows and configurations
│   │   ├── flows/            # Genkit AI flows
│   │   ├── genkit.ts         # Genkit configuration
│   │   └── dev.ts            # AI development server
│   ├── app/                   # Next.js app directory
│   │   ├── (pages)/          # Main application pages
│   │   ├── service/[slug]/   # Dynamic service pages
│   │   ├── provider/         # Provider dashboard
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/           # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── forms/            # Service-specific forms
│   │   ├── header.tsx        # Header component
│   │   └── footer.tsx        # Footer component
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utility functions and data
│       ├── firebase.ts       # Firebase configuration
│       ├── data.tsx          # Static data
│       └── utils.ts          # Utility functions
├── public/                    # Static assets
├── firebase.json             # Firebase configuration
├── firestore.rules           # Firestore security rules
└── package.json              # Dependencies
```

## 🎨 Available Services

1. **Water Can Delivery** - Fresh and clean water at your doorstep
2. **House Maids** - Reliable help for your daily chores
3. **Electricians** - Certified professionals for electrical jobs
4. **Plumbers** - Quick solutions for plumbing issues
5. **Doctor on Call** - Online consultations with doctors
6. **Cylinder Delivery** - Fast and safe gas cylinder refills
7. **Cleaners** - Professional cleaning services
8. **Personal Cooks** - Home-cooked meals
9. **Local Buddy** - Help with errands and local tasks
10. **Shifters & Movers** - Moving and shifting services
11. **Painters** - Professional painting services

## 👥 User Types

### Customers
- Browse and search services
- Book verified professionals
- Manage bookings
- Use AI assistant for recommendations
- Rate and review providers

### Service Providers
- List services and set pricing
- Manage booking requests
- Track earnings and statistics
- View upcoming appointments
- Build online reputation

## 🔧 Development

### Available Scripts

```bash
# Start development server on port 3001
npm run dev

# Start AI development server
npm run genkit:dev

# Start AI development server with watch mode
npm run genkit:watch

# Build for production
npm run build

# Start production server on port 8080
npm start

# Run linter
npm run lint

# Type checking
npm run typecheck
```

## 🚀 Deployment

This project is configured for deployment on Firebase App Hosting.

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

## 🔐 Security

- All service providers undergo background verification
- Secure payment processing
- Firebase Authentication for user management
- Firestore security rules for data protection

## 📱 Mobile App

The platform is fully responsive and works great on mobile devices. Download links available on the home page.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

© 2025 UrbanEzii Technologies. All Rights Reserved.

## 📞 Contact

- **Email**: support@urbanezii.com
- **Phone**: +1 (123) 456-7890
- **Website**: [https://urbanezii.com](https://urbanezii.com)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Deployed on [Firebase](https://firebase.google.com/)

---

Made with ❤️ by UrbanEzii Technologies
