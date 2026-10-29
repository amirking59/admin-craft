import { m } from "@/paraglide/messages.js";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { X } from "lucide-react";
import { useFieldContext } from "@/components/form/form-context";
import { FieldFrame, type FieldFrameProps } from "@/components/form/field-frame";
import { NumericFormat, NumericFormatProps } from "react-number-format";

// The form owns these; use the field's validators/listeners instead of passing them. `required` marks the label.
type BoundNumberProps =
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "onChange"
  | "onBlur"
  | "name"
  | "id"
  | "customInput"
  | "required";

interface NumberFieldProps extends Omit<NumericFormatProps, BoundNumberProps>, FieldFrameProps {
  clearable?: boolean;
}

export function NumberField({
  label,
  required,
  description,
  clearable = false,
  disabled = false,
  placeholder,
  allowNegative = false,
  ...props
}: NumberFieldProps) {
  const field = useFieldContext<number | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldFrame label={label} required={required} description={description}>
      <InputGroup>
        <NumericFormat
          {...props}
          customInput={InputGroupInput}
          disabled={disabled}
          placeholder={placeholder ?? (label ? m.enter_x({ x: label.toLowerCase() }) : undefined)}
          allowNegative={allowNegative}
          valueIsNumericString={true}
          id={field.name}
          name={field.name}
          value={field.state.value?.toString() ?? ""}
          onValueChange={(values) => field.handleChange(values.floatValue)}
          onBlur={field.handleBlur}
          aria-invalid={isInvalid}
        />

        {clearable && !disabled && field.state.value != null && (
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label={m.clear()} onClick={() => field.handleChange(undefined)}>
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    </FieldFrame>
  );
}
