import { Textarea } from "@/components/ui/textarea";
import { useFieldContext } from "@/components/form/form-context";
import { FieldFrame, type FieldFrameProps } from "@/components/form/field-frame";

// The form owns these; use the field's validators/listeners instead of passing them. `required` marks the label.
type BoundTextareaProps = "value" | "defaultValue" | "onChange" | "onBlur" | "name" | "id" | "required";

interface TextareaFieldProps extends Omit<React.ComponentProps<"textarea">, BoundTextareaProps>, FieldFrameProps {}

export function TextareaField({ label, required, description, ...props }: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FieldFrame label={label} required={required} description={description}>
      <Textarea
        {...props}
        id={field.name}
        name={field.name}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
      />
    </FieldFrame>
  );
}
