import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface NumberFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
  debounceMs?: number;
  decimalScale?: number;
  asString?: boolean;
}

export function NumberField({
  label,
  name = "",
  debounceMs,
  clearable,
  allowNegative = false,
  asString = false,
  ...props
}: NumberFieldProps & NumericFormatProps) {
  const { t } = useTranslation();
  const { control, setValue } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}

          <div className="relative">
            <FormControl>
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
                placeholder={
                  props.placeholder ||
                  t("enterX", {
                    x: label,
                  })
                }
              />
            </FormControl>

            {clearable && field.value && (
              <button
                type="button"
                onClick={() => setValue(name, "")}
                className="absolute end-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
