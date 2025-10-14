import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';

const blogPosts = [
    {
        image: "https://picsum.photos/seed/blog1/400/250",
        title: "5 Tips for a Sparkling Clean Home",
        description: "Discover professional cleaning tips that will make your home shine. From the kitchen to the bathroom, we've got you covered.",
        author: "Jane Doe",
        date: "August 15, 2024",
        "data-ai-hint": "cleaning home",
    },
    {
        image: "https://picsum.photos/seed/blog2/400/250",
        title: "DIY vs. Professional Plumbers: When to Call for Help",
        description: "Some plumbing issues are a quick fix, but others require a professional. Learn when to tackle the job yourself and when to call in the experts.",
        author: "John Smith",
        date: "August 10, 2024",
        "data-ai-hint": "plumbing work",
    },
    {
        image: "https://picsum.photos/seed/blog3/400/250",
        title: "The Benefits of Hiring a Personal Cook",
        description: "Tired of takeout? Explore the advantages of hiring a personal cook for healthy, delicious, and convenient home-cooked meals.",
        author: "Emily White",
        date: "August 5, 2024",
        "data-ai-hint": "personal cook",
    }
]


export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline tracking-tight">Our Blog</h1>
          <p className="mt-4 text-lg text-muted-foreground">Tips, tricks, and insights for modern urban living.</p>
        </div>

        <div className="grid gap-8">
          {blogPosts.map((post) => (
            <Card key={post.title} className="md:grid md:grid-cols-3 md:gap-6 overflow-hidden">
                <div className="md:col-span-1">
                    <Image 
                        src={post.image}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="object-cover w-full h-full"
                        data-ai-hint={post['data-ai-hint']}
                    />
                </div>
              <div className="md:col-span-2 flex flex-col">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">{post.title}</CardTitle>
                    <CardDescription>
                        By {post.author} on {post.date}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{post.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="p-0">Read More</Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
