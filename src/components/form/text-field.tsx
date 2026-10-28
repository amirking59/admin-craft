import { m } from "@/paraglide/messages.js";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { useFieldContext } from "@/components/form/form-context";
import { X } from "lucide-react";

// The form owns these; use the field's validators/listeners instead of passing them.
type BoundInputProps = "value" | "defaultValue" | "onChange" | "onBlur" | "name" | "id";

interface TextFieldProps extends Omit<React.ComponentProps<"input">, BoundInputProps> {
  label?: string;
  clearable?: boolean;
}

export function TextField({ label, clearable = false, disabled = false, ...props }: TextFieldProps) {
  const field = useFieldContext<string | number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const hasValue = field.state.value != null && field.state.value !== "";

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <InputGroup>
        <InputGroupInput
          {...props}
          disabled={disabled}
          id={field.name}
          name={field.name}
          value={field.state.value ?? ""}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
        />

        {clearable && !disabled && hasValue && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label={m.clear()} onClick={() => field.handleChange("")}>
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
