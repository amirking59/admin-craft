import { FlightType, FlightOrderAggregatedState } from "@/app/(main)/flight/orders/_types";

export const flight = {
  // Navigation
  flight: "پرواز",
  orders: "سفارشات",

  // Main content
  title: "سفارشات پرواز",

  // Table column headers
  orderId: "شناسه سفارش",
  requestId: "شناسه درخواست",
  customer: "مشتری",
  route: "مسیر",
  status: "وضعیت",
  totalPrice: "قیمت کل",
  basePrice: "قیمت پایه",
  departure: "حرکت",
  created: "تاریخ ایجاد",
  airline: "شرکت هواپیمایی",
  travelers: "مسافران",

  // Customer info tooltips
  customerInfo: "اطلاعات مشتری",
  noCustomerInfo: "اطلاعات مشتری در دسترس نیست",

  // Flight Type enum translations
  flightType: {
    [FlightType.OneWay]: "یک طرفه",
    [FlightType.RoundTrip]: "رفت و برگشت",
    [FlightType.MultiDestination]: "چند مقصده",
  },

  // Flight Order Aggregated State enum translations
  aggregatedState: {
    [FlightOrderAggregatedState.Submit]: "ارسال شده",
    [FlightOrderAggregatedState.ReserveSucceed]: "رزرو موفق",
    [FlightOrderAggregatedState.ReserveInProgress]: "رزرو در حال انجام",
    [FlightOrderAggregatedState.ReserveFail]: "رزرو ناموفق",
    [FlightOrderAggregatedState.RequestedForOfflinePayment]: "درخواست پرداخت آفلاین",
    [FlightOrderAggregatedState.PaymentSucceed]: "پرداخت موفق",
    [FlightOrderAggregatedState.PaymentInProgress]: "پرداخت در حال انجام",
    [FlightOrderAggregatedState.PaymentFail]: "پرداخت ناموفق",
    [FlightOrderAggregatedState.PaymentAmountInvalid]: "مبلغ پرداخت نامعتبر",
    [FlightOrderAggregatedState.FinalizationSucceeded]: "نهایی‌سازی موفق",
    [FlightOrderAggregatedState.IssueSucceed]: "صدور موفق",
    [FlightOrderAggregatedState.ManualOrderIssue]: "صدور دستی سفارش",
    [FlightOrderAggregatedState.IssueInProgress]: "صدور در حال انجام",
    [FlightOrderAggregatedState.IssueFail]: "صدور ناموفق",
    [FlightOrderAggregatedState.IssueOfflineRequire]: "نیاز به صدور آفلاین",
    [FlightOrderAggregatedState.RefundSucceed]: "بازپرداخت موفق",
    [FlightOrderAggregatedState.RefundInProgress]: "بازپرداخت در حال انجام",
    [FlightOrderAggregatedState.RefundFail]: "بازپرداخت ناموفق",
    [FlightOrderAggregatedState.ReIssueSucceed]: "صدور مجدد موفق",
    [FlightOrderAggregatedState.ReIssueInProgress]: "صدور مجدد در حال انجام",
    [FlightOrderAggregatedState.ReIssueFail]: "صدور مجدد ناموفق",
    [FlightOrderAggregatedState.AdminOfflineIssue]: "صدور آفلاین توسط ادمین",
    [FlightOrderAggregatedState.BeforeReservePriceChange]: "قبل از تغییر قیمت رزرو",
  },

  // Additional terms
  priceBreakdown: "تفکیک قیمت",
  baseFare: "نرخ پایه",
  taxes: "مالیات‌ها",
  commission: "کمیسیون",
  markup: "سود",
  totalFare: "کل نرخ",
  currencyCode: "کد ارز",
  departureCity: "شهر مبدا",
  arrivalCity: "شهر مقصد",
  flightNumber: "شماره پرواز",
  cabinType: "نوع کابین",
  travelersCount: "تعداد مسافران",
  bookingDate: "تاریخ رزرو",
  issueDate: "تاریخ صدور",
  pnr: "شناسه رزرو",
  airlinePnr: "شناسه رزرو شرکت هواپیمایی",
  providerPnr: "شناسه رزرو ارائه‌دهنده",
};
