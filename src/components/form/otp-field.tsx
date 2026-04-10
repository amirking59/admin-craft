import { Controller, useFormContext } from "react-hook-form";
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";

interface OTPFieldProps {
  name?: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  maxLength?: number;
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
  pattern,
  groupSize = 3,
  showSeparator = true,
  onComplete,
}: OTPFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const renderSlots = () => {
          const slots = [];
          const totalGroups = Math.ceil(maxLength / groupSize);

          for (let groupIndex = 0; groupIndex < totalGroups; groupIndex++) {
            const groupSlots = [];
            const startIndex = groupIndex * groupSize;
            const endIndex = Math.min(startIndex + groupSize, maxLength);

            for (let slotIndex = startIndex; slotIndex < endIndex; slotIndex++) {
              groupSlots.push(<InputOTPSlot key={slotIndex} index={slotIndex} aria-invalid={fieldState.invalid} />);
            }

            slots.push(<InputOTPGroup key={groupIndex}>{groupSlots}</InputOTPGroup>);

            if (showSeparator && groupIndex < totalGroups - 1) {
              slots.push(<InputOTPSeparator key={`separator-${groupIndex}`} />);
            }
          }

          return slots;
        };

        return (
          <Field data-invalid={fieldState.invalid}>
            {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}
            <InputOTP
              id={field.name}
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
              onBlur={field.onBlur}
            >
              {renderSlots()}
            </InputOTP>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}
