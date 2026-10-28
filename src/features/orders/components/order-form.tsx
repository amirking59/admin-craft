import { m } from "@/paraglide/messages.js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { revalidateLogic } from "@tanstack/react-form";
import { z } from "zod";
import { Plus } from "lucide-react";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/components/form/use-app-form";
import { applyApiFieldErrors } from "@/components/form/api-errors";
import { OrderStatus, OrderTag, PaymentMethod } from "@/features/orders/types";
import { orderProducts, useCreateOrder } from "@/features/orders/services";
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

type OrderFormValues = z.infer<typeof formSchema>;

/** A new order. It also shows every form field in use: text, select (one and several), enum, number, dates, etc. */
export const OrderForm = ({ onClose }: { onClose?: () => void }) => {
  const createMutation = useCreateOrder();
  const [now] = useState(() => new Date().toISOString());

  const form = useAppForm({
    defaultValues: {
      customerName: "",
      customerEmail: "",
      product: "",
      quantity: 1,
      // Required, so there's no sensible default: empty until typed, and the schema says so on submit.
      total: undefined as unknown as number,
      status: OrderStatus.Pending,
      paymentMethod: PaymentMethod.Card,
      tags: [],
      createdAt: now,
      deliveryWindow: null,
      note: "",
      paid: false,
    } as OrderFormValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: formSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createMutation.mutateAsync(value);
        onClose?.();
      } catch (error) {
        applyApiFieldErrors(formApi, error);
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <DialogHeader>
        <DialogTitle>{m.add_item({ item: m.orders_order() })}</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.AppField name="customerName">
          {(field) => <field.TextField label={m.orders_customer_name()} />}
        </form.AppField>
        <form.AppField name="customerEmail">
          {(field) => <field.TextField type="email" dir="ltr" label={m.orders_customer_email()} />}
        </form.AppField>
        <div className="sm:col-span-2">
          <form.AppField name="product">
            {(field) => (
              <field.SelectField
                label={m.orders_product()}
                items={orderProducts.map((product) => ({ value: product, label: product }))}
                clearable
              />
            )}
          </form.AppField>
        </div>
        <form.AppField name="quantity">
          {(field) => <field.NumberField label={m.orders_quantity()} step={1} />}
        </form.AppField>
        <form.AppField name="total">
          {(field) => <field.NumberField thousandSeparator label={m.orders_total()} step={0.01} />}
        </form.AppField>
        <form.AppField name="status">
          {(field) => (
            <field.EnumField
              label={m.orders_status()}
              enumObject={OrderStatus}
              getItemLabel={(v) => statusLabel[v as OrderStatus]()}
            />
          )}
        </form.AppField>
        <form.AppField name="paymentMethod">
          {(field) => (
            <field.EnumField
              label={m.orders_payment()}
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
          {(field) => <field.DateTimeField label={m.orders_created_at()} />}
        </form.AppField>
        <form.AppField name="deliveryWindow">
          {(field) => <field.DateField mode="range" clearable label={m.orders_delivery_window()} />}
        </form.AppField>
        <div className="sm:col-span-2">
          <form.AppField name="note">{(field) => <field.TextareaField label={m.orders_note()} />}</form.AppField>
        </div>
        <form.AppField name="paid">{(field) => <field.CheckboxField label={m.orders_paid()} />}</form.AppField>
      </div>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>{m.cancel()}</DialogClose>
        <Button loading={createMutation.isPending} type="submit">
          <Plus />
          {m.add()}
        </Button>
      </DialogFooter>
    </form>
  );
};
