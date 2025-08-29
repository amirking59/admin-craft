"use client";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getCurrencyRates } from "@/app/(main)/currency-rates/_services";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus } from "lucide-react";
import { formatNumber } from "@/utils/number";
import { CurrencyRate } from "@/app/(main)/currency-rates/_types";
import { useTranslation } from "react-i18next";
import { DialogButton } from "@/components/dialog-button";
import { CurrencyRateForm } from "@/app/(main)/currency-rates/_components/currency-rate-form";

export const CurrencyRateTable = () => {
  const { t } = useTranslation("currencyRate");

  const columns: ColumnDef<CurrencyRate>[] = [
    {
      accessorKey: "currencyRateId",
      header: t("currencyRateId"),
      enableSorting: true,
      size: 100,
    },
    {
      id: "currencyPair",
      header: t("currencyPair"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="outline">{row.original.fromCurrency}</Badge>
            <span>→</span>
            <Badge variant="outline">{row.original.toCurrency}</Badge>
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: "currencyExchangeRate",
      header: t("currencyExchangeRate"),
      cell: ({ row }) => {
        return <div>{formatNumber(row.original.currencyExchangeRate, 6)}</div>;
      },
      size: 150,
    },
    {
      accessorKey: "usdExchangeRate",
      header: t("usdExchangeRate"),
      cell: ({ row }) => {
        return <div>{formatNumber(row.original.usdExchangeRate, 6)}</div>;
      },
      size: 150,
    },
    {
      id: "provider",
      header: t("provider"),
      cell: ({ row }) => {
        const { providerName, providerId } = row.original;
        return (
          <div>
            {providerName ? (
              <div>
                <div className="font-medium">{providerName}</div>
                {providerId && <div className="text-xs text-muted-foreground">ID: {providerId}</div>}
              </div>
            ) : (
              <span className="text-muted-foreground">{t("noProvider")}</span>
            )}
          </div>
        );
      },
      size: 150,
    },
    {
      accessorKey: "isActive",
      header: t("status"),
      cell: ({ row }) => {
        return (
          <Badge variant={row.original.isActive ? "default" : "secondary"}>
            {row.original.isActive ? t("active") : t("inactive")}
          </Badge>
        );
      },
      size: 100,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const currencyRate = row.original;

        return (
          <div className="flex items-center gap-2">
            <DialogButton
              size="icon"
              variant="ghost"
              icon={Edit}
              content={<CurrencyRateForm prevData={currencyRate} />}
            />
          </div>
        );
      },
      size: 80,
    },
  ];

  return (
    <DataTable
      queryKey="currency-rates"
      queryFn={getCurrencyRates}
      columns={columns}
      filters={[]}
      title={t("currencyRates")}
      actions={[
        <DialogButton
          key="createCurrencyRate"
          variant="outline"
          icon={Plus}
          title={t("addItem", { item: t("currencyRate"), ns: "common" })}
          content={<CurrencyRateForm />}
        />,
      ]}
      initialSort={{
        desc: true,
        id: "currencyRateId",
      }}
      rowHeight={65}
    />
  );
};
