"use client";

import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Locale } from "react-day-picker";
import { formatDate } from "@/utils/date";

interface DatePickerProps {
  "value": string | null;
  "onChange": (date: string | null) => void;
  "disabled"?: boolean;
  "placeholder": string;
  "locale": Locale;
  "aria-invalid"?: boolean;
}

function DatePicker({ onChange, value, disabled, placeholder, locale, ...props }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            aria-invalid={props["aria-invalid"]}
            disabled={disabled}
            variant={"outline"}
            className={cn(
              "w-full h-auto justify-between bg-transparent dark:bg-input/30",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              "h-9 px-3 text-sm",
              !value && "hover:text-muted-foreground text-muted-foreground",
            )}
          />
        }
      >
        {value ? formatDate(value) : placeholder}
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          locale={locale}
          mode="single"
          selected={value ? dayjs(value).toDate() : undefined}
          defaultMonth={value ? dayjs(value).toDate() : undefined}
          onSelect={(date) => onChange(date ? dayjs(date).toISOString() : null)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
