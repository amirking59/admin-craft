"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

interface SpinnerWrapperProps {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  spinnerSize?: number;
  spinnerClassName?: string;
  delay?: number;
}

export function SpinnerWrapper({
  children,
  isLoading = false,
  className = "",
  spinnerSize = 24,
  spinnerClassName = "",
  delay = 0,
}: SpinnerWrapperProps) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoading) {
      // Add a small delay before showing the spinner to prevent flashing
      timeout = setTimeout(() => setShowSpinner(true), delay);
    } else {
      setShowSpinner(false);
    }

    return () => clearTimeout(timeout);
  }, [isLoading, delay]);

  return (
    <div className={cn("relative", className)}>
      {children}

      {showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-xs z-10">
          <Loader2
            className={cn("animate-spin text-primary", spinnerClassName)}
            size={spinnerSize}
            aria-label="Loading"
          />
        </div>
      )}
    </div>
  );
}
