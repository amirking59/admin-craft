import { DateTimePicker } from "@/components/ui/date-time-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLocale } from "@/hooks/use-locale";
import { CalendarIcon, X } from "lucide-react";
import { faIR, enUS } from "react-day-picker/persian";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface DateTimeFieldProps {
  name: string;
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
}

export function DateTimeField({ label, name, clearable = false, disabled = false, placeholder }: DateTimeFieldProps) {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const [locale] = useLocale();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}

          <div className="relative">
            <FormControl>
              <DateTimePicker
                locale={locale === "fa" ? faIR : enUS}
                placeholder={
                  placeholder ||
                  t("selectX", {
                    x: label,
                  })
                }
                disabled={disabled}
                value={field.value || null}
                onChange={(value) => field.onChange(value)}
              />
            </FormControl>

            {!disabled && (
              <div className="absolute end-2 cursor-pointer top-1/2 -translate-y-1/2 p-1">
                {clearable && field.value ? (
                  <X size={16} onClick={() => field.onChange("")} />
                ) : (
                  <CalendarIcon className="pointer-events-none" size={16} />
                )}
              </div>
            )}
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
