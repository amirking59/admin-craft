import { m } from "@/paraglide/messages.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Check, ChevronRight, Plus, X } from "lucide-react";
import { useTableContext } from "@/components/data-table/table-context";
import type { FilterDef, FilterOption, FilterValue } from "@/components/data-table/types";
import dayjs from "dayjs";
import { datePresets, filtersArrayToObject, isFilterValueEmpty } from "@/components/data-table/utils";
import { useAppForm } from "@/components/form/use-app-form";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { ComboboxItem, isRowPress } from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate } from "@/lib/utils";

const formatFilterValue = (filter: FilterDef, value: FilterValue) => {
  if (filter.formatValue) return filter.formatValue(value);
  if (filter.date) return formatDate(String(value), false);
  const labels = new Map(filter.options?.().map((option) => [option.value, option.label]));
  return [value]
    .flat()
    .map((v) => labels.get(v) ?? v)
    .join(", ");
};

// The URL holds strings while a field may hold a number (500 vs "500"), so compare as strings.
const asStrings = (value: unknown) => (Array.isArray(value) ? value.map(String) : String(value ?? ""));
const sameValue = (a: unknown, b: unknown) => JSON.stringify(asStrings(a)) === JSON.stringify(asStrings(b));

/**
 * The table's filters, read from and written to the URL through the table's column filters:
 * - pinned filters sit inline and apply as you type
 * - the rest show once set, each as a button group (the filter, and × to remove it); the filter button opens it
 *   alone in a popover
 * - "+ Filter" lists the unset ones, with a line to type into, so a long list stays easy to use
 */
