export interface GetCurrencyRatesParams {
  pagination: {
    take: number;
    skip: number;
  };
}

export interface GetCurrencyRatesResponse {
  meta: {
    code: string;
    errorMessage: string | null;
    errors: string | null;
  };
  data: CurrencyRate[];
  pagination: {
    total: number;
  };
}

export enum ProductType {
  InternationalFlight = "InternationalFlight",
  DomesticFlight = "DomesticFlight",
  Visa = "Visa",
  InternationalHotel = "InternationalHotel",
  Tour = "Tour",
}

export interface CurrencyRate {
  fromCurrency: string;
  toCurrency: string;
  currencyExchangeRate: number;
  usdExchangeRate: number;
  productType: ProductType;
  providerId: number | null;
  currencyRateId: number;
  isActive: boolean;
  providerName: string | null;
}

export interface CreateCurrencyRateParams {
  fromCurrency: string;
  toCurrency: string;
  currencyExchangeRate: number;
  usdExchangeRate: number;
  productType: ProductType;
  providerId?: number | null;
  isActive?: boolean;
  providerName?: string | null;
}

export interface UpdateCurrencyRateParams extends CreateCurrencyRateParams {
  currencyRateId: number;
}
