import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { inputTriggerClassName } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

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
  if (mode === "single") {
    return (
      <Popover>
        <PopoverTrigger
          render={
            <Button
              disabled={disabled}
              variant={"outline"}
              aria-invalid={props["aria-invalid"]}
              className={cn(inputTriggerClassName, !value && "text-muted-foreground hover:text-muted-foreground")}
            />
          }
        >
          {value ? formatDate(value, false) : placeholder}
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <div className="sm:flex">
            <Calendar
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
        <PopoverTrigger
          render={
            <Button
              disabled={disabled}
              variant={"outline"}
              aria-invalid={props["aria-invalid"]}
              className={cn(inputTriggerClassName, !value && "text-muted-foreground hover:text-muted-foreground")}
            />
          }
        >
          {value?.from && value?.to
            ? `${formatDate(dayjs(value.from).toISOString(), false)} - ${formatDate(
                dayjs(value.to).toISOString(),
                false,
              )}`
            : placeholder}
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <div className="sm:flex">
            <Calendar
              mode="range"
              defaultMonth={from || undefined}
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
