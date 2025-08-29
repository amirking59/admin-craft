import { FlightType, FlightOrderAggregatedState } from "@/app/(main)/flight/orders/_types";

export const flight = {
  // Navigation
  flight: "الطيران",
  orders: "الطلبات",

  // Main content
  title: "طلبات الطيران",

  // Table column headers
  orderId: "رقم الطلب",
  requestId: "رقم الطلب المرجعي",
  customer: "العميل",
  route: "المسار",
  status: "الحالة",
  totalPrice: "السعر الإجمالي",
  basePrice: "السعر الأساسي",
  departure: "المغادرة",
  created: "تاريخ الإنشاء",
  airline: "شركة الطيران",
  travelers: "المسافرون",

  // Customer info tooltips
  customerInfo: "معلومات العميل",
  noCustomerInfo: "لا توجد معلومات عن العميل",

  // Flight Type enum translations
  flightType: {
    [FlightType.OneWay]: "اتجاه واحد",
    [FlightType.RoundTrip]: "ذهاب وإياب",
    [FlightType.MultiDestination]: "متعدد الوجهات",
  },

  // Flight Order Aggregated State enum translations
  aggregatedState: {
    [FlightOrderAggregatedState.Submit]: "مرسل",
    [FlightOrderAggregatedState.ReserveSucceed]: "نجح الحجز",
    [FlightOrderAggregatedState.ReserveInProgress]: "الحجز قيد التنفيذ",
    [FlightOrderAggregatedState.ReserveFail]: "فشل الحجز",
    [FlightOrderAggregatedState.RequestedForOfflinePayment]: "مطلوب دفع غير متصل",
    [FlightOrderAggregatedState.PaymentSucceed]: "نجح الدفع",
    [FlightOrderAggregatedState.PaymentInProgress]: "الدفع قيد التنفيذ",
    [FlightOrderAggregatedState.PaymentFail]: "فشل الدفع",
    [FlightOrderAggregatedState.PaymentAmountInvalid]: "مبلغ الدفع غير صحيح",
    [FlightOrderAggregatedState.FinalizationSucceeded]: "نجحت العملية النهائية",
    [FlightOrderAggregatedState.IssueSucceed]: "نجح الإصدار",
    [FlightOrderAggregatedState.ManualOrderIssue]: "إصدار طلب يدوي",
    [FlightOrderAggregatedState.IssueInProgress]: "الإصدار قيد التنفيذ",
    [FlightOrderAggregatedState.IssueFail]: "فشل الإصدار",
    [FlightOrderAggregatedState.IssueOfflineRequire]: "يتطلب إصدار غير متصل",
    [FlightOrderAggregatedState.RefundSucceed]: "نجح الاسترداد",
    [FlightOrderAggregatedState.RefundInProgress]: "الاسترداد قيد التنفيذ",
    [FlightOrderAggregatedState.RefundFail]: "فشل الاسترداد",
    [FlightOrderAggregatedState.ReIssueSucceed]: "نجح إعادة الإصدار",
    [FlightOrderAggregatedState.ReIssueInProgress]: "إعادة الإصدار قيد التنفيذ",
    [FlightOrderAggregatedState.ReIssueFail]: "فشل إعادة الإصدار",
    [FlightOrderAggregatedState.AdminOfflineIssue]: "إصدار إداري غير متصل",
    [FlightOrderAggregatedState.BeforeReservePriceChange]: "قبل تغيير سعر الحجز",
  },

  // Additional terms
  priceBreakdown: "تفصيل السعر",
  baseFare: "التعرفة الأساسية",
  taxes: "الضرائب",
  commission: "العمولة",
  markup: "الهامش",
  totalFare: "إجمالي التعرفة",
  currencyCode: "رمز العملة",
  departureCity: "مدينة المغادرة",
  arrivalCity: "مدينة الوصول",
  flightNumber: "رقم الرحلة",
  cabinType: "نوع المقصورة",
  travelersCount: "عدد المسافرين",
  bookingDate: "تاريخ الحجز",
  issueDate: "تاريخ الإصدار",
  pnr: "رقم الحجز",
  airlinePnr: "رقم حجز شركة الطيران",
  providerPnr: "رقم حجز مقدم الخدمة",
  phone: "الهاتف",
  email: "البريد الإلكتروني",
};
