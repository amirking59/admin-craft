import { m } from "@/paraglide/messages.js";
import { z } from "zod";
import { revalidateLogic } from "@tanstack/react-form";
import { useLogin } from "@/features/auth/services";
import { useAppForm } from "@/components/form/use-app-form";

const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export function LoginForm() {
  const loginMutation = useLogin();

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: formSchema },
    // Awaited, so the submit button stays busy until it's done. A failure is the API client's toast to tell.
    onSubmit: ({ value }) => loginMutation.mutateAsync(value).catch(() => {}),
  });

  return (
    <form.AppForm>
      <form.Form className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{m.auth_login_title()}</h1>
          <p className="text-sm text-balance text-muted-foreground">{m.auth_login_description()}</p>
        </div>
        <div className="grid gap-6">
          <form.AppField name="email">{(field) => <field.TextField label={m.auth_email()} />}</form.AppField>

          <form.AppField name="password">
            {(field) => <field.TextField type="password" label={m.auth_password()} />}
          </form.AppField>

          <form.SubmitButton className="w-full">{m.auth_login()}</form.SubmitButton>
        </div>
      </form.Form>
    </form.AppForm>
  );
}
