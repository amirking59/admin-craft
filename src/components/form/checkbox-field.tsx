import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { useFieldContext } from "@/components/form/form-context";
import { RequiredMark, type FieldFrameProps } from "@/components/form/field-frame";

interface CheckboxFieldProps extends FieldFrameProps {
  disabled?: boolean;
}

/** A checkbox, then its label, with the help text and error under the label. */
export function CheckboxField({ label, required, description, disabled }: CheckboxFieldProps) {
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

      <FieldContent>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <RequiredMark />}
          </FieldLabel>
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldContent>
    </Field>
  );
}
