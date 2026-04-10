"use client";

import dayjs from "dayjs";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { useLocale } from "@/hooks/use-locale";
import { enUS, faIR } from "react-day-picker/persian";
import { formatDate } from "@/utils/date";

interface BaseDatePickerProps {
  "disabled"?: boolean;
  "placeholder"?: string;
  "aria-invalid"?: boolean;
}

interface SingleDatePickerProps extends BaseDatePickerProps {
  mode?: "single";
  value: string | null;
  onChange: (date: string | null) => void;
}

interface RangeDatePickerProps extends BaseDatePickerProps {
  mode?: "range";
  value: {
    from: string | null;
    to: string | null;
  } | null;
  onChange: (
    range: {
      from: string | null;
      to: string | null;
    } | null,
  ) => void;
}

type DatePickerProps = SingleDatePickerProps | RangeDatePickerProps;

function DatePicker({ disabled, placeholder, mode, onChange, value, ...props }: DatePickerProps) {
  const [locale] = useLocale();

  if (mode === "single") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant={"outline"}
            aria-invalid={props["aria-invalid"]}
            className={cn(
              "w-full h-auto justify-between bg-transparent dark:bg-input/30",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              "h-9 px-3 text-sm",
              !value && "hover:text-muted-foreground text-muted-foreground",
            )}
          >
            {value ? formatDate(value, false) : placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <div className="sm:flex">
            <Calendar
              locale={locale === "fa" ? faIR : enUS}
              mode="single"
              defaultMonth={value ? dayjs(value).toDate() : undefined}
              autoFocus
              onSelect={(date) => onChange(date ? dayjs(date).toISOString() : null)}
              selected={value ? dayjs(value).toDate() : undefined}
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  } else if (mode === "range") {
    const from = value?.from ? dayjs(value.from).toDate() : undefined;
    const to = value?.to ? dayjs(value.to).toDate() : undefined;
    const selectedRange = from && to ? { from, to } : undefined;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant={"outline"}
            aria-invalid={props["aria-invalid"]}
            className={cn(
              "w-full h-auto justify-between bg-transparent dark:bg-input/30",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              "h-9 px-3 text-sm",
              !value && "hover:text-muted-foreground text-muted-foreground",
            )}
          >
            {value?.from && value?.to
              ? `${formatDate(dayjs(value.from).toISOString(), false)} - ${formatDate(
                  dayjs(value.to).toISOString(),
                  false,
                )}`
              : placeholder}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <div className="sm:flex">
            <Calendar
              locale={locale === "fa" ? faIR : enUS}
              mode="range"
              defaultMonth={from || new Date()}
              autoFocus
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  onChange({
                    from: dayjs(range.from).toISOString(),
                    to: dayjs(range.to).toISOString(),
                  });
                } else {
                  onChange(null);
                }
              }}
              selected={selectedRange}
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return null;
}

export { DatePicker, type DatePickerProps, type DateRange };
