"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CurrencyRate, ProductType } from "@/app/(main)/currency-rates/_types";
import { useCreateCurrencyRate, useUpdateCurrencyRate } from "@/app/(main)/currency-rates/_services";
import { Edit, Plus } from "lucide-react";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TextField } from "@/components/form/text-field";
import { NumberField } from "@/components/form/number-field";
import { DialogClose } from "@radix-ui/react-dialog";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  fromCurrency: z.string().min(1, "From currency is required"),
  toCurrency: z.string().min(1, "To currency is required"),
  currencyExchangeRate: z.number().positive("Exchange rate must be positive"),
  usdExchangeRate: z.number().positive("USD exchange rate must be positive"),
  productType: z.nativeEnum(ProductType),
  providerId: z.number().nullable(),
  providerName: z.string().optional(),
});

interface CurrencyRateFormProps {
  prevData?: CurrencyRate;
  onClose?: () => void;
}

export const CurrencyRateForm = ({ prevData, onClose }: CurrencyRateFormProps) => {
  const { t } = useTranslation("currencyRate");
  const createCurrencyRateMutation = useCreateCurrencyRate();
  const updateCurrencyRateMutation = useUpdateCurrencyRate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromCurrency: prevData?.fromCurrency || "",
      toCurrency: prevData?.toCurrency || "",
      currencyExchangeRate: prevData?.currencyExchangeRate || 0,
      usdExchangeRate: prevData?.usdExchangeRate || 0,
      productType: prevData?.productType || ProductType.InternationalFlight,
      providerId: prevData?.providerId || null,
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
          <DialogTitle>
            {!!prevData
              ? t("updateItem", { item: t("currency"), ns: "common" })
              : t("addItem", { item: t("currency"), ns: "common" })}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <TextField name="fromCurrency" label={t("fromCurrency")} />

          <TextField name="toCurrency" label={t("toCurrency")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberField
            thousandSeparator
            name="currencyExchangeRate"
            label={t("currencyExchangeRate")}
            step={0.000001}
          />

          <NumberField thousandSeparator name="usdExchangeRate" label={t("usdExchangeRate")} step={0.000001} />
        </div>

        <NumberField name="providerId" label={t("providerId")} />

        <TextField name="providerName" label={t("providerName")} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("cancel", { ns: "common" })}</Button>
          </DialogClose>

          <Button loading={createCurrencyRateMutation.isPending || updateCurrencyRateMutation.isPending} type="submit">
            {prevData ? (
              <>
                <Edit />
                {t("update", { ns: "common" })}
              </>
            ) : (
              <>
                <Plus />
                {t("add", { ns: "common" })}
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
