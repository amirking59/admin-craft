import { SelectField } from "@/components/form/select-field";
import { getEnumValues } from "@/utils/enum";

interface EnumFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  enumObject: Record<string, string>;
  disabled?: boolean;
  disableItems?: string[];
  getItemLabel: (value: string | number) => string;
  clearable?: boolean;
  multiple?: boolean;
  multipleMaxDisplay?: number;
}

export const EnumField: React.FC<EnumFieldProps> = ({
  clearable,
  disableItems,
  disabled,
  label,
  name,
  placeholder,
  enumObject,
  getItemLabel,
}) => {
  return (
    <SelectField
      name={name}
      label={label}
      placeholder={placeholder}
      items={getEnumValues(enumObject).map((value) => {
        return {
          label: getItemLabel(value),
          value,
        };
      })}
      disabled={disabled}
      disableItems={disableItems}
      clearable={clearable}
    />
  );
};
