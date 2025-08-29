import {
  CurrencyRate,
  GetCurrencyRatesResponse,
  CreateCurrencyRateParams,
  UpdateCurrencyRateParams,
} from "@/app/(main)/currency/_types";
import { TableQueryFnResponse } from "@/components/data-table/_types";
import { baseApi } from "@/configs/axions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const getCurrencyRates = async (params: { take: number; skip: number }): TableQueryFnResponse<CurrencyRate> => {
  const response = await baseApi.post<GetCurrencyRatesResponse>("/flight-configuration/CurrencyRate/GetCurrencyRates", {
    pagination: {
      take: params.take,
      skip: params.skip,
    },
  });

  return {
    items: response.data.data,
    total: response.data.pagination.total,
  };
};

export const createCurrencyRate = async (data: CreateCurrencyRateParams): Promise<void> => {
  await baseApi.post("/flight-configuration/CurrencyRate/CreateCurrencyRate", data);
};

export const updateCurrencyRate = async (data: UpdateCurrencyRateParams): Promise<void> => {
  await baseApi.post("/flight-configuration/CurrencyRate/CreateCurrencyRate", data);
};

export const useCreateCurrencyRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCurrencyRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currency-rates"] });
      toast.success("Currency rate created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create currency rate");
    },
  });
};

export const useUpdateCurrencyRate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCurrencyRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currency-rates"] });
      toast.success("Currency rate updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update currency rate");
    },
  });
};
