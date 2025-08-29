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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return useMutation({
    mutationFn: createCurrencyRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currency-rates"] });
      toast.success(t("createSuccess"));
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("somethingWentWrong"));
    },
  });
};

export const useUpdateCurrencyRate = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: updateCurrencyRate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currency-rates"] });
      toast.success(t("updateSuccess"));
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || t("somethingWentWrong"));
    },
  });
};
