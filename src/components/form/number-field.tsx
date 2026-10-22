import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { DebouncedInput, Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useFieldContext } from "@/components/form/form-context";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface NumberFieldProps {
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
  debounceMs?: number;
  decimalScale?: number;
}

export function NumberField({
  label,
  debounceMs,
  clearable,
  placeholder,
  allowNegative = false,
  ...props
}: NumberFieldProps & NumericFormatProps) {
  const field = useFieldContext<number | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <div className="relative">
        {debounceMs ? (
          <NumericFormat
            debounceMs={debounceMs}
            valueIsNumericString={true}
            value={field.state.value?.toString() || ""}
            onValueChange={(values) => {
              field.handleChange(values.floatValue);
            }}
            onBlur={field.handleBlur}
            name={field.name}
            allowNegative={allowNegative}
            id={field.name}
            aria-invalid={isInvalid}
            {...props}
            placeholder={placeholder || `Enter ${label}`}
            customInput={DebouncedInput}
          />
        ) : (
          <NumericFormat
            valueIsNumericString={true}
            value={field.state.value?.toString() || ""}
            onValueChange={(values) => {
              field.handleChange(values.floatValue);
            }}
            onBlur={field.handleBlur}
            name={field.name}
            allowNegative={allowNegative}
            id={field.name}
            aria-invalid={isInvalid}
            {...props}
            placeholder={placeholder || `Enter ${label}`}
            customInput={Input}
          />
        )}

        {clearable && field.state.value !== 0 && (
          <button
            type="button"
            onClick={() => field.handleChange(0)}
            className="absolute end-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
