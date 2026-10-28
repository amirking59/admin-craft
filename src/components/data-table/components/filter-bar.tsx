import { m } from "@/paraglide/messages.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Plus, X } from "lucide-react";
import { useTableContext } from "@/components/data-table/table-context";
import type { FilterDef, FilterOption, FilterValue } from "@/components/data-table/types";
import { filtersArrayToObject, isFilterValueEmpty } from "@/components/data-table/utils";
import { useAppForm } from "@/components/form/use-app-form";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Combobox, ComboboxEmpty, ComboboxItem, ComboboxList, isRowPress } from "@/components/ui/combobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const formatFilterValue = (filter: FilterDef, value: FilterValue) => {
  if (filter.formatValue) return filter.formatValue(value);
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

  const remove = (name: string) => {
    form.setFieldValue(name, "");
    apply();
  };

  const pinned = filters.filter((filter) => filter.pinned);
  const chips = filters.filter((filter) => !filter.pinned && (filter.name in applied || filter.name === active));
  const addable = filters.filter((filter) => !filter.pinned && !(filter.name in applied) && filter.name !== active);

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
                title={label}
                list={!!filter.options}
                trigger={<Button variant="outline" size="sm" className="max-w-72 font-normal" />}
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
                    onChangeDebounceMs: filter.options ? 0 : 300,
                  }}
                >
                  {(field) =>
                    filter.options ? (
                      <FilterOptionsList
                        open={editing === filter.name}
                        placeholder={label}
                        options={filter.options()}
                        multiple={filter.multiple !== false}
                        value={field.state.value}
                        onChange={(next, close) => {
                          field.handleChange(next);
                          if (close) setEditing(null);
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
          />
        )}

        {Object.keys(applied).length > 0 && (
          <Button variant="ghost" size="sm" className="shrink-0" onClick={() => table.resetColumnFilters(true)}>
            {m.table_reset_filters()}
          </Button>
        )}
      </div>
    </div>
  );
}

interface FilterEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** After the open or close animation ends. */
  onOpenChangeComplete: (open: boolean) => void;
  title: string;
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
  title,
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
      <PopoverContent ref={popupRef} initialFocus={popupRef} align="start" className="flex w-72 flex-col gap-3">
        <p className="text-sm font-medium">{title}</p>
        {children}
      </PopoverContent>
    </Popover>
  );
}

interface FilterOptionsListProps {
  /** The surrounding editor's open state: closing it resets the search line. */
  open: boolean;
  placeholder: string;
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
function FilterOptionsList({ open, placeholder, options, multiple, value, onChange }: FilterOptionsListProps) {
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
        placeholder={placeholder}
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
 * "+ Filter": the filters not set yet, as a menu with a line on top to type into. A combobox rather than a menu,
 * because a menu can only jump by first letter, and typing part of a name is what keeps a long list quick.
 */
function AddFilterMenu({ filters, onPick }: { filters: FilterDef[]; onPick: (name: string) => void }) {
  const labels = new Map(filters.map((filter) => [filter.name, filter.label()]));

  return (
    <Combobox<string>
      items={filters.map((filter) => filter.name)}
      // An action list, not a choice: nothing stays selected.
      value={null}
      onValueChange={(name) => name && onPick(name)}
      itemToStringLabel={(name) => labels.get(name) ?? name}
      autoHighlight
    >
      <ComboboxPrimitive.Trigger render={<Button variant="outline" size="sm" className="shrink-0 border-dashed" />}>
        <Plus />
        {m.table_filter()}
      </ComboboxPrimitive.Trigger>
      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          align="start"
          sideOffset={4}
          className="isolate z-50"
          data-base-ui-swipe-ignore=""
        >
          <ComboboxPrimitive.Popup className="group/combobox-content w-56 origin-(--transform-origin) overflow-hidden rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
            <ComboboxPrimitive.Input
              placeholder={m.table_filter_by()}
              className="w-full border-b bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <ComboboxEmpty>{m.no_items_found()}</ComboboxEmpty>
            <ComboboxList>
              {(name: string) => (
                <ComboboxItem key={name} value={name}>
                  {labels.get(name)}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </Combobox>
  );
}
