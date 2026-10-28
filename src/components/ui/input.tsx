import * as React from "react";
import { useState } from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";
import { useDebounceCallback } from "usehooks-ts";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

/** An input that reports its value through `onValueChange` once typing pauses for `debounceMs`. */
function DebouncedInput({
  value = "",
  onValueChange,
  debounceMs = 300,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "onChange"> & {
  value?: string;
  onValueChange: (value: string) => void;
  debounceMs?: number;
}) {
  const [localValue, setLocalValue] = useState(value);
  const [lastValue, setLastValue] = useState(value);
  const report = useDebounceCallback(onValueChange, debounceMs);

  // The parent changed the value (e.g. a filter reset): show it. Adjusting state during render avoids an effect.
  if (value !== lastValue) {
    setLastValue(value);
    setLocalValue(value);
  }

  return (
    <Input
      {...props}
      value={localValue}
      onChange={(e) => {
        setLocalValue(e.target.value);
        report(e.target.value);
      }}
    />
  );
}

// Matches Input, for buttons that act as inputs (e.g. the date pickers' triggers).
const inputTriggerClassName =
  "h-9 w-full min-w-0 justify-between rounded-md border border-input bg-transparent px-2.5 py-1 text-base font-normal shadow-xs transition-[color,box-shadow] outline-none hover:bg-transparent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:hover:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

export { Input, DebouncedInput, inputTriggerClassName };