export function FilterBar() {
  const { table } = useTableContext();
  const filters = useMemo(() => table.options.meta?.filters ?? [], [table.options.meta?.filters]);

  const appliedKey = JSON.stringify(filtersArrayToObject(table.state.columnFilters));
  const applied = useMemo<Record<string, FilterValue>>(() => JSON.parse(appliedKey), [appliedKey]);

  // The filter whose editor is open, and the one whose editor is open *or still animating*: a filter just picked
  // from "+ Filter" (its chip mounts closed, then opens, so the editor animates in) or one closing (its chip stays
  // until the close animation ends, even with no value, and its draft is kept until then).
  const [editing, setEditing] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  // A date filter's "Custom…" dialog. The name stays after closing, so the title holds through the close animation.
  const [custom, setCustom] = useState<{ name: string; open: boolean } | null>(null);
  const customFilter = filters.find((filter) => filter.name === custom?.name);

  // One draft form for all filters, so a filter's onValueChange can reach the others.
  const form = useAppForm({
    defaultValues: Object.fromEntries(filters.map((filter) => [filter.name, applied[filter.name] ?? ""])) as Record<
      string,
      FilterValue
    >,
  });

  const apply = () => {
    table.setColumnFilters(
      Object.entries(form.state.values)
        .filter(([, value]) => !isFilterValueEmpty(value))
        .map(([id, value]) => ({ id, value })),
    );
  };

  // Show what's applied: after the URL changes from outside (back button, a link, "Reset"), and after an editor
  // has closed without applying, which drops its draft. The active editor keeps its draft.
  useEffect(() => {
    for (const filter of filters) {
      if (filter.name === active) continue;
      const value = applied[filter.name] ?? "";
      // A sync, not an edit: no listeners (they would re-apply), no validation, no touched state.
      if (!sameValue(form.getFieldValue(filter.name), value)) {
        form.setFieldValue(filter.name, value, { dontRunListeners: true, dontValidate: true, dontUpdateMeta: true });
      }
    }
  }, [applied, active, filters, form]);

  // A value picked outside a chip's editor ("+ Filter", the "Custom…" dialog).
  const setFilter = (name: string, value: FilterValue) => {
    form.setFieldValue(name, value, { dontRunListeners: true });
    filters.find((filter) => filter.name === name)?.onValueChange?.(form);
    apply();
  };

  const remove = (name: string) => {
    form.setFieldValue(name, "");
    apply();
  };

  const pinned = filters.filter((filter) => filter.pinned);
  const chips = filters.filter((filter) => !filter.pinned && (filter.name in applied || filter.name === active));
  // In "+ Filter": a filter with options or a date always (its values can be picked there, like Linear); others
  // until set.
  const addable = filters.filter(
    (filter) =>
      !filter.pinned && (filter.options || filter.date || (!(filter.name in applied) && filter.name !== active)),
  );

  return (
    <div className="mb-3 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
      {pinned.map((filter) => (
        // As tall as the bar's small buttons (32px) rather than a form input (36px), so the row lines up.
        <div key={filter.name} className="md:w-64 [&_[data-slot=input-group]]:h-8">
          <form.AppField
            name={filter.name}
            listeners={{
              onChange: () => {
                filter.onValueChange?.(form);
                apply();
              },
              onChangeDebounceMs: 300,
            }}
          >
            {() => filter.input?.()}
          </form.AppField>
        </div>
      ))}

      {/* On a phone the chips scroll sideways instead of wrapping. */}
      <div className="flex [scrollbar-width:none] items-center gap-2 overflow-x-auto md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden">
        {chips.map((filter) => {
          const value = applied[filter.name];
          const label = filter.label();

          return (
            <ButtonGroup key={filter.name} className="shrink-0">
              <FilterEditor
                open={editing === filter.name}
                onOpenChange={(open) => {
                  setEditing(open ? filter.name : null);
                  if (open) setActive(filter.name);
                }}
                onOpenChangeComplete={(open) => {
                  if (!open) setActive((current) => (current === filter.name ? null : current));
                }}
                list={!!filter.options}
                trigger={<Button variant="outline" size="sm" className="max-w-72 min-w-28 justify-start font-normal" />}
                triggerContent={
                  <>
                    <span className="text-muted-foreground">{value ? `${label}:` : label}</span>
                    {value && <span className="truncate font-medium">{formatFilterValue(filter, value)}</span>}
                  </>
                }
              >
                {/* Every change applies at once, like Linear: picking an option right away, typing after a pause. */}
                <form.AppField
                  name={filter.name}
                  listeners={{
                    onChange: () => {
                      filter.onValueChange?.(form);
                      apply();
                    },
                    onChangeDebounceMs: filter.options || filter.date ? 0 : 300,
                  }}
                >
                  {(field) =>
                    filter.options ? (
                      <FilterOptionsList
                        open={editing === filter.name}
                        label={label}
                        options={filter.options()}
                        multiple={filter.multiple !== false}
                        value={field.state.value}
                        onChange={(next, close) => {
                          field.handleChange(next);
                          if (close) setEditing(null);
                        }}
                      />
                    ) : filter.date ? (
                      <FilterCalendar
                        value={field.state.value}
                        onChange={(next) => {
                          field.handleChange(next);
                          setEditing(null);
                        }}
                      />
                    ) : (
                      filter.input?.()
                    )
                  }
                </form.AppField>
              </FilterEditor>

              {value && (
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label={m.remove_x({ x: label })}
                  className="text-muted-foreground"
                  onClick={() => remove(filter.name)}
                >
                  <X />
                </Button>
              )}
            </ButtonGroup>
          );
        })}

        {addable.length > 0 && (
          <AddFilterMenu
            filters={addable}
            onPick={(name) => {
              // Mount the chip closed first: an editor that is already open when it mounts doesn't animate in.
              setActive(name);
              requestAnimationFrame(() => setEditing(name));
            }}
            onCustom={(name) => setCustom({ name, open: true })}
            values={applied}
            onChange={setFilter}
          />
        )}

        {Object.keys(applied).length > 0 && (
          <Button variant="ghost" size="sm" className="shrink-0" onClick={() => table.resetColumnFilters(true)}>
            {m.table_reset_filters()}
          </Button>
        )}
      </div>

      {/* A date's "Custom…": its value is picked here; the filter is added once a day is picked. */}
      <Dialog
        open={!!custom?.open}
        onOpenChange={(open) => !open && setCustom((current) => current && { ...current, open: false })}
      >
        <DialogContent className="w-auto">
          <DialogHeader>
            <DialogTitle>{customFilter?.label()}</DialogTitle>
          </DialogHeader>
          {custom && (
            <FilterCalendar
              // The dialog's own padding and background, not a second inset.
              className="bg-transparent p-0"
              value={applied[custom.name] ?? ""}
              onChange={(next) => {
                setFilter(custom.name, next);
                setCustom({ ...custom, open: false });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface FilterEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** After the open or close animation ends. */
  onOpenChangeComplete: (open: boolean) => void;
  /** The content is a FilterOptionsList: the popover is just the list, and its search line takes focus. */
  list: boolean;
  trigger: React.ReactElement;
  triggerContent: React.ReactNode;
  children: React.ReactNode;
}

/**
 * One filter's editor: a popover under its chip, on every screen size. A field-based editor focuses the popover
 * itself, so a field waits for a tap or click, and a phone's keyboard stays down until then.
 */
function FilterEditor({
  open,
  onOpenChange,
  onOpenChangeComplete,
  list,
  trigger,
  triggerContent,
  children,
}: FilterEditorProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  if (list) {
    return (
      <Popover open={open} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
        <PopoverTrigger render={trigger}>{triggerContent}</PopoverTrigger>
        <PopoverContent
          ref={popupRef}
          // The search line takes focus, except when opened by touch: on a phone that would pop the keyboard up.
          initialFocus={(openType) => (openType === "touch" ? popupRef.current : true)}
          align="start"
          className="w-64 gap-0 p-0"
        >
          {children}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
      <PopoverTrigger render={trigger}>{triggerContent}</PopoverTrigger>
      <PopoverContent
        ref={popupRef}
        initialFocus={popupRef}
        align="start"
        // A calendar is the picker itself: the popover fits it, as DatePicker's does.
        className="has-data-[slot=calendar]:w-auto has-data-[slot=calendar]:p-0"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

interface FilterOptionsListProps {
  /** The surrounding editor's open state: closing it resets the search line. */
  open: boolean;
  /** The filter's name, for the search line's accessible name. */
  label: string;
  options: FilterOption[];
  multiple: boolean;
  value: unknown;
  /** `close`: the pick was a press on a row, so the editor closes (see isRowPress). */
  onChange: (value: FilterValue, close: boolean) => void;
}

/**
 * A filter's options as Linear shows them: a search line, then one row per option with a checkbox. Picking applies
 * at once. With `multiple`, every pick toggles its option: from the checkbox (or the keyboard) the list stays for
 * more picks, from the rest of the row the editor closes. An inline combobox, so arrows, Enter and typing work.
 */
function FilterOptionsList({ open, label, options, multiple, value, onChange }: FilterOptionsListProps) {
  const labels = new Map(options.map((option) => [option.value, option.label]));
  const icons = new Map(options.map((option) => [option.value, option.icon]));
  const selected = [value].flat().filter((v): v is string => typeof v === "string" && v !== "");

  return (
    <ComboboxPrimitive.Root<string, boolean>
      inline
      open={open}
      items={options.map((option) => option.value)}
      multiple={multiple}
      value={multiple ? selected : (selected[0] ?? null)}
      onValueChange={(next, details) =>
        onChange((next as string | string[] | null) ?? "", !multiple || isRowPress(details))
      }
      itemToStringLabel={(v) => labels.get(v) ?? v}
      autoHighlight
    >
      <ComboboxPrimitive.Input
        aria-label={label}
        placeholder={m.table_filter_search()}
        className="w-full border-b bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
      />
      <ComboboxPrimitive.Empty className="px-3 py-2 text-sm text-muted-foreground empty:hidden">
        {m.no_items_found()}
      </ComboboxPrimitive.Empty>
      <ComboboxPrimitive.List className="max-h-72 overflow-y-auto p-1 empty:p-0">
        {(v: string) => (
          <ComboboxItem key={v} value={v} indicator={multiple ? "checkbox" : "check"}>
            {icons.get(v)}
            <span className="truncate">{labels.get(v)}</span>
          </ComboboxItem>
        )}
      </ComboboxPrimitive.List>
    </ComboboxPrimitive.Root>
  );
}

/**
 * A date filter's editor: a calendar, one pick, which applies and closes like a single-pick list. The value is the
 * day's start as an ISO string, as from DateField; picking the selected day again clears it.
 */
function FilterCalendar({
  value,
  onChange,
  className,
}: {
  value: FilterValue;
  onChange: (value: string) => void;
  className?: string;
}) {
  const selected = value ? dayjs(String(value)).toDate() : undefined;

  return (
    <Calendar
      mode="single"
      className={className}
      defaultMonth={selected}
      selected={selected}
      onSelect={(date) => onChange(date ? dayjs(date).toISOString() : "")}
    />
  );
}

const popupClassName =
  "origin-(--transform-origin) overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none transition-[scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0";
const searchClassName =
  "w-full border-b bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground";
const menuItemClassName =
  "group/menu-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground";

interface AddFilterMenuProps {
  filters: FilterDef[];
  /** The applied values, so a filter's submenu shows what's already picked. */
  values: Record<string, FilterValue>;
  /** A filter without options: add its chip and open its editor. */
  onPick: (name: string) => void;
  /** A filter with options: its new value, picked in its submenu. */
  onChange: (name: string, value: FilterValue) => void;
  /** A date filter's "Custom…". */
  onCustom: (name: string) => void;
}

/**
 * "+ Filter", on Base UI's searchable Menu: type to narrow the filters. A filter with options opens its values in a
 * searchable submenu, like Linear, and Base UI handles the submenu (hover intent and the path to it, → or ← by text
 * direction, focus). A date filter offers "1 day ago" … "1 year ago" the same way, plus "Custom…". Anything else
 * adds a chip and opens its editor.
 */
function AddFilterMenu({ filters, values, onPick, onChange, onCustom }: AddFilterMenuProps) {
  // Closed through Base UI, not a controlled `open`: closing that way from inside the submenu leaves the trigger
  // thinking the menu is still open, so its next press does nothing.
  const actions = useRef<MenuPrimitive.Root.Actions>(null);

  return (
    <MenuPrimitive.FilterProvider>
      <MenuPrimitive.Root actionsRef={actions}>
        <MenuPrimitive.Trigger render={<Button variant="outline" size="sm" className="shrink-0 border-dashed" />}>
          <Plus />
          {m.table_filter()}
        </MenuPrimitive.Trigger>
        <MenuPrimitive.Portal>
          <MenuPrimitive.Positioner
            align="start"
            sideOffset={4}
            className="isolate z-50 outline-none"
            data-base-ui-swipe-ignore=""
          >
            <MenuPrimitive.Popup className={`w-56 ${popupClassName}`}>
              <MenuPrimitive.Input
                aria-label={m.table_filter_by()}
                placeholder={m.table_filter_by()}
                className={searchClassName}
              />
              <MenuPrimitive.Empty className="px-3 py-2 text-sm text-muted-foreground">
                {m.no_items_found()}
              </MenuPrimitive.Empty>
              <MenuPrimitive.List className="max-h-72 overflow-y-auto p-1 outline-none">
                {filters.map((filter) =>
                  filter.options ? (
                    <FilterSubmenu key={filter.name} label={filter.label()}>
                      <OptionItems
                        filter={filter}
                        value={values[filter.name]}
                        onChange={(next, close) => {
                          onChange(filter.name, next);
                          if (close) actions.current?.close();
                        }}
                      />
                    </FilterSubmenu>
                  ) : filter.date ? (
                    // A preset applies at once; "Custom…" opens a dialog to pick the date.
                    <FilterSubmenu key={filter.name} label={filter.label()}>
                      {datePresets().map((preset) => (
                        <MenuPrimitive.Item
                          key={preset.value}
                          label={preset.label}
                          className={menuItemClassName}
                          onClick={() => onChange(filter.name, preset.value)}
                        >
                          {preset.icon}
                          {preset.label}
                        </MenuPrimitive.Item>
                      ))}
                      <MenuPrimitive.Item
                        label={m.table_custom()}
                        className={menuItemClassName}
                        onClick={() => onCustom(filter.name)}
                      >
                        {m.table_custom()}
                      </MenuPrimitive.Item>
                    </FilterSubmenu>
                  ) : (
                    <MenuPrimitive.Item
                      key={filter.name}
                      label={filter.label()}
                      className={menuItemClassName}
                      onClick={() => onPick(filter.name)}
                    >
                      {filter.label()}
                    </MenuPrimitive.Item>
                  ),
                )}
              </MenuPrimitive.List>
            </MenuPrimitive.Popup>
          </MenuPrimitive.Positioner>
        </MenuPrimitive.Portal>
      </MenuPrimitive.Root>
    </MenuPrimitive.FilterProvider>
  );
}

// A change from a press on the row, not on its checkbox and not from the keyboard: that one toggles and closes.
const isMenuRowPress = (event: Event | undefined) =>
  !!event &&
  !(event instanceof KeyboardEvent) &&
  !(event.target instanceof Element && event.target.closest("[data-slot=menu-item-checkbox]"));

/** One filter's values in a submenu, searchable like the menu itself. */
function FilterSubmenu({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <MenuPrimitive.FilterProvider>
      <MenuPrimitive.SubmenuRoot>
        <MenuPrimitive.SubmenuTrigger label={label} className={`${menuItemClassName} data-popup-open:bg-accent`}>
          <span className="flex-1 truncate">{label}</span>
          <ChevronRight className="size-4 text-muted-foreground rtl:rotate-180" />
        </MenuPrimitive.SubmenuTrigger>
        <MenuPrimitive.Portal>
          <MenuPrimitive.Positioner
            sideOffset={6}
            alignOffset={-5}
            className="isolate z-50 outline-none"
            data-base-ui-swipe-ignore=""
          >
            <MenuPrimitive.Popup className={`w-60 ${popupClassName}`}>
              <MenuPrimitive.Input
                aria-label={label}
                placeholder={m.table_filter_search()}
                className={searchClassName}
              />
              <MenuPrimitive.Empty className="px-3 py-2 text-sm text-muted-foreground">
                {m.no_items_found()}
              </MenuPrimitive.Empty>
              <MenuPrimitive.List className="max-h-72 overflow-y-auto p-1 outline-none">{children}</MenuPrimitive.List>
            </MenuPrimitive.Popup>
          </MenuPrimitive.Positioner>
        </MenuPrimitive.Portal>
      </MenuPrimitive.SubmenuRoot>
    </MenuPrimitive.FilterProvider>
  );
}

interface OptionItemsProps {
  filter: FilterDef;
  value: FilterValue | undefined;
  /** `close`: the pick was a row press (or a single pick), so the whole menu closes. */
  onChange: (value: FilterValue, close: boolean) => void;
}

/** A filter's options in its submenu: a checkbox per option, in front, as in the chip's editor. */
function OptionItems({ filter, value, onChange }: OptionItemsProps) {
  const multiple = filter.multiple !== false;
  const selected = [value ?? []].flat().filter((v) => v !== "");

  return filter.options?.().map((option) => (
    <MenuPrimitive.CheckboxItem
      key={option.value}
      label={option.label}
      checked={selected.includes(option.value)}
      closeOnClick={false}
      className={`${menuItemClassName} ${multiple ? "" : "pe-8"}`}
      onCheckedChange={(checked, details) => {
        const next = multiple
          ? checked
            ? [...selected, option.value]
            : selected.filter((v) => v !== option.value)
          : checked
            ? option.value
            : "";
        onChange(next, !multiple || isMenuRowPress(details.event));
      }}
    >
      {/* Several picks: a checkbox in front. One pick: a check mark at the end, as in the chip's list. */}
      {multiple && (
        <span data-slot="menu-item-checkbox" className="-m-1 shrink-0 p-1">
          <span className="flex size-4 items-center justify-center rounded-[4px] border border-input group-data-checked/menu-item:border-primary group-data-checked/menu-item:bg-primary group-data-checked/menu-item:text-primary-foreground">
            <MenuPrimitive.CheckboxItemIndicator>
              <Check className="size-3" />
            </MenuPrimitive.CheckboxItemIndicator>
          </span>
        </span>
      )}
      {option.icon}
      <span className="truncate">{option.label}</span>
      {!multiple && (
        <MenuPrimitive.CheckboxItemIndicator className="pointer-events-none absolute end-2 flex size-4 items-center justify-center">
          <Check className="size-4" />
        </MenuPrimitive.CheckboxItemIndicator>
      )}
    </MenuPrimitive.CheckboxItem>
  ));
}
