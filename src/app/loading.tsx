import { Progress } from "@/components/ui/progress";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-background/90 z-50">
       <div className="w-64 space-y-4">
        <p className="text-center text-lg font-semibold text-foreground">Loading Page...</p>
         <Progress value={33} className="w-full" />
         <p className="text-center text-sm text-muted-foreground">Please wait a moment.</p>
      </div>
    </div>
  )
}
