import * as React from "react";
import { useEffect, useState } from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "cn";
import { useDebounce } from "@/hooks/use-debounce";

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

function DebouncedInput({ debounceMs = 300, ...props }: React.ComponentProps<"input"> & { debounceMs: number }) {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [localValue, setLocalValue] = useState(props.value);

  const debouncedValue = useDebounce(localValue || "", debounceMs);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    props.onChange?.({ target: { value: debouncedValue } } as React.ChangeEvent<HTMLInputElement>);
  }, [debouncedValue]);

  useEffect(() => {
    if (props.value !== localValue) {
      setLocalValue(props.value);
    }
  }, [props.value]);

  return <Input {...props} value={localValue} onChange={(e) => setLocalValue(e.target.value)} />;
}

// Matches Input, for buttons that act as inputs (e.g. the date pickers' triggers).
const inputTriggerClassName =
  "h-9 w-full min-w-0 justify-between rounded-md border border-input bg-transparent px-2.5 py-1 text-base font-normal shadow-xs transition-[color,box-shadow] outline-none hover:bg-transparent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:hover:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

export { Input, DebouncedInput, inputTriggerClassName };
