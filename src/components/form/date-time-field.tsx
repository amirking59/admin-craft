import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useLocale } from "@/hooks/use-locale";
import { faIR, enUS } from "react-day-picker/persian";

interface DateTimeFieldProps {
  name: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}

export function DateTimeField({ label, name, disabled = false, placeholder }: DateTimeFieldProps) {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const [locale] = useLocale();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          <DateTimePicker
            locale={locale === "fa" ? faIR : enUS}
            placeholder={placeholder || t("selectX", { x: label })}
            disabled={disabled}
            value={field.value || null}
            onChange={(value) => field.onChange(value)}
            aria-invalid={fieldState.invalid}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
