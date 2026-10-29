import { m } from "@/paraglide/messages.js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { revalidateLogic } from "@tanstack/react-form";
import { z } from "zod";
import { Edit, Plus } from "lucide-react";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/components/form/use-app-form";
import { applyApiFieldErrors } from "@/components/form/api-errors";
import { Order, OrderStatus, OrderTag, PaymentMethod } from "@/features/orders/types";
import { orderProducts, useCreateOrder, useUpdateOrder } from "@/features/orders/services";
import { paymentMethodLabel, statusLabel, tagLabel } from "@/features/orders/labels";

const formSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.email(),
  product: z.string().min(1),
  quantity: z.number().int().min(1),
  total: z.number().positive(),
  status: z.enum(OrderStatus),
  paymentMethod: z.enum(PaymentMethod),
  tags: z.array(z.enum(OrderTag)),
  createdAt: z.string().min(1),
  deliveryWindow: z.object({ from: z.string().nullable(), to: z.string().nullable() }).nullable(),
  note: z.string(),
  paid: z.boolean(),
});

// What the form holds: the schema's values, with no total until one is typed (there's no sensible default).
type OrderFormValues = Omit<z.infer<typeof formSchema>, "total"> & { total?: number };

interface OrderFormProps {
  /** The order to edit; without it, a new one. */
  prevData?: Order;
  onClose?: () => void;
}

/** A new order, or an edit. It also shows every form field in use: text, select (one and several), enum, number, dates, etc. */
export const OrderForm = ({ prevData, onClose }: OrderFormProps) => {
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
  const [now] = useState(() => new Date().toISOString());

  const defaultValues: OrderFormValues = {
    customerName: prevData?.customerName ?? "",
    customerEmail: prevData?.customerEmail ?? "",
    product: prevData?.product ?? "",
    quantity: prevData?.quantity ?? 1,
    total: prevData?.total,
    status: prevData?.status ?? OrderStatus.Pending,
    paymentMethod: prevData?.paymentMethod ?? PaymentMethod.Card,
    tags: prevData?.tags ?? [],
    createdAt: prevData?.createdAt ?? now,
    deliveryWindow: prevData?.deliveryWindow ?? null,
    note: prevData?.note ?? "",
    paid: prevData?.paid ?? false,
  };

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: formSchema },
    onSubmit: async ({ value, formApi }) => {
      // Valid by now; parsing gives the schema's types (a total is there).
      const order = formSchema.parse(value);
      try {
        if (prevData) {
          await updateMutation.mutateAsync({ orderId: prevData.orderId, ...order });
        } else {
          await createMutation.mutateAsync(order);
        }
        onClose?.();
      } catch (error) {
        applyApiFieldErrors(formApi, error);
      }
    },
  });

  return (
    <form.AppForm>
      <form.Form className="space-y-4">
        <DialogHeader>
          <DialogTitle>
            {prevData ? m.update_item({ item: m.orders_order() }) : m.add_item({ item: m.orders_order() })}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <form.AppField name="customerName">
            {(field) => <field.TextField label={m.orders_customer_name()} required />}
          </form.AppField>
          <form.AppField name="customerEmail">
            {(field) => <field.TextField type="email" dir="ltr" label={m.orders_customer_email()} required />}
          </form.AppField>
          <div className="sm:col-span-2">
            <form.AppField name="product">
              {(field) => (
                <field.SelectField
                  label={m.orders_product()}
                  required
                  items={orderProducts.map((product) => ({ value: product, label: product }))}
                  clearable
                />
              )}
            </form.AppField>
          </div>
          <form.AppField name="quantity">
            {(field) => <field.NumberField label={m.orders_quantity()} required step={1} />}
          </form.AppField>
          <form.AppField name="total">
            {(field) => <field.NumberField thousandSeparator label={m.orders_total()} required step={0.01} />}
          </form.AppField>
          <form.AppField name="status">
            {(field) => (
              <field.EnumField
                label={m.orders_status()}
                required
                enumObject={OrderStatus}
                getItemLabel={(v) => statusLabel[v as OrderStatus]()}
              />
            )}
          </form.AppField>
          <form.AppField name="paymentMethod">
            {(field) => (
              <field.EnumField
                label={m.orders_payment()}
                required
                enumObject={PaymentMethod}
                getItemLabel={(v) => paymentMethodLabel[v as PaymentMethod]()}
              />
            )}
          </form.AppField>
          <div className="sm:col-span-2">
            <form.AppField name="tags">
              {(field) => (
                <field.SelectField
                  label={m.orders_tags()}
                  items={Object.values(OrderTag).map((tag) => ({ value: tag, label: tagLabel[tag]() }))}
                  multiple
                  clearable
                />
              )}
            </form.AppField>
          </div>
          <form.AppField name="createdAt">
            {(field) => <field.DateTimeField label={m.orders_created_at()} required />}
          </form.AppField>
          <form.AppField name="deliveryWindow">
            {(field) => <field.DateField mode="range" clearable label={m.orders_delivery_window()} />}
          </form.AppField>
          <div className="sm:col-span-2">
            <form.AppField name="note">
              {(field) => <field.TextareaField label={m.orders_note()} description={m.orders_note_description()} />}
            </form.AppField>
          </div>
          <form.AppField name="paid">{(field) => <field.CheckboxField label={m.orders_paid()} />}</form.AppField>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>{m.cancel()}</DialogClose>
          <form.SubmitButton>
            {prevData ? <Edit /> : <Plus />}
            {prevData ? m.update() : m.add()}
          </form.SubmitButton>
        </DialogFooter>
      </form.Form>
    </form.AppForm>
  );
};
