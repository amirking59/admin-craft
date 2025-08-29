"use client";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getFlightOrders } from "@/app/(main)/flight/orders/_services";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { formatNumber } from "@/utils/number";
import { FlightOrder } from "@/app/(main)/flight/orders/_types";
import { useTranslation } from "react-i18next";

export const FlightOrderTable = () => {
  const { t } = useTranslation("flight");

  const columns: ColumnDef<FlightOrder>[] = [
    {
      accessorKey: "orderId",
      header: t("orderId"),
      enableSorting: true,
      size: 100,
    },
    {
      accessorKey: "requestId",
      header: t("requestId"),
      size: 300,
    },
    {
      id: "customer",
      header: t("customer"),
      cell: ({ row }) => {
        const customer = row.original.customerInfo;
        return (
          <div className="flex items-center gap-2">
            <div>{customer ? `${customer.firstName} ${customer.lastName}` : "-"}</div>
          </div>
        );
      },
      meta: {
        tooltip: (context) => {
          const customer = context.row.original.customerInfo;
          return `${t("customerInfo")}: ${customer.firstName} ${customer.lastName} - ${t("email")}: ${customer.email} - ${t("phone")}: ${customer.phoneNumber}`;
        },
      },
    },
    {
      id: "route",
      header: t("route"),
      cell: ({ row }) => {
        return (
          <div dir="ltr" className="text-sm">
            <div className="font-medium flex gap-1 items-center">
              <div>{row.original.oCityName}</div>

              <div>→</div>

              <div> {row.original.dCityName}</div>
            </div>

            <div className="text-muted-foreground flex gap-1 items-center">
              <div>{row.original.firstOrigin}</div>

              <div>→</div>

              <div> {row.original.firstDestination}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "flightAggregatedState",
      header: t("status"),
      cell: ({ row }) => {
        const state = row.original.flightAggregatedState;
        return <Badge variant="secondary">{t(`flightOrderAggregatedState.${state}`)}</Badge>;
      },
    },
    {
      id: "price",
      header: t("totalPrice"),
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">
              {formatNumber(row.original.totalPrice, 2)} {row.original.currencyCode}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("basePrice")}: {formatNumber(row.original.productTotalBaseFare, 2)}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "departureDate",
      header: t("departure"),
      cell: ({ row }) => {
        return <div>{dayjs(row.original.departureDate).format("YYYY/MM/DD HH:mm")}</div>;
      },
      size: 150,
    },
    {
      accessorKey: "createDate",
      header: t("created"),
      cell: ({ row }) => {
        return <div>{dayjs(row.original.createDate).format("YYYY/MM/DD HH:mm")}</div>;
      },
      size: 150,
    },
    {
      id: "airline",
      header: t("airline"),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <div>
              <div className="font-medium">{row.original.airlineName}</div>
              <div className="text-xs text-muted-foreground">{row.original.airlineCode}</div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "flightTravelersCount",
      header: t("travelers"),
      size: 80,
    },
  ];

  return (
    <DataTable
      queryKey="orders"
      queryFn={getFlightOrders}
      columns={columns}
      filters={[]}
      initialSort={{
        desc: true,
        id: "id",
      }}
      rowHeight={65}
    />
  );
};
