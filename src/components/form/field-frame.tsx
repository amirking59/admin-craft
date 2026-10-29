import { m } from "@/paraglide/messages.js";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { useFieldContext } from "@/components/form/form-context";

/** What every field takes besides its own props. */
export interface FieldFrameProps {
  label?: string;
  /** Marks the label as required. The form's schema still decides what's valid. */
  required?: boolean;
  /** Help text under the field. */
  description?: React.ReactNode;
}

/** The label's "required" mark: an asterisk to see, the word for a screen reader. */
export const RequiredMark = () => (
  <>
    <span aria-hidden className="-ms-1 text-destructive">
      *
    </span>
    <span className="sr-only">{m.required()}</span>
  </>
);

/** A field's label (with its required mark), then the control, its help text, and its error once touched. */
export function FieldFrame({
  label,
  required,
  description,
  children,
}: FieldFrameProps & { children: React.ReactNode }) {
  const field = useFieldContext<unknown>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field data-invalid={isInvalid}>
      {label && (
        <FieldLabel htmlFor={field.name}>
          {label}
          {required && <RequiredMark />}
        </FieldLabel>
      )}

      {children}

      {description && <FieldDescription>{description}</FieldDescription>}
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
