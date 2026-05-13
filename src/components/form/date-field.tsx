import { DatePicker } from "@/components/ui/date-picker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { CalendarIcon, X } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

interface DateFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
  mode?: "single" | "range";
}

export function DateField({
  label,
  name = "",
  clearable = false,
  disabled = false,
  placeholder,
  mode = "single",
}: DateFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          <div className="relative">
            {mode === "range" ? (
              <DatePicker
                mode="range"
                placeholder={placeholder}
                disabled={disabled}
                value={field.value || null}
                onChange={(value) => field.onChange(value)}
              />
            ) : (
              <DatePicker
                mode="single"
                placeholder={placeholder}
                disabled={disabled}
                value={field.value || null}
                onChange={(value) => field.onChange(value)}
              />
            )}

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
