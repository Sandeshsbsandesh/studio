// This is a placeholder file. You can edit it to add your own content.
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
    {
        name: "For Users",
        price: "Free",
        description: "Access a world of convenience with no hidden fees.",
        features: [
            "Browse unlimited services",
            "Book verified professionals",
            "Use AI Assistant for suggestions",
            "Secure and easy payments",
        ],
        cta: "Sign Up Now"
    },
    {
        name: "For Providers",
        price: "Commission-Based",
        description: "Grow your business by only paying for the work you get.",
        features: [
            "List your services",
            "Reach thousands of customers",
            "Easy booking management",
            "Secure and timely payouts",
        ],
        cta: "Join as a Provider"
    }
]

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline tracking-tight">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-muted-foreground">No surprises. Just great service at a fair price.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {plans.map(plan => (
                <Card key={plan.name} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <div className="mb-6">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            {plan.name === "For Providers" && <span className="text-muted-foreground"> / per completed job</span>}
                        </div>
                        <ul className="space-y-4">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <Check className="h-5 w-5 text-primary" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full">{plan.cta}</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
