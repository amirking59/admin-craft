import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { DebouncedInput, Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface TextFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  debounceMs?: number;
  disabled?: boolean;
  textarea?: boolean;
}

export function TextField({
  label,
  name = "",
  clearable = false,
  debounceMs,
  disabled = false,
  textarea,
  ...props
}: (TextFieldProps & React.ComponentProps<"input">) & React.ComponentProps<"textarea">) {
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
              <DebouncedInput
                disabled={disabled}
                debounceMs={debounceMs}
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...field}
                {...props}
              />
            ) : textarea ? (
              <Textarea
                disabled={disabled}
                placeholder={props.placeholder}
                id={field.name}
                aria-invalid={fieldState.invalid}
                {...field}
                {...props}
              />
            ) : (
              <Input disabled={disabled} id={field.name} aria-invalid={fieldState.invalid} {...field} {...props} />
            )}

            {clearable && !disabled && field.value && (
              <div className="absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer p-1">
                <X onClick={() => field.onChange("")} size={16} />
              </div>
            )}
          </div>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
