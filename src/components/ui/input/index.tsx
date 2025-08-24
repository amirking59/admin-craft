import { cn } from "@/utils/cn";
import { useDebounce } from "@/hooks/use-debounce";
import { useEffect, useState } from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm font-medium file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
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

    props.onChange?.({
      target: { value: debouncedValue },
    } as React.ChangeEvent<HTMLInputElement>);
  }, [debouncedValue]);

  useEffect(() => {
    if (props.value !== localValue) {
      setLocalValue(props.value);
    }
  }, [props.value]);

  return <Input {...props} value={localValue} onChange={(e) => setLocalValue(e.target.value)} />;
}

export { Input, DebouncedInput };
