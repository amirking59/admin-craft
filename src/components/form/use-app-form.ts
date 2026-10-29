import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "@/components/form/form-context";
import { TextField } from "@/components/form/text-field";
import { TextareaField } from "@/components/form/textarea-field";
import { NumberField } from "@/components/form/number-field";
import { SelectField } from "@/components/form/select-field";
import { EnumField } from "@/components/form/enum-field";
import { CheckboxField } from "@/components/form/checkbox-field";
import { DateField } from "@/components/form/date-field";
import { DateTimeField } from "@/components/form/date-time-field";
import { Form, SubmitButton } from "@/components/form/form";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    NumberField,
    SelectField,
    EnumField,
    CheckboxField,
    DateField,
    DateTimeField,
  },
  formComponents: { Form, SubmitButton },
});
