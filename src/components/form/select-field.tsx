"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ControllerRenderProps, FieldValues, useFormContext } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DebouncedInput, Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

type SelectValue = string | number;
type SelectItem = {
  value: SelectValue;
  label: string;
  disabled?: boolean;
};

interface SelectFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  items?: SelectItem[];
  disabled?: boolean;
  disableItems?: SelectValue[];
  render?: (value: SelectValue) => React.ReactNode;
  clearable?: boolean;
  loading?: boolean;
  serverSearch?: boolean;
  onSearchChange?: (search: string) => void;
  multiple?: boolean;
  multipleMaxDisplay?: number;
  onValueChange?: (value: SelectValue | SelectValue[]) => void;
}

export function SelectField({
  label,
  name = "",
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
  multipleMaxDisplay = 1,
  onValueChange,
}: SelectFieldProps) {
  const { t } = useTranslation();
  const { control } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(search);
    }
  }, [search, onSearchChange]);

  const filteredItems = serverSearch
    ? items
    : items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));

  const handleChange = ({
    field,
    item,
  }: {
    item: SelectItem | null;
    field: ControllerRenderProps<FieldValues, string>;
  }) => {
    if (!item) {
      onValueChange?.(multiple ? [] : "");
      field.onChange(multiple ? [] : "");
      return;
    }

    if (multiple) {
      const currentValues = Array.isArray(field.value) ? [...field.value] : [];
      const valueIndex = currentValues.indexOf(item.value);

      if (valueIndex >= 0) {
        currentValues.splice(valueIndex, 1);
      } else {
        currentValues.push(item.value);
      }

      onValueChange?.(currentValues);
      field.onChange(currentValues);
    } else {
      if (field.value === item.value) {
        return;
      }

      onValueChange?.(item.value);
      field.onChange(item.value);
      setIsOpen(false);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const isEmpty = Array.isArray(field?.value) ? field?.value?.length === 0 : !field.value;

        const selectedItems = useMemo(() => {
          if (multiple) {
            const selectedValues = Array.isArray(field.value) ? field.value : [];
            return items.filter((item) => selectedValues.includes(item.value));
          } else {
            const item = items.find((item) => item.value === field.value);
            return item ? [item] : [];
          }
        }, [field.value, items, multiple]);

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}

            <DropdownMenu
              open={isOpen}
              onOpenChange={(open) => {
                setIsOpen(open);
                if (open) {
                  setSearch("");
                }
              }}
            >
              <div className="relative">
                <DropdownMenuTrigger disabled={disabled} asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-auto justify-between bg-transparent dark:bg-input/30",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        "min-h-9 px-3 text-sm",
                      )}
                    >
                      <div className={cn(isEmpty && "hover:text-muted-foreground text-muted-foreground")}>
                        {selectedItems.length > 0 ? (
                          multiple ? (
                            <div className="flex items-center flex-wrap gap-1">
                              {selectedItems.slice(0, multipleMaxDisplay).map((item) => (
                                <Badge
                                  variant={"outline"}
                                  key={item.value}
                                  className="px-1 py-px rounded flex items-center cursor-pointer group"
                                  // Stop Radix from opening the dropdown on pointer down
                                  onPointerDownCapture={(e) => {
                                    if (disabled) return;
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onClick={(e) => {
                                    if (disabled) return;
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleChange({ field, item });
                                  }}
                                  title={t("remove", { ns: "base" })}
                                >
                                  {render?.(item.value) || item.label}
                                  <X className="ml-1 h-3 w-3 opacity-60 group-hover:opacity-100" />
                                </Badge>
                              ))}
                              {selectedItems.length > multipleMaxDisplay && (
                                <span className="text-xs">
                                  {t("xMore", {
                                    x: selectedItems.length - multipleMaxDisplay,
                                  })}
                                </span>
                              )}
                            </div>
                          ) : (
                            render?.(selectedItems[0].value) || selectedItems[0]?.label
                          )
                        ) : (
                          placeholder ||
                          t("selectX", {
                            x: label,
                          })
                        )}
                      </div>
                    </Button>
                  </FormControl>
                </DropdownMenuTrigger>

                {!disabled && (
                  <div className="absolute end-2 cursor-pointer top-1/2 -translate-y-1/2 p-1">
                    {clearable && !disabled && !isEmpty ? (
                      <X
                        size={16}
                        onClick={() =>
                          handleChange({
                            field,
                            item: null,
                          })
                        }
                      />
                    ) : (
                      <ChevronsUpDown size={16} onClick={() => setIsOpen(true)} />
                    )}
                  </div>
                )}
              </div>

              <DropdownMenuContent className="min-w-[var(--radix-dropdown-menu-trigger-width)] p-0">
                <DropdownMenuGroup>
                  <div className="p-2">
                    {serverSearch ? (
                      <DebouncedInput
                        debounceMs={500}
                        autoFocus
                        placeholder={t("search")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    ) : (
                      <Input
                        autoFocus
                        placeholder={t("search")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    )}
                  </div>

                  {loading ? (
                    <div className=" flex flex-col gap-1 overflow-y-auto max-h-[300px] p-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-9" />
                      ))}
                    </div>
                  ) : (
                    <>
                      {filteredItems.length === 0 && (
                        <div className="p-2 mb-2 text-center text-sm text-muted-foreground">{t("noItemsFound")}</div>
                      )}

                      {filteredItems && filteredItems.length > 0 && (
                        <div className=" flex flex-col gap-1 overflow-y-auto max-h-[300px] p-1">
                          {filteredItems.map((item) => {
                            const isSelected = multiple
                              ? Array.isArray(field.value) && field.value.includes(item.value)
                              : field.value === item.value;

                            return (
                              <div
                                key={item.value}
                                onClick={() => {
                                  handleChange({
                                    field,
                                    item,
                                  });
                                }}
                                className={cn(
                                  "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer hover:bg-accent ",
                                  isSelected && "bg-accent text-accent-foreground",
                                  (item?.disabled || disableItems.includes(item.value)) &&
                                    "pointer-events-none opacity-50",
                                )}
                              >
                                <div className="flex items-center justify-between w-full">
                                  {render?.(item.value) || item.label}

                                  {isSelected && <Check className="mr-2 h-4 w-4" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
