import { m } from "@/paraglide/messages.js";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { useFieldContext } from "@/components/form/form-context";
import { FieldFrame, type FieldFrameProps } from "@/components/form/field-frame";
import { X } from "lucide-react";

// The form owns these; use the field's validators/listeners instead of passing them. `required` marks the label.
type BoundInputProps = "value" | "defaultValue" | "onChange" | "onBlur" | "name" | "id" | "required";

interface TextFieldProps extends Omit<React.ComponentProps<"input">, BoundInputProps>, FieldFrameProps {
  clearable?: boolean;
}

export function TextField({
  label,
  required,
  description,
  clearable = false,
  disabled = false,
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string | number>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const hasValue = field.state.value != null && field.state.value !== "";

  return (
    <FieldFrame label={label} required={required} description={description}>
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
    </FieldFrame>
  );
}
