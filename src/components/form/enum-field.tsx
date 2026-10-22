import { SelectField, type SelectFieldProps } from "@/components/form/select-field";
import { convertCase, getEnumValues } from "@/lib/utils";

interface EnumFieldProps extends Omit<
  SelectFieldProps,
  "items" | "render" | "loading" | "serverSearch" | "onSearchChange"
> {
  enumObject: Record<string, string>;
  /** Label for each enum value (e.g. a translation); defaults to the title-cased value. */
  getItemLabel?: (value: string) => string;
}

export function EnumField({ enumObject, getItemLabel, ...props }: EnumFieldProps) {
  return (
    <SelectField
      {...props}
      items={getEnumValues(enumObject).map((value) => ({
        value,
        label: getItemLabel ? getItemLabel(value) : convertCase(value, "title"),
      }))}
    />
  );
}
