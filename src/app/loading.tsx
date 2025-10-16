
'use client';

import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-background/95 backdrop-blur-sm z-50">
       <div className="w-80 space-y-6 p-8 bg-card rounded-lg shadow-lg border">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-primary animate-spin" />
          <p className="text-center text-xl font-semibold text-foreground font-headline">Loading...</p>
        </div>
         <Progress value={66} className="w-full h-2" />
         <p className="text-center text-sm text-muted-foreground font-body">Please wait while we prepare your content.</p>
      </div>
    </div>
  )
}
