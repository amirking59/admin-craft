import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { useFormContext } from "react-hook-form";
import { cn } from "@/utils/cn";

interface OTPFieldProps {
  name?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  maxLength?: number;
  containerClassName?: string;
  otpClassName?: string;
  pattern?: string;
  groupSize?: number;
  showSeparator?: boolean;
  onComplete?: (value: string) => void;
}

export function OTPField({
  name = "",
  label,
  description,
  disabled = false,
  maxLength = 6,
  containerClassName,
  otpClassName,
  pattern,
  groupSize = 3,
  showSeparator = true,
  onComplete,
}: OTPFieldProps) {
  const { control } = useFormContext();

  const renderSlots = () => {
    const slots = [];
    const totalGroups = Math.ceil(maxLength / groupSize);

    for (let groupIndex = 0; groupIndex < totalGroups; groupIndex++) {
      const groupSlots = [];
      const startIndex = groupIndex * groupSize;
      const endIndex = Math.min(startIndex + groupSize, maxLength);

      for (let slotIndex = startIndex; slotIndex < endIndex; slotIndex++) {
        groupSlots.push(
          <InputOTPSlot
            key={slotIndex}
            index={slotIndex}
            className={cn("border-input", disabled && "opacity-50 cursor-not-allowed")}
          />,
        );
      }

      slots.push(<InputOTPGroup key={groupIndex}>{groupSlots}</InputOTPGroup>);

      // Add separator between groups (except for the last group)
      if (showSeparator && groupIndex < totalGroups - 1) {
        slots.push(<InputOTPSeparator key={`separator-${groupIndex}`} />);
      }
    }

    return slots;
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={containerClassName}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <InputOTP
              maxLength={maxLength}
              pattern={pattern}
              disabled={disabled}
              value={field.value || ""}
              onChange={(value) => {
                field.onChange(value);
                if (value.length === maxLength && onComplete) {
                  onComplete(value);
                }
              }}
              className={cn(otpClassName)}
            >
              {renderSlots()}
            </InputOTP>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
