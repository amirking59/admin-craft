import { FlightType, FlightOrderAggregatedState } from "@/app/(main)/flight/orders/_types";

export const flight = {
  // Navigation
  flight: "Flight",
  orders: "Orders",

  // Main content
  title: "Flight Orders",

  // Table column headers
  orderId: "Order ID",
  requestId: "Request ID",
  customer: "Customer",
  route: "Route",
  status: "Status",
  totalPrice: "Total Price",
  basePrice: "Base Price",
  departure: "Departure",
  created: "Created",
  airline: "Airline",
  travelers: "Travelers",

  // Customer info tooltips
  customerInfo: "Customer Information",
  noCustomerInfo: "No customer information available",

  // Flight Type enum translations
  flightType: {
    [FlightType.OneWay]: "One Way",
    [FlightType.RoundTrip]: "Round Trip",
    [FlightType.MultiDestination]: "Multi Destination",
  },

  // Flight Order Aggregated State enum translations
  aggregatedState: {
    [FlightOrderAggregatedState.Submit]: "Submitted",
    [FlightOrderAggregatedState.ReserveSucceed]: "Reserve Succeeded",
    [FlightOrderAggregatedState.ReserveInProgress]: "Reserve In Progress",
    [FlightOrderAggregatedState.ReserveFail]: "Reserve Failed",
    [FlightOrderAggregatedState.RequestedForOfflinePayment]: "Requested for Offline Payment",
    [FlightOrderAggregatedState.PaymentSucceed]: "Payment Succeeded",
    [FlightOrderAggregatedState.PaymentInProgress]: "Payment In Progress",
    [FlightOrderAggregatedState.PaymentFail]: "Payment Failed",
    [FlightOrderAggregatedState.PaymentAmountInvalid]: "Payment Amount Invalid",
    [FlightOrderAggregatedState.FinalizationSucceeded]: "Finalization Succeeded",
    [FlightOrderAggregatedState.IssueSucceed]: "Issue Succeeded",
    [FlightOrderAggregatedState.ManualOrderIssue]: "Manual Order Issue",
    [FlightOrderAggregatedState.IssueInProgress]: "Issue In Progress",
    [FlightOrderAggregatedState.IssueFail]: "Issue Failed",
    [FlightOrderAggregatedState.IssueOfflineRequire]: "Issue Offline Required",
    [FlightOrderAggregatedState.RefundSucceed]: "Refund Succeeded",
    [FlightOrderAggregatedState.RefundInProgress]: "Refund In Progress",
    [FlightOrderAggregatedState.RefundFail]: "Refund Failed",
    [FlightOrderAggregatedState.ReIssueSucceed]: "Re-issue Succeeded",
    [FlightOrderAggregatedState.ReIssueInProgress]: "Re-issue In Progress",
    [FlightOrderAggregatedState.ReIssueFail]: "Re-issue Failed",
    [FlightOrderAggregatedState.AdminOfflineIssue]: "Admin Offline Issue",
    [FlightOrderAggregatedState.BeforeReservePriceChange]: "Before Reserve Price Change",
  },

  // Additional terms
  priceBreakdown: "Price Breakdown",
  baseFare: "Base Fare",
  taxes: "Taxes",
  commission: "Commission",
  markup: "Markup",
  totalFare: "Total Fare",
  currencyCode: "Currency",
  departureCity: "Departure City",
  arrivalCity: "Arrival City",
  flightNumber: "Flight Number",
  cabinType: "Cabin Type",
  travelersCount: "Number of Travelers",
  bookingDate: "Booking Date",
  issueDate: "Issue Date",
  pnr: "PNR",
  airlinePnr: "Airline PNR",
  providerPnr: "Provider PNR",
};
