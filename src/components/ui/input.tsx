import { useEffect, useState } from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
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

const inputTriggerClassName =
  "h-8 w-full min-w-0 justify-between rounded-lg border border-input bg-transparent px-2.5 py-1 text-base font-normal shadow-none transition-colors outline-none hover:bg-transparent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:hover:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

export { Input, DebouncedInput, inputTriggerClassName };
