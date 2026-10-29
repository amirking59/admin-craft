import { createContext, useContext, useEffect, useRef } from "react";
import { useSelector } from "@tanstack/react-form";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useFormContext } from "@/components/form/form-context";

/**
 * Lets a form tell what it's in (a DialogButton's dialog) whether it has unsaved changes, so closing can ask first.
 */
export const UnsavedChangesContext = createContext<((unsaved: boolean) => void) | null>(null);

/**
 * The form element, inside `form.AppForm`: submitting (Enter too) runs the form's validation and `onSubmit`, then
 * focuses the first field with an error, including the API's. Reports unsaved changes to UnsavedChangesContext.
 */
export function Form({ className, children }: { className?: string; children: React.ReactNode }) {
  const form = useFormContext();
  const ref = useRef<HTMLFormElement>(null);
  const unsaved = useSelector(form.store, (state) => !state.isDefaultValue);
  const setUnsaved = useContext(UnsavedChangesContext);

  useEffect(() => {
    setUnsaved?.(unsaved);
    return () => setUnsaved?.(false);
  }, [unsaved, setUnsaved]);

  return (
    <form
      ref={ref}
      // The schema validates, not the browser.
      noValidate
      className={className}
      onSubmit={async (event) => {
        event.preventDefault();
        await form.handleSubmit();
        // A task later, once the errors have rendered.
        setTimeout(() => ref.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      }}
    >
      {children}
    </form>
  );
}

/** The form's submit button, busy while it submits. */
export function SubmitButton(props: Omit<ButtonProps, "type" | "loading">) {
  const form = useFormContext();
  const isSubmitting = useSelector(form.store, (state) => state.isSubmitting);

  return <Button {...props} type="submit" loading={isSubmitting} />;
}
