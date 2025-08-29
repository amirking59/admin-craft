"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CurrencyRate, ProductType } from "@/app/(main)/currency/_types";
import { useCreateCurrencyRate, useUpdateCurrencyRate } from "@/app/(main)/currency/_services";
import { Edit, Plus } from "lucide-react";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TextField } from "@/components/form/text-field";
import { NumberField } from "@/components/form/number-field";
import { CheckboxField } from "@/components/form/checkbox-field";
import { DialogClose } from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  fromCurrency: z.string().min(1, "From currency is required"),
  toCurrency: z.string().min(1, "To currency is required"),
  currencyExchangeRate: z.number().positive("Exchange rate must be positive"),
  usdExchangeRate: z.number().positive("USD exchange rate must be positive"),
  productType: z.nativeEnum(ProductType),
  providerId: z.number().nullable(),
  isActive: z.boolean(),
  providerName: z.string().optional(),
});

interface CurrencyFormProps {
  prevData?: CurrencyRate;
  onClose?: () => void;
}

export const CurrencyForm = ({ prevData, onClose }: CurrencyFormProps) => {
  const { t } = useTranslation("currency");
  const createCurrencyRateMutation = useCreateCurrencyRate();
  const updateCurrencyRateMutation = useUpdateCurrencyRate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromCurrency: prevData?.fromCurrency || "",
      toCurrency: prevData?.toCurrency || "",
      currencyExchangeRate: prevData?.currencyExchangeRate || 0,
      usdExchangeRate: prevData?.usdExchangeRate || 0,
      productType: ProductType.InternationalFlight,
      providerId: prevData?.providerId || null,
      isActive: prevData?.isActive ?? true,
      providerName: prevData?.providerName || "",
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (prevData) {
      updateCurrencyRateMutation.mutate(
        {
          currencyRateId: prevData.currencyRateId,
          ...data,
        },
        {
          onSuccess: () => {
            onClose?.();
          },
        },
      );
    } else {
      createCurrencyRateMutation.mutate(
        {
          ...data,
        },
        {
          onSuccess: () => {
            onClose?.();
          },
        },
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle>{!!prevData ? t("editCurrencyRate") : t("createCurrencyRate")}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <TextField name="fromCurrency" label={t("fromCurrency")} placeholder={t("fromCurrencyPlaceholder")} />

          <TextField name="toCurrency" label={t("toCurrency")} placeholder={t("toCurrencyPlaceholder")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            name="currencyExchangeRate"
            label={t("currencyExchangeRate")}
            placeholder={t("currencyExchangeRatePlaceholder")}
            step={0.000001}
          />

          <NumberField
            name="usdExchangeRate"
            label={t("usdExchangeRate")}
            placeholder={t("usdExchangeRatePlaceholder")}
            step={0.000001}
          />
        </div>

        <NumberField name="providerId" label={t("providerId")} placeholder={t("providerIdPlaceholder")} />

        <TextField name="providerName" label={t("providerName")} placeholder={t("providerNamePlaceholder")} />

        <CheckboxField name="isActive" label={t("isActive")} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DialogClose>

          <Button loading={createCurrencyRateMutation.isPending || updateCurrencyRateMutation.isPending} type="submit">
            {prevData ? (
              <>
                <Edit />
                {t("editCurrencyRate")}
              </>
            ) : (
              <>
                <Plus />
                {t("createCurrencyRate")}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
