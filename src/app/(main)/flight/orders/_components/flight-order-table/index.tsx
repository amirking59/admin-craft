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
      meta: {
        label: "Order ID",
      },
    },
    {
      accessorKey: "requestId",
      header: t("requestId"),
      size: 300,
      meta: {
        label: "Request ID",
      },
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
        label: "Customer",
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
          <div className="text-sm">
            <div className="font-medium">
              {row.original.oCityName} → {row.original.dCityName}
            </div>
            <div className="text-muted-foreground">
              {row.original.firstOrigin} → {row.original.firstDestination}
            </div>
          </div>
        );
      },
      meta: {
        label: "Route",
        tooltip: "Flight route showing departure and arrival cities",
      },
    },
    {
      accessorKey: "aggregatedState",
      header: t("status"),
      cell: ({ row }) => {
        const state = row.original.aggregatedState;
        return <Badge variant="secondary">{t(`aggregatedState.${state}`)}</Badge>;
      },
      meta: {
        label: "Status",
        tooltip: "Current order status",
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
      meta: {
        label: "Total Price",
        tooltip: "Total price including base fare and additional charges",
      },
    },
    {
      accessorKey: "departureDate",
      header: t("departure"),
      cell: ({ row }) => {
        return <div>{dayjs(row.original.departureDate).format("YYYY/MM/DD HH:mm")}</div>;
      },
      size: 150,
      meta: {
        label: "Departure",
      },
    },
    {
      accessorKey: "createDate",
      header: t("created"),
      cell: ({ row }) => {
        return <div>{dayjs(row.original.createDate).format("YYYY/MM/DD HH:mm")}</div>;
      },
      size: 150,
      meta: {
        label: "Created",
      },
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
      meta: {
        label: "Airline",
        tooltip: "Airline name and code",
      },
    },
    {
      accessorKey: "flightTravelersCount",
      header: t("travelers"),
      size: 80,
      meta: {
        label: "Travelers",
      },
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
