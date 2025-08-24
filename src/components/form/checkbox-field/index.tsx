import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

interface CheckboxFieldProps {
  name?: string;
  label?: string;
  disabled?: boolean;
}

export function CheckboxField({ label, name, disabled }: CheckboxFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name || ""}
      render={({ field }) => (
        <div className="h-9">
          <FormItem>
            <div className="flex gap-3 items-center">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={disabled} {...field} />
              </FormControl>

              {label && <FormLabel>{label}</FormLabel>}
            </div>

            <FormMessage />
          </FormItem>
        </div>
      )}
    />
  );
}
