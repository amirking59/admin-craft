import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { CalendarIcon, X } from "lucide-react";
import { useFieldContext } from "@/components/form/form-context";

interface DateTimeFieldProps {
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
}

export function DateTimeField({ label, clearable = false, disabled = false, placeholder }: DateTimeFieldProps) {
  const field = useFieldContext<any>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <div className="relative">
        <DateTimePicker
          placeholder={placeholder || `Select ${label}`}
          disabled={disabled}
          value={field.state.value || null}
          onChange={(value) => field.handleChange(value)}
        />

        {!disabled && (
          <div className="absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer p-1">
            {clearable && field.state.value ? (
              <X size={16} onClick={() => field.handleChange("")} />
            ) : (
              <CalendarIcon className="pointer-events-none" size={16} />
            )}
          </div>
        )}
      </div>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
