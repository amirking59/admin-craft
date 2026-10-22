import { DatePicker } from "@/components/ui/date-picker";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { CalendarIcon, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useFieldContext } from "@/components/form/form-context";

/** ISO strings, as DatePicker emits them. */
type DateRangeValue = { from: string | null; to: string | null };

interface DateFieldProps {
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
  mode?: "single" | "range";
}

export function DateField({
  label,
  clearable = false,
  disabled = false,
  placeholder,
  mode = "single",
}: DateFieldProps) {
  const { t } = useTranslation();
  const field = useFieldContext<string | DateRangeValue | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const value = field.state.value || null;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <div className="relative">
        {mode === "range" ? (
          <DatePicker
            mode="range"
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={isInvalid}
            value={typeof value === "object" ? value : null}
            onChange={field.handleChange}
          />
        ) : (
          <DatePicker
            mode="single"
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={isInvalid}
            value={typeof value === "string" ? value : null}
            onChange={field.handleChange}
          />
        )}

        {clearable && !disabled && value ? (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label={t("clear")}
            className="absolute end-1.5 top-1/2 -translate-y-1/2"
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
