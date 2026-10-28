import type { AnyFormApi } from "@tanstack/react-form";
import { ApiError } from "@/configs/api";

/**
 * Shows the API's per-field messages (an error body with `errors: { field: message }`) under the form's fields.
 * Call it from `onSubmit` when the request fails; anything that isn't an ApiError with field errors is ignored.
 */
export function applyApiFieldErrors(form: AnyFormApi, error: unknown) {
  if (!(error instanceof ApiError) || !error.fieldErrors) return;

  for (const [name, message] of Object.entries(error.fieldErrors)) {
    form.setFieldMeta(name, (meta) => ({ ...meta, errorMap: { ...meta.errorMap, onSubmit: { message } } }));
  }
}
