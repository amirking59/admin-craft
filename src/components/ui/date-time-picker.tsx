import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { inputTriggerClassName } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  "value": string | null;
  "onChange": (date: string | null) => void;
  "disabled"?: boolean;
  "placeholder": string;
  "aria-invalid"?: boolean;
}

function DateTimePicker({ onChange, value, disabled, placeholder, ...props }: DateTimePickerProps) {
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
            variant={"outline"}
            className={cn(inputTriggerClassName, !value && "text-muted-foreground hover:text-muted-foreground")}
          />
        }
      >
        {value ? formatDate(value) : placeholder}
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={value ? dayjs(value).toDate() : undefined}
            defaultMonth={value ? dayjs(value).toDate() : undefined}
            onSelect={(date) => onChange(date ? dayjs(date).toISOString() : null)}
            autoFocus
          />
          <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <Button
                    type="button"
                    key={hour}
                    size="icon"
                    variant={value && dayjs(value).hour() === hour ? "default" : "ghost"}
                    className="aspect-square shrink-0 sm:w-full"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex p-2 sm:flex-col">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    type="button"
                    key={minute}
                    size="icon"
                    variant={value && dayjs(value).minute() === minute ? "default" : "ghost"}
                    className="aspect-square shrink-0 sm:w-full"
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
