# Contributing to UrbanEzii

Thank you for your interest in contributing to UrbanEzii! This document provides guidelines and instructions for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Firebase account (for backend services)
- Google AI API key (for AI features)

### Setup

1. **Fork and Clone**
   ```bash
   git clone <your-fork-url>
   cd studio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GOOGLE_API_KEY=your_google_ai_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📝 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow the existing code structure
- Use Tailwind CSS for styling
- Use shadcn/ui components where possible
- Keep components small and focused
- Write meaningful commit messages

### File Structure

```
src/
├── app/           # Next.js app directory (pages and routes)
├── components/    # Reusable UI components
├── lib/           # Utility functions and configurations
├── hooks/         # Custom React hooks
└── context/       # React context providers
```

### Component Guidelines

1. **Client Components**: Use `'use client'` directive when needed
2. **Server Components**: Prefer server components by default
3. **Naming**: Use PascalCase for components (e.g., `ServiceCard.tsx`)
4. **Props**: Define TypeScript interfaces for all props

Example:
```typescript
interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}

export default function ServiceCard({ icon, title, description, href }: ServiceCardProps) {
  // Component code
}
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the design system colors defined in `globals.css`
- Maintain responsive design (mobile-first)
- Use CSS variables for theme colors
- Prefer className over inline styles

## 🔧 Adding New Features

### Adding a New Service

1. Add the service to `src/lib/data.tsx`:
   ```typescript
   {
     icon: <YourIcon className="h-8 w-8" />,
     title: 'Your Service',
     description: 'Service description',
     href: '/service/your-service',
   }
   ```

2. Create a booking form in `src/components/forms/`:
   ```typescript
   export default function YourServiceForm({ provider, onClose }) {
     // Form implementation
   }
   ```

3. Register the form in `src/components/booking-modal.tsx`

### Adding a New Page

1. Create a file in the `src/app/` directory
2. Export a default component
3. Add navigation link if needed in `src/app/layout.tsx`

Example:
```typescript
export default function NewPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <h1 className="text-4xl font-bold">New Page</h1>
    </div>
  );
}
```

## 🧪 Testing

Before submitting a PR:

1. Test on multiple screen sizes
2. Check for console errors
3. Verify TypeScript compilation:
   ```bash
   npm run typecheck
   ```
4. Run linting:
   ```bash
   npm run lint
   ```

## 📦 Pull Request Process

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Follow the style guide
   - Test thoroughly

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Commit message format:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code style changes
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   
   Then create a Pull Request on GitHub with:
   - Clear description of changes
   - Screenshots (if UI changes)
   - Related issue numbers

## 🐛 Reporting Bugs

When reporting bugs, please include:

- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser and OS information
- Console errors (if any)

## 💡 Suggesting Features

Feature suggestions are welcome! Please:

- Check if the feature already exists
- Clearly describe the feature
- Explain the use case
- Provide mockups if applicable

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to UrbanEzii! 🎉

