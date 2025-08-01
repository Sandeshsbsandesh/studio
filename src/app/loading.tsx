import { Progress } from "@/components/ui/progress";

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-background/80 z-50">
       <div className="w-64">
        <p className="text-center mb-4">Loading...</p>
         <Progress value={33} className="w-full" />
      </div>
    </div>
  )
}
