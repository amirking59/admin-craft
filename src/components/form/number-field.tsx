import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { DebouncedInput, Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface NumberFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
  debounceMs?: number;
  decimalScale?: number;
}

export function NumberField({
  label,
  name = "",
  debounceMs,
  clearable,
  placeholder,
  allowNegative = false,
  ...props
}: NumberFieldProps & NumericFormatProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          <div className="relative">
            {debounceMs ? (
              <NumericFormat
                debounceMs={debounceMs}
                valueIsNumericString={true}
                value={field.value?.toString() || ""}
                onValueChange={(values) => {
                  field.onChange(values.floatValue);
                }}
                onBlur={field.onBlur}
                name={field.name}
                getInputRef={field.ref}
                allowNegative={allowNegative}
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...props}
                placeholder={placeholder || `Enter ${label}`}
                customInput={DebouncedInput}
              />
            ) : (
              <NumericFormat
                valueIsNumericString={true}
                value={field.value?.toString() || ""}
                onValueChange={(values) => {
                  field.onChange(values.floatValue);
                }}
                onBlur={field.onBlur}
                name={field.name}
                getInputRef={field.ref}
                allowNegative={allowNegative}
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...props}
                placeholder={placeholder || `Enter ${label}`}
                customInput={Input}
              />
            )}

            {clearable && field.value !== 0 && (
              <button
                type="button"
                onClick={() => field.onChange(0)}
                className="absolute end-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
