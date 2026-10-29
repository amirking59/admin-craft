import { m } from "@/paraglide/messages.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { Check, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useTableContext } from "@/components/data-table/table-context";
import type { FilterDef, FilterOption, FilterValue } from "@/components/data-table/types";
import dayjs from "dayjs";
import { NumericFormat } from "react-number-format";
import {
  datePresets,
  dateRangePresets,
  filtersArrayToObject,
  isFilterValueEmpty,
  parseRange,
  toRange,
} from "@/components/data-table/utils";
import { TextField } from "@/components/form/text-field";
import { useAppForm } from "@/components/form/use-app-form";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Calendar } from "@/components/ui/calendar";
import { ComboboxItem, isRowPress } from "@/components/ui/combobox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatNumber } from "@/lib/utils";

/** A filter picked from a list of options, given up front or loaded from the server. */
type ListFilter = Extract<FilterDef, { type: "select" | "multiselect" }>;
const isListFilter = (filter: FilterDef): filter is ListFilter =>
  filter.type === "select" || filter.type === "multiselect";
/** A filter picked on a calendar. */
const isCalendarFilter = (filter: FilterDef) => filter.type === "date" || filter.type === "dateRange";

/** A range filter's value as it reads: "$100 – $500", "from $100", "to $500", and dates the same way. */
const formatRange = (filter: FilterDef, value: FilterValue) => {
  const format =
    filter.formatValue ??
    (filter.type === "dateRange"
      ? (end: FilterValue) => formatDate(String(end), false)
      : (end: FilterValue) => formatNumber(Number(end)));
  const [from, to] = parseRange(value);
  if (from && to) return `${format(from)} – ${format(to)}`;
  return from ? `${m.table_from()} ${format(from)}` : `${m.table_to()} ${format(to)}`;
};

/** `options`: a list filter's options, for its values' labels. */
const formatFilterValue = (filter: FilterDef, value: FilterValue, options: FilterOption[]) => {
  if (filter.type === "number" || filter.type === "dateRange") return formatRange(filter, value);
  if (filter.formatValue) return filter.formatValue(value);
  if (filter.type === "date") return formatDate(String(value), false);
  const labels = new Map(options.map((option) => [option.value, option.label]));
  return [value]
    .flat()
    .map((v) => labels.get(v) ?? v)
    .join(", ");
};

/** Where a list filter's options from `loadOptions` are cached, per table, by search. */
const optionsQueryKey = (tableId: string | undefined, name: string) => ["filter-options", tableId, name];

/**
 * A list filter's options for what's typed in its search line: `options()`, or what `loadOptions` returns for it
 * (after a pause) for a list kept on the server. `remote`: the server matched them to the search already, so the list
 * shows them as they are. Loads only while `enabled` (its list is open).
 */
