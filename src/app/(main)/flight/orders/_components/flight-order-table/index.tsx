"use client";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { getFlightOrders } from "@/app/(main)/flight/orders/_services";
import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { convertCase } from "@/utils/string";
import { formatNumber } from "@/utils/number";
import { FlightOrder } from "@/app/(main)/flight/orders/_types";

const columns: ColumnDef<FlightOrder>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    enableSorting: true,
    size: 100,
  },
  {
    accessorKey: "requestId",
    header: "Request ID",
    size: 150,
  },
  {
    id: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.original.customerInfo;
      return (
        <div className="flex items-center gap-2">
          <div>{customer ? `${customer.firstName} ${customer.lastName}` : "-"}</div>
          <Info
            onClick={() => {
              if (customer) {
                toast(
                  `Customer: ${customer.firstName} ${customer.lastName}\nEmail: ${customer.email}\nPhone: ${customer.phoneNumber}`,
                );
              } else {
                toast("No customer information available");
              }
            }}
            className="h-4 w-4 text-muted-foreground cursor-pointer"
          />
        </div>
      );
    },
  },
  {
    id: "route",
    header: "Route",
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
  },
  {
    accessorKey: "aggregatedState",
    header: "Status",
    cell: ({ row }) => {
      return <Badge variant="secondary">{convertCase(row.original.aggregatedState, "title")}</Badge>;
    },
  },
  {
    id: "price",
    header: "Total Price",
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">
            {formatNumber(row.original.totalPrice, 2)} {row.original.currencyCode}
          </div>
          <div className="text-xs text-muted-foreground">
            Base: {formatNumber(row.original.productTotalBaseFare, 2)}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "departureDate",
    header: "Departure",
    cell: ({ row }) => {
      return <div>{dayjs(row.original.departureDate).format("YYYY/MM/DD HH:mm")}</div>;
    },
    size: 150,
  },
  {
    accessorKey: "createDate",
    header: "Created",
    cell: ({ row }) => {
      return <div>{dayjs(row.original.createDate).format("YYYY/MM/DD HH:mm")}</div>;
    },
    size: 150,
  },
  {
    id: "airline",
    header: "Airline",
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
    header: "Travelers",
    size: 80,
  },
];

export const FlightOrderTable = () => {
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
