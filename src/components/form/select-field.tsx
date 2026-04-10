"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type SelectItemValue = string | number;
type SelectItem = {
  value: SelectItemValue;
  label: string;
  disabled?: boolean;
};

interface SelectFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  items?: SelectItem[];
  disabled?: boolean;
  disableItems?: SelectItemValue[];
  clearable?: boolean;
  loading?: boolean;
  onValueChange?: (value: SelectItemValue | "") => void;
}

export function SelectField({
  label,
  name = "",
  placeholder,
  items = [],
  disabled = false,
  disableItems = [],
  clearable = false,
  loading = false,
  onValueChange,
}: SelectFieldProps) {
  const { t } = useTranslation();
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

          <Select
            name={field.name}
            value={field.value != null ? String(field.value) : ""}
            onValueChange={(value) => {
              if (value == null) return;
              const original = items.find((item) => String(item.value) === value);
              const resolved: SelectItemValue = original ? original.value : value;
              field.onChange(resolved);
              onValueChange?.(resolved);
            }}
            disabled={disabled}
          >
            <SelectTrigger id={field.name} aria-invalid={fieldState.invalid} className="w-full">
              <SelectValue placeholder={placeholder || t("selectX", { x: label })} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="mx-1.5 my-1 h-7" />)
                ) : (
                  <>
                    {clearable && field.value != null && field.value !== "" && (
                      <SelectItem
                        value="__clear__"
                        onPointerDown={() => {
                          field.onChange("");
                          onValueChange?.("");
                        }}
                      >
                        <span className="text-muted-foreground">{t("clear", { ns: "base" })}</span>
                      </SelectItem>
                    )}
                    {items.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={String(item.value)}
                        disabled={item.disabled || disableItems.includes(item.value)}
                      >
                        {item.label}
                      </SelectItem>
                    ))}
                  </>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
