import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "@/components/form/form-context";

// The form owns these; use the field's validators/listeners instead of passing them.
type BoundTextareaProps = "value" | "defaultValue" | "onChange" | "onBlur" | "name" | "id";

interface TextareaFieldProps extends Omit<React.ComponentProps<"textarea">, BoundTextareaProps> {
  label?: string;
}

export function TextareaField({ label, ...props }: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

      <Textarea
        {...props}
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
      />

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
