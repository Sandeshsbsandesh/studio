// This is a placeholder file. You can edit it to add your own content.
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, LayoutGrid, Bot, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: <LayoutGrid className="h-8 w-8 text-primary" />,
    title: "Wide Range of Services",
    description: "From plumbing and electrical work to cleaning and cooking, find trusted professionals for all your home needs in one place.",
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Quick & Easy Booking",
    description: "Our streamlined booking process lets you schedule a service in just a few clicks. No more endless phone calls.",
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: "AI-Powered Suggestions",
    description: "Not happy with a provider? Our smart assistant suggests the best alternatives based on ratings, distance, and your preferences.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Verified Professionals",
    description: "Every service provider on our platform is background-checked and verified to ensure your safety and peace of mind.",
  },
]

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline tracking-tight">Why Choose UrbanEzii?</h1>
          <p className="mt-4 text-lg text-muted-foreground">Everything you need to manage your home services, simplified.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => (
             <Card key={feature.title} className="bg-card">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                  <CardDescription className="mt-2">{feature.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
