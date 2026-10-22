import { SelectField } from "@/components/form/select-field";
import { getEnumValues } from "@/lib/utils";
import { convertCase } from "@/lib/utils";

interface EnumFieldProps {
  placeholder?: string;
  label?: string;
  enumObject: Record<string, string>;
  disabled?: boolean;
  disableItems?: string[];
  getItemLabel?: (value: string | number) => string;
  clearable?: boolean;
  multiple?: boolean;
  multipleMaxDisplay?: number;
  render?: (value: string | number) => string;
}

export const EnumField: React.FC<EnumFieldProps> = ({
  clearable,
  disableItems,
  disabled,
  label,
  placeholder,
  enumObject,
  multiple,
  multipleMaxDisplay,
  render,
}) => {
  return (
    <SelectField
      label={label}
      placeholder={placeholder}
      items={getEnumValues(enumObject).map((value) => {
        return {
          label: render ? render(value) : convertCase(value, "title"),
          value,
        };
      })}
      disabled={disabled}
      disableItems={disableItems}
      clearable={clearable}
      multiple={multiple}
      multipleMaxDisplay={multipleMaxDisplay}
    />
  );
};
