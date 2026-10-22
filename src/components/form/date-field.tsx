import { DatePicker } from "@/components/ui/date-picker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { CalendarIcon, X } from "lucide-react";
import { useFieldContext } from "@/components/form/form-context";

interface DateFieldProps {
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
  mode?: "single" | "range";
}

export function DateField({
  label,
  clearable = false,
  disabled = false,
  placeholder,
  mode = "single",
}: DateFieldProps) {
  const field = useFieldContext<any>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <div className="relative">
        {mode === "range" ? (
          <DatePicker
            mode="range"
            placeholder={placeholder}
            disabled={disabled}
            value={field.state.value || null}
            onChange={(value) => field.handleChange(value)}
          />
        ) : (
          <DatePicker
            mode="single"
            placeholder={placeholder}
            disabled={disabled}
            value={field.state.value || null}
            onChange={(value) => field.handleChange(value)}
          />
        )}

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
