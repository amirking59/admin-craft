import { useTranslation } from "react-i18next";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useFieldContext } from "@/components/form/form-context";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Skeleton } from "@/components/ui/skeleton";

type SelectValue = string | number;

export interface SelectItem {
  value: SelectValue;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps {
  label?: string;
  placeholder?: string;
  items?: SelectItem[];
  disabled?: boolean;
  disableItems?: SelectValue[];
  /** Custom rendering for an item in the list and in the selected chips. */
  render?: (value: SelectValue) => React.ReactNode;
  clearable?: boolean;
  loading?: boolean;
  /** Skip client-side filtering; the caller filters `items` from `onSearchChange` (debounce it there). */
  serverSearch?: boolean;
  onSearchChange?: (search: string) => void;
  multiple?: boolean;
  multipleMaxDisplay?: number;
}

export function SelectField({
  label,
  placeholder,
  items = [],
  disabled = false,
  disableItems = [],
  render,
  clearable = false,
  loading = false,
  serverSearch = false,
  onSearchChange,
  multiple = false,
  multipleMaxDisplay = 2,
}: SelectFieldProps) {
  const { t } = useTranslation();
  const field = useFieldContext<SelectValue | SelectValue[] | null>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const anchor = useComboboxAnchor();

  // The combobox works on the primitive values (stable across renders, unlike item objects rebuilt by callers);
  // labels are looked up from `items`.
  const labels = new Map(items.map((item) => [item.value, item.label]));
  const labelOf = (value: SelectValue) => labels.get(value) ?? String(value);
  const isItemDisabled = (value: SelectValue) =>
    disableItems.includes(value) || items.some((item) => item.value === value && item.disabled);
  const value = multiple
    ? Array.isArray(field.state.value)
      ? field.state.value
      : []
    : (field.state.value as SelectValue | null) || null;

  const inputProps = {
    "id": field.name,
    "disabled": disabled,
    "aria-invalid": isInvalid,
    "onBlur": field.handleBlur,
  };

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <Combobox<SelectValue, boolean>
        items={items.map((item) => item.value)}
        multiple={multiple}
        value={value}
        onValueChange={(next) => field.handleChange(next ?? "")}
        itemToStringLabel={labelOf}
        // Highlight the first match while typing, so Enter picks it instead of submitting the form.
        autoHighlight
        filter={serverSearch ? null : undefined}
        onInputValueChange={(search) => onSearchChange?.(search)}
        disabled={disabled}
      >
        {multiple ? (
          <ComboboxChips ref={anchor}>
            <ComboboxValue>
              {(chips: SelectValue[]) => (
                <>
                  {chips.slice(0, multipleMaxDisplay).map((chip) => (
                    <ComboboxChip
                      key={chip}
                      showRemove={clearable && !disabled}
                      removeLabel={t("removeX", { x: labelOf(chip) })}
                    >
                      {render?.(chip) ?? labelOf(chip)}
                    </ComboboxChip>
                  ))}
                  {chips.length > multipleMaxDisplay && (
                    <span className="text-xs text-muted-foreground">
                      {t("xMore", { x: chips.length - multipleMaxDisplay })}
                    </span>
                  )}
                  <ComboboxChipsInput {...inputProps} placeholder={chips.length ? undefined : placeholder} />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
        ) : (
          <ComboboxInput
            {...inputProps}
            className="w-full"
            placeholder={placeholder ?? (label ? t("selectX", { x: label }) : t("search"))}
            showClear={clearable && value !== null}
            clearLabel={t("clear")}
          />
        )}

        <ComboboxContent anchor={multiple ? anchor : undefined}>
          {loading ? (
            <div className="flex flex-col gap-1 p-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-7" />
              ))}
            </div>
          ) : (
            <>
              <ComboboxEmpty>{t("noItemsFound")}</ComboboxEmpty>
              <ComboboxList>
                {(item: SelectValue) => (
                  <ComboboxItem key={item} value={item} disabled={isItemDisabled(item)}>
                    {render?.(item) ?? labelOf(item)}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </>
          )}
        </ComboboxContent>
      </Combobox>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
