import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useFieldContext } from "@/components/form/form-context";

interface CheckboxFieldProps {
  label?: string;
  disabled?: boolean;
}

export function CheckboxField({ label, disabled }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field orientation="horizontal" data-invalid={isInvalid}>
      <Checkbox
        id={field.name}
        checked={field.state.value}
        onCheckedChange={field.handleChange}
        disabled={disabled}
        aria-invalid={isInvalid}
      />

      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