function useFilterOptions(filter: ListFilter, search: string, enabled = true) {
  const { table } = useTableContext();
  const [debounced] = useDebounceValue(search.trim(), 300);
  const load = "loadOptions" in filter ? filter.loadOptions : null;
  const query = useQuery({
    queryKey: [...optionsQueryKey(table.options.meta?.id, filter.name), debounced],
    queryFn: () => load!(debounced),
    enabled: enabled && !!load,
    // Keep the last results while the next search loads, rather than an empty list.
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  if (!load) return { options: "options" in filter ? filter.options() : [], loading: false, remote: false };
  return { options: query.data ?? [], loading: query.isPending, remote: true };
}

/** The editor of a filter that's a field (text, number or custom), inside its form field. */
const fieldInput = (filter: FilterDef, value: FilterValue, onChange: (value: string) => void) => {
  if (filter.type === "text") return <TextField placeholder={filter.label()} clearable />;
  if (filter.type === "number") return <RangeInputs value={value} onChange={onChange} />;
  if (filter.type === "custom") return filter.input();
  return null;
};

// The URL holds strings while a field may hold a number (500 vs "500"), so compare as strings.
const asStrings = (value: unknown) => (Array.isArray(value) ? value.map(String) : String(value ?? ""));
const sameValue = (a: unknown, b: unknown) => JSON.stringify(asStrings(a)) === JSON.stringify(asStrings(b));

/**
 * The table's filters, read from and written to the URL through the table's column filters:
 * - pinned filters sit inline and apply as you type
 * - the rest show once set, each as a button group (the filter, and × to remove it); the filter button opens it
 *   alone in a popover
 * - "+ Filter" lists the unset ones, with a line to type into, so a long list stays easy to use; a text or number
 *   filter picked there shows its field in the menu, in place of the list, like Notion
 */
export function FilterBar() {
  const { table } = useTableContext();
  const filters = useMemo(() => table.options.meta?.filters ?? [], [table.options.meta?.filters]);

  const appliedKey = JSON.stringify(filtersArrayToObject(table.state.columnFilters));
  const applied = useMemo<Record<string, FilterValue>>(() => JSON.parse(appliedKey), [appliedKey]);

  // The filter whose chip editor is open, and the one whose editor is open *or still closing* (its chip stays until
  // the close animation ends, even with no value, and its draft is kept until then).
  const [editing, setEditing] = useState<string | null>(null);
  const [active, setActive] = useState<string | null>(null);
  // A text or number filter picked in "+ Filter", whose field shows in the menu. Its draft is kept until it closes.
  const [adding, setAdding] = useState<string | null>(null);
  const addingFilter = filters.find((filter) => filter.name === adding);
  // A date filter's "Custom…" dialog. The name stays after closing, so the title holds through the close animation.
  const [custom, setCustom] = useState<{ name: string; open: boolean } | null>(null);
  const customFilter = filters.find((filter) => filter.name === custom?.name);

  // A list filter's options, for its chip's labels: its own, or every one loaded from the server so far.
  const queryClient = useQueryClient();
  const optionsOf = (filter: FilterDef) => {
    if (!isListFilter(filter)) return [];
    if ("options" in filter) return filter.options();
    return queryClient
      .getQueriesData<FilterOption[]>({ queryKey: optionsQueryKey(table.options.meta?.id, filter.name) })
      .flatMap(([, options]) => options ?? []);
  };

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
  // has closed without applying, which drops its draft. The open editors keep their drafts.
  useEffect(() => {
    for (const filter of filters) {
      if (filter.name === active || filter.name === adding) continue;
      const value = applied[filter.name] ?? "";
      // A sync, not an edit: no listeners (they would re-apply), no validation, no touched state.
      if (!sameValue(form.getFieldValue(filter.name), value)) {
        form.setFieldValue(filter.name, value, { dontRunListeners: true, dontValidate: true, dontUpdateMeta: true });
      }
    }
  }, [applied, active, adding, filters, form]);

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

  // A field that applies as you type, after a pause: a pinned filter, or one being added in "+ Filter".
  const liveField = (filter: FilterDef) => (
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
      {(field) => fieldInput(filter, field.state.value, field.handleChange)}
    </form.AppField>
  );

  const pinned = filters.filter((filter) => filter.pinned);
  const chips = filters.filter((filter) => !filter.pinned && (filter.name in applied || filter.name === active));
  // In "+ Filter": a filter with options or dates always (its values can be picked there, like Linear); others
  // until set, or while being added there.
  const addable = filters.filter(
    (filter) =>
      !filter.pinned &&
      (isListFilter(filter) ||
        isCalendarFilter(filter) ||
        filter.name === adding ||
        (!(filter.name in applied) && filter.name !== active)),
  );

  return (
    <div className="mb-3 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">
      {pinned.map((filter) => (
        // As tall as the bar's small buttons (32px) rather than a form input (36px), so the row lines up.
        <div key={filter.name} className="md:w-64 [&_[data-slot=input-group]]:h-8">
          {liveField(filter)}
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
                bare={!isCalendarFilter(filter)}
                trigger={<Button variant="outline" size="sm" className="max-w-72 min-w-28 justify-start font-normal" />}
                triggerContent={
                  <>
                    <span className="text-muted-foreground">{value ? `${label}:` : label}</span>
                    {value && (
                      <span className="truncate font-medium">
                        {formatFilterValue(filter, value, optionsOf(filter))}
                      </span>
                    )}
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
                    onChangeDebounceMs: isListFilter(filter) || isCalendarFilter(filter) ? 0 : 300,
                  }}
                >
                  {(field) =>
                    isListFilter(filter) ? (
                      <FilterOptionsList
                        open={editing === filter.name}
                        filter={filter}
                        value={field.state.value}
                        onChange={(next, close) => {
                          field.handleChange(next);
                          if (close) setEditing(null);
                        }}
                      />
                    ) : isCalendarFilter(filter) ? (
                      <FilterCalendar
                        range={filter.type === "dateRange"}
                        value={field.state.value}
                        onChange={(next) => {
                          field.handleChange(next);
                          setEditing(null);
                        }}
                      />
                    ) : (
                      <FieldEditor label={label}>
                        {fieldInput(filter, field.state.value, field.handleChange)}
                      </FieldEditor>
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
            onPick={setAdding}
            editor={addingFilter && { label: addingFilter.label(), content: liveField(addingFilter) }}
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

      {/* A date's "Custom…": its value is picked here; the filter is added once a day (or range) is picked. */}
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
              range={customFilter?.type === "dateRange"}
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
  /**
   * The content is a FilterOptionsList or a FieldEditor: the popover is just that, and its first field takes focus.
   * Otherwise it's a calendar.
   */
  bare: boolean;
  trigger: React.ReactElement;
  triggerContent: React.ReactNode;
  children: React.ReactNode;
}

/** One filter's editor: a popover under its chip, on every screen size. */
function FilterEditor({
  open,
  onOpenChange,
  onOpenChangeComplete,
  bare,
  trigger,
  triggerContent,
  children,
}: FilterEditorProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  if (bare) {
    return (
      <Popover open={open} onOpenChange={onOpenChange} onOpenChangeComplete={onOpenChangeComplete}>
        <PopoverTrigger render={trigger}>{triggerContent}</PopoverTrigger>
        <PopoverContent
          ref={popupRef}
          // The first field takes focus, except when opened by touch: on a phone that would pop the keyboard up.
          initialFocus={(openType) => (openType === "touch" ? popupRef.current : true)}
          align="start"
          // A FieldEditor as wide as in "+ Filter", so it's the same popover there and here.
          className="w-64 gap-0 p-0 has-data-[slot=field-editor]:w-56"
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
        className="w-auto p-0"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}

interface FilterOptionsListProps {
  /** The surrounding editor's open state: closing it resets the search line. */
  open: boolean;
  filter: ListFilter;
  value: unknown;
  /** `close`: the pick was a press on a row, so the editor closes (see isRowPress). */
  onChange: (value: FilterValue, close: boolean) => void;
}

/**
 * A filter's options as Linear shows them: a search line, then one row per option with a checkbox. Picking applies
 * at once. With several picks, every pick toggles its option: from the checkbox (or the keyboard) the list stays for
 * more picks, from the rest of the row the editor closes. An inline combobox, so arrows, Enter and typing work.
 */
function FilterOptionsList({ open, filter, value, onChange }: FilterOptionsListProps) {
  const [search, setSearch] = useState("");
  const { options, loading, remote } = useFilterOptions(filter, search);
  const multiple = filter.type === "multiselect";
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
      // The server matched the options to the search already.
      filter={remote ? null : undefined}
      onInputValueChange={setSearch}
      autoHighlight
    >
      <ComboboxPrimitive.Input
        aria-label={filter.label()}
        placeholder={m.table_filter_search()}
        className="w-full border-b bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
      />
      <ComboboxPrimitive.Empty className="px-3 py-2 text-sm text-muted-foreground empty:hidden">
        {loading ? <LoadingRows /> : m.no_items_found()}
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

/** Placeholder rows while a list's options load from the server. */
const LoadingRows = () => (
  <div className="flex flex-col gap-1">
    {Array.from({ length: 4 }).map((_, index) => (
      <Skeleton key={index} className="h-6" />
    ))}
  </div>
);

/**
 * A date filter's editor: a calendar, which applies and closes like a single-pick list.
 * - one day: the day's start as an ISO string, as from DateField; picking the selected day again clears it
 * - `range`: the first click picks the first day and the second the last (the same day twice: just that day), as
 *   "from..to", the first day's start and the last day's end; until then it shows what's applied
 */
function FilterCalendar({
  range = false,
  value,
  onChange,
  className,
}: {
  range?: boolean;
  value: FilterValue;
  onChange: (value: string) => void;
  className?: string;
}) {
  // A range's first day, once clicked, until the second click ends it.
  const [start, setStart] = useState<Date>();

  if (range) {
    const [from, to] = parseRange(value);
    const applied = { from: from ? dayjs(from).toDate() : undefined, to: to ? dayjs(to).toDate() : undefined };
    const selected = start ? { from: start, to: start } : applied;

    return (
      <Calendar
        mode="range"
        className={className}
        defaultMonth={selected.from ?? selected.to}
        selected={selected}
        onSelect={(_, day) => {
          if (!start) return setStart(day);
          const [first, last] = day < start ? [day, start] : [start, day];
          setStart(undefined);
          onChange(toRange(dayjs(first).startOf("day").toISOString(), dayjs(last).endOf("day").toISOString()));
        }}
      />
    );
  }

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

/** A number filter's two ends, "from" and "to", either of which may be left empty. */
function RangeInputs({ value, onChange }: { value: FilterValue; onChange: (value: string) => void }) {
  const [from, to] = parseRange(value);
  const end = (current: string, placeholder: string, next: (typed: string) => string) => (
    <InputGroup>
      <NumericFormat
        customInput={InputGroupInput}
        aria-label={placeholder}
        placeholder={placeholder}
        thousandSeparator
        allowNegative={false}
        valueIsNumericString
        value={current}
        // Only typing: a new `value` from outside also calls this, and must not write itself back.
        onValueChange={(values, { source }) => source === "event" && onChange(next(values.value))}
      />
    </InputGroup>
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      {end(from, m.table_from(), (typed) => toRange(typed, to))}
      {end(to, m.table_to(), (typed) => toRange(from, typed))}
    </div>
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
  /** A filter without options was picked, so its `editor` shows; null: back to the list, or the menu closed. */
  onPick: (name: string | null) => void;
  /** The picked filter's editor, in place of the list. */
  editor?: { label: string; content: React.ReactNode };
  /** A filter's new value, picked in its submenu. */
  onChange: (name: string, value: FilterValue) => void;
  /** A date filter's "Custom…". */
  onCustom: (name: string) => void;
}

// Focuses the editor's first field once it mounts. Module-level, so a re-render doesn't pull focus back to it.
const focusFirstInput = (element: HTMLElement | null) => element?.querySelector("input")?.focus();

/**
 * A text or number filter's editor, the same in "+ Filter" and under its chip: the filter's name (with a way back to
 * the list, in "+ Filter"), then its field.
 */
function FieldEditor({ label, onBack, children }: { label: string; onBack?: () => void; children: React.ReactNode }) {
  return (
    <div data-slot="field-editor">
      <div className="flex h-9 items-center gap-1 border-b px-3 text-sm font-medium">
        {onBack && (
          <Button variant="ghost" size="icon-xs" className="-ms-2" aria-label={m.table_back()} onClick={onBack}>
            <ChevronLeft className="rtl:rotate-180" />
          </Button>
        )}
        {label}
      </div>
      <div className="p-2">{children}</div>
    </div>
  );
}

/**
 * "+ Filter", on Base UI's searchable Menu: type to narrow the filters. A filter with options opens its values in a
 * searchable submenu, like Linear, and Base UI handles the submenu (hover intent and the path to it, → or ← by text
 * direction, focus). A date filter offers "1 day ago" … "1 year ago" the same way, plus "Custom…" (a range, "Today",
 * "Last 7 days" …). Anything else
 * (text, a number) turns the menu into its editor, like Notion: a back button, then the field, applied as you type.
 */
function AddFilterMenu({ filters, values, onPick, editor, onChange, onCustom }: AddFilterMenuProps) {
  // Closed through Base UI, not a controlled `open`: closing that way from inside the submenu leaves the trigger
  // thinking the menu is still open, so its next press does nothing.
  const actions = useRef<MenuPrimitive.Root.Actions>(null);

  return (
    <MenuPrimitive.FilterProvider>
      {/* Back to the list once closed, so it opens on the list next time. */}
      <MenuPrimitive.Root actionsRef={actions} onOpenChangeComplete={(open) => !open && onPick(null)}>
        <MenuPrimitive.Trigger render={<Button variant="outline" size="sm" className="shrink-0 border-dashed" />}>
          <Plus />
          {m.table_filter()}
        </MenuPrimitive.Trigger>
        <MenuPrimitive.Portal>
          {/* Stays where it opened: a pick adds or widens a chip in front of the trigger, which would drag it along. */}
          <MenuPrimitive.Positioner
            align="start"
            sideOffset={4}
            disableAnchorTracking
            className="isolate z-50 outline-none"
            data-base-ui-swipe-ignore=""
          >
            <MenuPrimitive.Popup className={`w-56 ${popupClassName}`}>
              {editor ? (
                // Keys belong to the editor, not the menu (Home, End and the arrows would move through its list);
                // Escape still closes it.
                <div ref={focusFirstInput} onKeyDown={(event) => event.key !== "Escape" && event.stopPropagation()}>
                  <FieldEditor label={editor.label} onBack={() => onPick(null)}>
                    {editor.content}
                  </FieldEditor>
                </div>
              ) : (
                <>
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
                      isListFilter(filter) ? (
                        <OptionsSubmenu
                          key={filter.name}
                          filter={filter}
                          value={values[filter.name]}
                          onChange={(next, close) => {
                            onChange(filter.name, next);
                            if (close) actions.current?.close();
                          }}
                        />
                      ) : isCalendarFilter(filter) ? (
                        // A preset applies at once; "Custom…" opens a dialog to pick the date (or range).
                        <FilterSubmenu key={filter.name} label={filter.label()}>
                          {(filter.type === "dateRange" ? dateRangePresets() : datePresets()).map((preset) => (
                            <MenuPrimitive.Item
                              key={preset.value}
                              label={preset.label}
                              className={menuItemClassName}
                              onClick={() => onChange(filter.name, preset.value)}
                            >
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
                          closeOnClick={false}
                          className={menuItemClassName}
                          onClick={() => onPick(filter.name)}
                        >
                          {filter.label()}
                        </MenuPrimitive.Item>
                      ),
                    )}
                  </MenuPrimitive.List>
                </>
              )}
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

interface FilterSubmenuProps {
  label: string;
  onOpenChange?: (open: boolean) => void;
  /** The values come from the server, matched to what's typed: it reports the search instead of filtering. */
  onSearchChange?: (search: string) => void;
  /** The values are loading: placeholder rows instead of "No items found". */
  loading?: boolean;
  children: React.ReactNode;
}

/** One filter's values in a submenu, searchable like the menu itself. */
function FilterSubmenu({ label, onOpenChange, onSearchChange, loading, children }: FilterSubmenuProps) {
  return (
    <MenuPrimitive.FilterProvider
      filter={onSearchChange ? null : undefined}
      onValueChange={onSearchChange && ((search) => onSearchChange(search))}
    >
      <MenuPrimitive.SubmenuRoot onOpenChange={onOpenChange && ((open) => onOpenChange(open))}>
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
                {loading ? <LoadingRows /> : m.no_items_found()}
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
  filter: ListFilter;
  value: FilterValue | undefined;
  /** `close`: the pick was a row press (or a single pick), so the whole menu closes. */
  onChange: (value: FilterValue, close: boolean) => void;
}

/** A list filter's submenu in "+ Filter". Options from the server load while it's open, for what's typed. */
function OptionsSubmenu({ filter, value, onChange }: OptionItemsProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { options, loading, remote } = useFilterOptions(filter, search, open);

  return (
    <FilterSubmenu
      label={filter.label()}
      onOpenChange={setOpen}
      onSearchChange={remote ? setSearch : undefined}
      loading={loading}
    >
      <OptionItems filter={filter} options={options} value={value} onChange={onChange} />
    </FilterSubmenu>
  );
}

/** A filter's options in its submenu: a checkbox per option, in front, as in the chip's editor. */
function OptionItems({ filter, options, value, onChange }: OptionItemsProps & { options: FilterOption[] }) {
  const multiple = filter.type === "multiselect";
  const selected = [value ?? []].flat().filter((v) => v !== "");

  return options.map((option) => (
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
