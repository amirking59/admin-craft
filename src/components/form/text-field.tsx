import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface TextFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  debounceMs?: number;
  disabled?: boolean;
  textarea?: boolean;
  description?: string;
  containerClassName?: string;
}

export function TextField({
  label,
  name = "",
  clearable = false,
  debounceMs,
  disabled = false,
  textarea,
  description,
  containerClassName,
  ...props
}: TextFieldProps & React.ComponentProps<"input">) {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && <FormLabel>{label}</FormLabel>}
          <div className="relative">
            <FormControl>
              {textarea ? (
                <Textarea
                  disabled={disabled}
                  {...field}
                  placeholder={
                    props.placeholder ||
                    t("enterX", {
                      x: label,
                    })
                  }
                />
              ) : (
                <Input
                  disabled={disabled}
                  {...field}
                  {...props}
                  placeholder={
                    props.placeholder ||
                    t("enterX", {
                      x: label,
                    })
                  }
                />
              )}
            </FormControl>

            {clearable && !disabled && field.value && (
              <div className="absolute end-2 top-1/2 -translate-y-1/2 p-1 cursor-pointer">
                <X onClick={() => field.onChange("")} size={16} />
              </div>
            )}
          </div>

          <FormDescription>{description}</FormDescription>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
