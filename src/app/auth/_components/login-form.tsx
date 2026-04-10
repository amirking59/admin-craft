import { Button } from "@/components/ui/button";
import { TextField } from "@/components/form/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useLogin } from "@/app/auth/_services";

const formSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

export function LoginForm() {
  const { t } = useTranslation("auth");

  const loginMutation = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate(values);
  }

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit, (errors) => console.error(errors))}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("loginTitle")}</h1>
          <p className="text-muted-foreground text-sm text-balance">{t("loginDescription")}</p>
        </div>
        <div className="grid gap-6">
          <TextField label={t("email")} name="email" />

          <TextField type="password" label={t("password")} name="password" />

          <Button loading={loginMutation.isPending} type="submit" className="w-full">
            {t("login")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
