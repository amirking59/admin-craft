import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface NumberFieldProps {
  name?: string;
  label?: string;
  asString?: boolean;
}

export function NumberField({
  label,
  name = "",
  allowNegative = false,
  asString = false,
  ...props
}: NumberFieldProps & NumericFormatProps) {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

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

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
