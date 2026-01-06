import { FlightOrder, GetFlightOrdersParams, GetFlightOrdersResponse } from "@/app/(main)/flight/orders/_types";
import { TableQueryFnResponse } from "@/components/data-table/_types";
import { baseApi } from "@/configs/axios";

export const getFlightOrders = async (params: GetFlightOrdersParams): TableQueryFnResponse<FlightOrder> => {
  const response = await baseApi.post<GetFlightOrdersResponse>("/orders/FlightOrder/GetAll", {
    take: params.take,
    skip: params.skip,
  });

  return {
    items: response.data.data,
    total: response.data.pagination.total,
  };
};
