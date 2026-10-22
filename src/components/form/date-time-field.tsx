import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { CalendarIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useFieldContext } from "@/components/form/form-context";

interface DateTimeFieldProps {
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
}

export function DateTimeField({ label, clearable = false, disabled = false, placeholder }: DateTimeFieldProps) {
  const { t } = useTranslation();
  /** ISO string, as DateTimePicker emits it. */
  const field = useFieldContext<string | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <div className="relative">
        <DateTimePicker
          placeholder={placeholder ?? (label ? t("selectX", { x: label }) : "")}
          disabled={disabled}
          aria-invalid={isInvalid}
          value={field.state.value || null}
          onChange={field.handleChange}
        />

        {clearable && !disabled && field.state.value ? (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={t("clear")}
            // Centered with margins, not a transform: Button's press effect (active:translate-y-px) would replace it.
            className="absolute inset-y-0 end-1.5 my-auto"
            onClick={() => field.handleChange(null)}
          >
            <X />
          </Button>
        ) : (
          <CalendarIcon className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2" />
        )}
      </div>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
