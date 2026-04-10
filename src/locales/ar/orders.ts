import { OrderStatus } from "@/app/(main)/orders/_types";

export const orders = {
  orders: "الطلبات",
  order: "طلب",
  orderId: "رقم الطلب",
  customer: "العميل",
  product: "المنتج",
  quantity: "الكمية",
  total: "الإجمالي",
  status: "الحالة",
  createdAt: "تاريخ الإنشاء",
  orderStatus: {
    [OrderStatus.Pending]: "في الانتظار",
    [OrderStatus.Processing]: "قيد المعالجة",
    [OrderStatus.Shipped]: "تم الشحن",
    [OrderStatus.Delivered]: "تم التسليم",
    [OrderStatus.Cancelled]: "ملغى",
  },
};
