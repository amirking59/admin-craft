"use client";

import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Locale } from "react-day-picker";
import { CalendarIcon } from "lucide-react";
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
            data-empty={!value}
            disabled={disabled}
            variant="outline"
            className={cn("w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground")}
          />
        }
      >
        {value ? formatDate(value) : <span>{placeholder}</span>}

        <CalendarIcon />
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar
          locale={locale}
          mode="single"
          selected={value ? dayjs(value).toDate() : undefined}
          defaultMonth={value ? dayjs(value).toDate() : undefined}
          onSelect={(date) => onChange(date ? dayjs(date).toISOString() : null)}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
