"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DebouncedInput, Input, inputTriggerClassName } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SelectFieldProps {
  name?: string;
  placeholder?: string;
  label?: string;
  items?: { value: string | number; label: string; disabled?: boolean }[];
  disabled?: boolean;
  disableItems?: (string | number)[];
  render?: (value: string | number) => React.ReactNode;
  clearable?: boolean;
  loading?: boolean;
  serverSearch?: boolean;
  onSearchChange?: (search: string) => void;
  multiple?: boolean;
  multipleMaxDisplay?: number;
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
  multipleMaxDisplay = 2,
}: SelectFieldProps) {
  const { control } = useFormContext();
  const [selectedItems, setSelectedItems] = useState<
    {
      value: string | number;
      label: string;
      disabled?: boolean;
    }[]
  >([]);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    onSearchChange?.(search);
  }, [search]);

  const value = useWatch({
    name,
    control,
  });

  useEffect(() => {
    if (multiple) {
      const selectedValues = Array.isArray(value) ? value : [];
      const selected = items.filter((item) => selectedValues.includes(item.value));
      setSelectedItems(selected);
    } else {
      const item = items?.find((item) => item.value === value);
      setSelectedItems(item ? [item] : []);
    }
  }, [value, items, multiple]);

  const filteredItems = serverSearch
    ? items
    : items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const isEmpty = Array.isArray(field?.value) ? field?.value.length === 0 : !field.value;

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

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
                <DropdownMenuTrigger
                  disabled={disabled}
                  render={
                    <Button
                      id={field.name}
                      variant="outline"
                      aria-invalid={fieldState.invalid}
                      className={cn(inputTriggerClassName, "h-auto min-h-8")}
                    />
                  }
                >
                  <div className={cn(isEmpty && "text-muted-foreground hover:text-muted-foreground")}>
                    {selectedItems.length > 0 ? (
                      multiple ? (
                        <div className="flex flex-wrap items-center gap-1">
                          {selectedItems.slice(0, multipleMaxDisplay).map((item) => (
                            <Badge
                              variant={"outline"}
                              key={item.value}
                              className="flex items-center rounded px-1 py-px"
                            >
                              {render?.(item.value) || item.label}
                            </Badge>
                          ))}
                          {selectedItems.length > multipleMaxDisplay && (
                            <span className="text-xs">{selectedItems.length - multipleMaxDisplay} more</span>
                          )}
                        </div>
                      ) : (
                        render?.(selectedItems[0].value) || selectedItems[0]?.label
                      )
                    ) : (
                      placeholder
                    )}
                  </div>
                </DropdownMenuTrigger>

                {!disabled && (
                  <div className="absolute end-2 top-1/2 -translate-y-1/2 cursor-pointer p-1">
                    {clearable && !disabled && !isEmpty ? (
                      <X size={16} onClick={() => field.onChange(multiple ? [] : "")} />
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
                        placeholder={"Search"}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    ) : (
                      <Input
                        autoFocus
                        placeholder={"Search"}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    )}
                  </div>

                  {loading ? (
                    <div className="flex max-h-[300px] flex-col gap-1 overflow-y-auto p-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-9" />
                      ))}
                    </div>
                  ) : (
                    <>
                      {filteredItems.length === 0 && (
                        <div className="mb-2 p-2 text-center text-sm text-muted-foreground">No items found.</div>
                      )}

                      {filteredItems && filteredItems.length > 0 && (
                        <div className="flex max-h-[300px] flex-col gap-1 overflow-y-auto p-1">
                          {filteredItems.map((item) => {
                            const isSelected = multiple
                              ? Array.isArray(field.value) && field.value.includes(item.value)
                              : field.value === item.value;

                            return (
                              <div
                                key={item.value}
                                onClick={() => {
                                  if (multiple) {
                                    const currentValues = Array.isArray(field.value) ? [...field.value] : [];
                                    const valueIndex = currentValues.indexOf(item.value);

                                    if (valueIndex >= 0) {
                                      currentValues.splice(valueIndex, 1);
                                    } else {
                                      currentValues.push(item.value);
                                    }

                                    field.onChange(currentValues);
                                  } else {
                                    if (field.value === item.value) {
                                      return;
                                    }
                                    field.onChange(item.value);
                                    setIsOpen(false);
                                  }
                                }}
                                className={cn(
                                  "relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:!text-destructive",
                                  isSelected && "bg-accent text-accent-foreground",
                                  (item?.disabled || disableItems.includes(item.value)) &&
                                    "pointer-events-none opacity-50",
                                )}
                              >
                                <div className="flex w-full items-center justify-between">
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

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
