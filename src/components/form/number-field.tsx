import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface NumberFieldProps {
  name?: string;
  label?: string;
  clearable?: boolean;
  asString?: boolean;
}

export function NumberField({
  label,
  name = "",
  clearable,
  allowNegative = false,
  asString = false,
  ...props
}: NumberFieldProps & NumericFormatProps) {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          {clearable ? (
            <InputGroup>
              <NumericFormat
                valueIsNumericString={true}
                value={field.value?.toString() || ""}
                onValueChange={(values) => {
                  field.onChange(asString ? values.value : values.floatValue);
                }}
                onBlur={field.onBlur}
                name={field.name}
                getInputRef={field.ref}
                allowNegative={allowNegative}
                {...props}
                customInput={InputGroupInput}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder={props.placeholder || t("enterX", { x: label })}
              />
              {field.value && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton type="button" size="icon-xs" onClick={() => setValue(name, "")} aria-label="Clear">
                    <X />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
          ) : (
            <NumericFormat
              valueIsNumericString={true}
              value={field.value?.toString() || ""}
              onValueChange={(values) => {
                field.onChange(asString ? values.value : values.floatValue);
              }}
              onBlur={field.onBlur}
              name={field.name}
              getInputRef={field.ref}
              allowNegative={allowNegative}
              {...props}
              customInput={Input}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder={props.placeholder || t("enterX", { x: label })}
            />
          )}

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
