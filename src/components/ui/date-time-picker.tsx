"use client";

import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";
import { Locale } from "react-day-picker";
import { formatDate } from "@/utils/date";

interface DateTimePickerProps {
  "value": string | null;
  "onChange": (date: string | null) => void;
  "disabled"?: boolean;
  "placeholder": string;
  "locale": Locale;
  "aria-invalid"?: boolean;
}

function DateTimePicker({ onChange, value, disabled, placeholder, locale, ...props }: DateTimePickerProps) {
  function handleTimeChange(type: "hour" | "minute", val: string) {
    const currentDate = value ? dayjs(value) : dayjs();

    if (type === "hour") {
      onChange(currentDate.hour(parseInt(val, 10)).toISOString());
    } else if (type === "minute") {
      onChange(currentDate.minute(parseInt(val, 10)).toISOString());
    }
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            aria-invalid={props["aria-invalid"]}
            disabled={disabled}
            variant="outline"
            className={cn(
              "flex w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none",
              "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
              "dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
              "h-8 data-[size=sm]:h-7",
              !value && "text-muted-foreground",
            )}
          />
        }
      >
        {value ? formatDate(value) : placeholder}
        <CalendarIcon className="pointer-events-none size-4 text-muted-foreground" />
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            locale={locale}
            mode="single"
            selected={value ? dayjs(value).toDate() : undefined}
            defaultMonth={value ? dayjs(value).toDate() : undefined}
            onSelect={(date) => onChange(date ? dayjs(date).toISOString() : null)}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <Button
                    type="button"
                    key={hour}
                    size="icon"
                    variant={value && dayjs(value).hour() === hour ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    type="button"
                    key={minute}
                    size="icon"
                    variant={value && dayjs(value).minute() === minute ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export { DateTimePicker };
