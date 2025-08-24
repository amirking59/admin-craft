import { Button } from "@/components/ui/button";
import { TextField } from "@/components/form/text-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useTranslation } from "react-i18next";
import { useLogin } from "@/app/auth/_services";
import { OTPField } from "@/components/form/otp-field";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const formSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
  googleAuthCode: z.string().length(6),
});

export function LoginForm() {
  const { t } = useTranslation("auth");

  const loginMutation = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      googleAuthCode: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit, (errors) => console.error(errors))}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">{t("loginTitle")}</h1>
          <p className="text-muted-foreground text-sm text-balance">{t("loginDescription")}</p>
        </div>
        <div className="grid gap-6">
          <TextField label={t("email")} name="email" />

          <TextField type="password" label={t("password")} name="password" />

          <OTPField
            pattern={REGEXP_ONLY_DIGITS}
            groupSize={6}
            maxLength={6}
            label={t("googleAuthCode")}
            name="googleAuthCode"
          />

          <Button loading={loginMutation.isPending} type="submit" className="w-full">
            {t("login")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
