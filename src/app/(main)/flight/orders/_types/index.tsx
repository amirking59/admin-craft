export interface GetFlightOrdersParams {
  take: number;
  skip: number;
}

export interface GetFlightOrdersResponse {
  data: FlightOrder[];
  pagination: {
    total: number;
  };
}

export enum FlightType {
  OneWay = "OneWay",
  RoundTrip = "RoundTrip",
  MultiDestination = "MultiDestination",
}

export interface FlightOrder {
  total: number;
  orderId: number;
  requestId: string;
  resellerId: number;
  providerId: number;
  agencyId: number;
  airlineId: number;
  code: number;
  agencyName: string;
  resellerName: string;
  resellerNameTr: null;
  resellerNameAr: string;
  resellerNameEn: string;
  providerName: string;
  airlineCode: string;
  isCharter: false;
  hasRefundedTicket: false;
  isManual: false;
  isRefundable: true;
  isReserveLocked: false;
  isRoundTripPacked: false;
  isOnlineIssue: false;
  hasReIssuedItem: false;
  hasRefundedItem: false;
  notesCount: number;
  flightAggregatedState: FlightOrderAggregatedState;
  aggregatedState: FlightOrderAggregatedState;
  productTotalFare: number;
  productTotalBaseFare: number;
  productTotalCommission: number;
  productTotalMarkup: number;
  productTotalTax: number;
  productTotalProfit: number;
  currencyRate: number;
  currencyCode: string;
  priceInfo_TotalProductPrice: number;
  totalPrice: number;
  totalTaxAmount: number;
  totalDiscountAmount: number;
  discountPercent: number;
  issueDate: null;
  createDate: string;
  reserveDate: null;
  modificationDate: null;
  updatedDate: null;
  departureDate: string;
  cabinType: string;
  flightType: string;
  // productType: "InternationalFlight";
  offlinePayMethod: null;
  providerPnr: null;
  airlinePnr: null;
  description: string;
  createdBy: string;
  updatedBy: null;
  airlineName: string;
  arilineCode: string;
  pnrInfo_AirlinePnr: string;
  pnrInfo_ProviderPnr: string;
  // currencyInfo_CurrencyRate: string;
  // currencyInfo_CurrencyCode: string;
  // dateInfo_IssueDate: string;
  flightTravelersCount: string;
  paymentMethod: null;
  paymentProviderName: null;
  firstOrigin: string;
  oCityName: string;
  oCityNameAr: string;
  oCityNameTr: string;
  firstDestination: string;
  dCityName: string;
  dCityNameAr: string;
  dCityNameTr: string;
  firstDepartureDate: string;
  firstDepartureArrivalDate: string;
  firstFlightType: FlightType;
  channel: string;
  priceInfo_TotalDiscountOfCommissionAmount: number;
  priceInfo_TotalBusinessCommissionAmount: number;
  priceInfo_TotalCommissionAmount: number;
  priceInfo_TotalBaseFare: number;
  priceInfo_TotalExtraServicesAmount: number;
  customerInfo: {
    customerId: number;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export enum FlightOrderAggregatedState {
  Submit = "Submit",

  ReserveSucceed = "ReserveSucceed",
  ReserveInProgress = "ReserveInProgress",
  ReserveFail = "ReserveFail",
  RequestedForOfflinePayment = "RequestedForOfflinePayment",
  PaymentSucceed = "PaymentSucceed",
  PaymentInProgress = "PaymentInProgress",
  PaymentFail = "PaymentFail",
  PaymentAmountInvalid = "PaymentAmountInvalid",
  FinalizationSucceeded = "FinalizationSucceeded",
  IssueSucceed = "IssueSucceed",
  ManualOrderIssue = "ManualOrderIssue",
  IssueInProgress = "IssueInProgress",
  IssueFail = "IssueFail",
  IssueOfflineRequire = "IssueOfflineRequire",

  RefundSucceed = "RefundSucceed",
  RefundInProgress = "RefundInProgress",
  RefundFail = "RefundFail",
  ReIssueSucceed = "ReIssueSucceed",
  ReIssueInProgress = "ReIssueInProgress",
  ReIssueFail = "ReIssueFail",
  AdminOfflineIssue = "AdminOfflineIssue",
  BeforeReservePriceChange = "BeforeReservePriceChange",
}
