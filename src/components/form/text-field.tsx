import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { DebouncedInput, Input } from "@/components/ui/input";
import { useFieldContext } from "@/components/form/form-context";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface TextFieldProps {
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  debounceMs?: number;
  disabled?: boolean;
  textarea?: boolean;
}

export function TextField({
  label,
  clearable = false,
  debounceMs,
  disabled = false,
  textarea,
  ...props
}: (TextFieldProps & React.ComponentProps<"input">) & React.ComponentProps<"textarea">) {
  const field = useFieldContext<string | number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const fieldProps = {
    "id": field.name,
    "name": field.name,
    "value": field.state.value ?? "",
    "onBlur": field.handleBlur,
    "aria-invalid": isInvalid,
  };

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <div className="relative">
        {debounceMs ? (
          <DebouncedInput
            disabled={disabled}
            debounceMs={debounceMs}
            {...fieldProps}
            onChange={(e) => field.handleChange(e.target.value)}
            {...props}
          />
        ) : textarea ? (
          <Textarea
            disabled={disabled}
            placeholder={props.placeholder}
            {...fieldProps}
            onChange={(e) => field.handleChange(e.target.value)}
            {...props}
          />
        ) : (
          <Input disabled={disabled} {...fieldProps} onChange={(e) => field.handleChange(e.target.value)} {...props} />
        )}

        {clearable && !disabled && field.state.value && (
          <div className="absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer p-1">
            <X onClick={() => field.handleChange("")} size={16} />
          </div>
        )}
      </div>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
