import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";

interface TextFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
  textarea?: boolean;
  description?: string;
}

export function TextField({
  label,
  name = "",
  clearable = false,
  disabled = false,
  textarea,
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

          {textarea ? (
            <Textarea
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
              placeholder={props.placeholder || t("enterX", { x: label })}
            />
          ) : clearable ? (
            <InputGroup>
              <InputGroupInput
                {...field}
                {...props}
                id={field.name}
                aria-invalid={fieldState.invalid}
                disabled={disabled}
                placeholder={props.placeholder || t("enterX", { x: label })}
              />
              {field.value && !disabled && (
                <InputGroupAddon align="inline-end">
                  <InputGroupButton type="button" size="icon-xs" onClick={() => field.onChange("")} aria-label="Clear">
                    <X />
                  </InputGroupButton>
                </InputGroupAddon>
              )}
            </InputGroup>
          ) : (
            <Input
              {...field}
              {...props}
              id={field.name}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
              placeholder={props.placeholder || t("enterX", { x: label })}
            />
          )}

          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
