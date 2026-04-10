import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface FullScreenSpinnerProps {
  className?: string;
}

export const FullScreenSpinner = ({ className }: FullScreenSpinnerProps) => {
  return (
    <div className={cn("flex h-full w-full items-center justify-center", className)}>
      <Loader2 className="mr-2 h-10 w-10 animate-spin" />
    </div>
  );
};
