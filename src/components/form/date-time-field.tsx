import { m } from "@/paraglide/messages.js";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { FieldFrame, type FieldFrameProps } from "@/components/form/field-frame";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFieldContext } from "@/components/form/form-context";

interface DateTimeFieldProps extends FieldFrameProps {
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
}

export function DateTimeField({
  label,
  required,
  description,
  clearable = false,
  disabled = false,
  placeholder,
}: DateTimeFieldProps) {
  /** ISO string, as DateTimePicker emits it. */
  const field = useFieldContext<string | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldFrame label={label} required={required} description={description}>
      <div className="relative">
        <DateTimePicker
          placeholder={placeholder ?? (label ? m.select_x({ x: label.toLowerCase() }) : "")}
          disabled={disabled}
          aria-invalid={isInvalid}
          value={field.state.value || null}
          onChange={field.handleChange}
        />

        {clearable && !disabled && field.state.value ? (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={m.clear()}
            // Centered with margins, not a transform: Button's press effect (active:translate-y-px) would replace it.
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
