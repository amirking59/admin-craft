import { m } from "@/paraglide/messages.js";
import { useState } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";
import { Edit, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FieldFrame } from "@/components/form/field-frame";
import { useAppForm } from "@/components/form/use-app-form";
import { applyApiFieldErrors } from "@/components/form/api-errors";
import { formatNumber } from "@/lib/utils";
import { Order, OrderItem } from "@/features/orders/types";
import { searchCustomers, useCreateOrder, useUpdateOrder } from "@/features/orders/services";
import { searchProducts } from "@/features/products/services";

const formSchema = z.object({
  customerId: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.number(),
        title: z.string(),
        thumbnail: z.string(),
        price: z.number(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
});

/** What's typed in a search box, after a pause, and what the server has for it. */
function useSearch<T>(key: string, search: (query: string) => Promise<T[]>) {
  const [query, setQuery] = useState("");
  const [debounced] = useDebounceValue(query.trim(), 300);
  const results = useQuery({
    queryKey: [key, debounced],
    queryFn: () => search(debounced),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
  return { setQuery, results: results.data ?? [], loading: results.isPending };
}

/** A search box for products; picking one hands it over and clears the box, ready for the next. */
function ProductPicker({ onPick }: { onPick: (item: Omit<OrderItem, "quantity">) => void }) {
  const [inputValue, setInputValue] = useState("");
  const { setQuery, results, loading } = useSearch("product-options", searchProducts);
  const byId = new Map(results.map((product) => [product.id, product]));

  return (
    <Combobox<number>
      items={results.map((product) => product.id)}
      value={null}
      inputValue={inputValue}
      onInputValueChange={(value) => {
        setInputValue(value);
        setQuery(value);
      }}
      onValueChange={(id) => {
        const product = id === null ? undefined : byId.get(id);
        if (product)
          onPick({ productId: product.id, title: product.title, thumbnail: product.thumbnail, price: product.price });
        setInputValue("");
      }}
      itemToStringLabel={(id) => byId.get(id)?.title ?? ""}
      // The server matched them to the search already.
      filter={null}
      autoHighlight
    >
      <ComboboxInput placeholder={m.orders_add_product()} aria-label={m.orders_add_product()} className="w-full" />
      <ComboboxContent>
        <ComboboxEmpty>{loading ? null : m.no_items_found()}</ComboboxEmpty>
        <ComboboxList>
          {(id: number) => (
            <ComboboxItem key={id} value={id}>
              <img src={byId.get(id)?.thumbnail} alt="" className="size-6 rounded bg-muted object-cover" />
              <span className="flex-1 truncate">{byId.get(id)?.title}</span>
              <span className="text-muted-foreground">${formatNumber(byId.get(id)?.price ?? 0, 2)}</span>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

interface OrderFormProps {
  /** The order to edit; without it, a new one. */
  prevData?: Order;
  onClose?: () => void;
}

/** A new order, or an edit: its customer, then its products with how many of each. */
export const OrderForm = ({ prevData, onClose }: OrderFormProps) => {
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
  const customers = useSearch("customer-options", searchCustomers);

  const defaultValues: z.infer<typeof formSchema> = {
    customerId: prevData ? String(prevData.customerId) : "",
    items: prevData?.items ?? [],
  };

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: formSchema },
    onSubmit: async ({ value, formApi }) => {
      const order = { customerId: Number(value.customerId), items: value.items };
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

  // The order's customer stays among the options, so its name shows before (or without) a search.
  const customerItems = [
    ...(prevData ? [{ value: String(prevData.customerId), label: prevData.customerName }] : []),
    ...customers.results.filter((option) => option.value !== String(prevData?.customerId)),
  ];

  return (
    <form.AppForm>
      <form.Form className="space-y-4">
        <DialogHeader>
          <DialogTitle>
            {prevData ? m.update_item({ item: m.orders_order() }) : m.add_item({ item: m.orders_order() })}
          </DialogTitle>
        </DialogHeader>

        <form.AppField name="customerId">
          {(field) => (
            <field.SelectField
              label={m.orders_customer()}
              required
              items={customerItems}
              loading={customers.loading}
              serverSearch
              onSearchChange={customers.setQuery}
              // DummyJSON can't move a cart to another customer.
              disabled={!!prevData}
            />
          )}
        </form.AppField>

        <form.AppField name="items" mode="array">
          {(field) => (
            <FieldFrame label={m.orders_products()} required>
              <ProductPicker
                onPick={(product) => {
                  // Picking one that's there already adds one more of it.
                  const index = field.state.value.findIndex((item) => item.productId === product.productId);
                  if (index === -1) field.pushValue({ ...product, quantity: 1 });
                  else
                    field.replaceValue(index, {
                      ...field.state.value[index],
                      quantity: field.state.value[index].quantity + 1,
                    });
                }}
              />

              <ul className="divide-y rounded-md border empty:hidden">
                {field.state.value.map((item, index) => (
                  <li key={item.productId} className="flex items-center gap-3 p-2">
                    <img src={item.thumbnail} alt="" className="size-9 rounded bg-muted object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground">${formatNumber(item.price, 2)}</div>
                    </div>
                    <div className="w-20">
                      <form.AppField name={`items[${index}].quantity`}>
                        {(quantity) => <quantity.NumberField aria-label={m.orders_quantity()} step={1} />}
                      </form.AppField>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={m.remove_x({ x: item.title })}
                      onClick={() => field.removeValue(index)}
                    >
                      <X />
                    </Button>
                  </li>
                ))}
              </ul>
            </FieldFrame>
          )}
        </form.AppField>

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
