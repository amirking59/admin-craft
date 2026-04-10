import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";

interface TextFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  description?: string;
}

export function TextField({
  label,
  name = "",
  disabled = false,
  description,
  ...props
}: TextFieldProps & React.ComponentProps<"input">) {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          <Input
            {...field}
            {...props}
            id={field.name}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
            placeholder={props.placeholder || t("enterX", { x: label })}
          />

          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
