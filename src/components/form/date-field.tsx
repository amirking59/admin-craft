import { m } from "@/paraglide/messages.js";
import { DatePicker } from "@/components/ui/date-picker";
import { FieldFrame, type FieldFrameProps } from "@/components/form/field-frame";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFieldContext } from "@/components/form/form-context";

/** ISO strings, as DatePicker emits them. */
type DateRangeValue = { from: string | null; to: string | null };

interface DateFieldProps extends FieldFrameProps {
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  mode?: "single" | "range";
}

export function DateField({
  label,
  required,
  description,
  clearable = false,
  disabled = false,
  placeholder,
  mode = "single",
}: DateFieldProps) {
  const field = useFieldContext<string | DateRangeValue | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const value = field.state.value || null;
  const placeholderText = placeholder ?? (label ? m.select_x({ x: label.toLowerCase() }) : undefined);

  return (
    <FieldFrame label={label} required={required} description={description}>
      <div className="relative">
        {mode === "range" ? (
          <DatePicker
            mode="range"
            placeholder={placeholderText}
            disabled={disabled}
            aria-invalid={isInvalid}
            value={typeof value === "object" ? value : null}
            onChange={field.handleChange}
          />
        ) : (
          <DatePicker
            mode="single"
            placeholder={placeholderText}
            disabled={disabled}
            aria-invalid={isInvalid}
            value={typeof value === "string" ? value : null}
            onChange={field.handleChange}
          />
        )}

        {clearable && !disabled && value ? (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={m.clear()}
            className="absolute inset-y-0 end-1.5 my-auto"
            onClick={() => field.handleChange(null)}
          >
            <X />
          </Button>
        ) : (
          <CalendarIcon className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2" />
        )}
      </div>
    </FieldFrame>
  );
}
