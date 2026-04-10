import { DatePicker } from "@/components/ui/date-picker";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface DateFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
  mode?: "single" | "range";
}

export function DateField({
  label,
  name = "",
  clearable = false,
  disabled = false,
  placeholder,
  mode = "single",
}: DateFieldProps) {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}

          <div className="relative">
            <FormControl>
              {mode === "range" ? (
                <DatePicker
                  mode="range"
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
              ) : (
                <DatePicker
                  mode="single"
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
              )}
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
