import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useFieldContext } from "@/components/form/form-context";
import { NumericFormat, NumericFormatProps } from "react-number-format";

// The form owns these; use the field's validators/listeners instead of passing them.
type BoundNumberProps =
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "onChange"
  | "onBlur"
  | "name"
  | "id"
  | "customInput";

interface NumberFieldProps extends Omit<NumericFormatProps, BoundNumberProps> {
  label?: string;
  clearable?: boolean;
}

export function NumberField({
  label,
  clearable = false,
  disabled = false,
  placeholder,
  allowNegative = false,
  ...props
}: NumberFieldProps) {
  const { t } = useTranslation();
  const field = useFieldContext<number | undefined>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <InputGroup>
        <NumericFormat
          {...props}
          customInput={InputGroupInput}
          disabled={disabled}
          placeholder={placeholder ?? (label ? t("enterX", { x: label }) : undefined)}
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
            <InputGroupButton size="icon-xs" aria-label={t("clear")} onClick={() => field.handleChange(undefined)}>
              <X />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
