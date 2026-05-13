import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { CalendarIcon, X } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

interface DateTimeFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
}

export function DateTimeField({ label, name, clearable = false, disabled = false, placeholder }: DateTimeFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name || ""}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          <div className="relative">
            <DateTimePicker
              placeholder={placeholder || `Select ${label}`}
              disabled={disabled}
              value={field.value || null}
              onChange={(value) => field.onChange(value)}
            />

            {!disabled && (
              <div className="absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer p-1">
                {clearable && field.value ? (
                  <X size={16} onClick={() => field.onChange("")} />
                ) : (
                  <CalendarIcon className="pointer-events-none" size={16} />
                )}
              </div>
            )}
          </div>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
