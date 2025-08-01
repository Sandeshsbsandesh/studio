import AlternativeProviderForm from './alternative-provider-form';
import { Bot } from 'lucide-react';

export default function AiAssistantPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Bot className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">
            AI-Powered Service Assistant
          </h1>
          <p className="text-lg text-muted-foreground font-body">
            Unhappy with your current service? Enter the details below, and our AI will suggest top-rated alternative providers in your area.
          </p>
        </div>
        <div className="mt-12">
          <AlternativeProviderForm />
        </div>
      </div>
    </div>
  );
}
