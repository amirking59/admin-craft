import { m } from "@/paraglide/messages.js";
import { Button } from "@/components/ui/button";
import { revalidateLogic } from "@tanstack/react-form";
import { z } from "zod";
import { Product } from "@/features/products/types";
import { useCategories, useCreateProduct, useUpdateProduct } from "@/features/products/services";
import { Edit, Plus } from "lucide-react";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/components/form/use-app-form";
import { applyApiFieldErrors } from "@/components/form/api-errors";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().min(0),
});

interface ProductFormProps {
  /** The product to edit; without it, a new one. */
  prevData?: Product;
  onClose?: () => void;
}

export const ProductForm = ({ prevData, onClose }: ProductFormProps) => {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const categories = useCategories();

  const defaultValues: z.infer<typeof formSchema> = {
    name: prevData?.name ?? "",
    description: prevData?.description ?? "",
    category: prevData?.category ?? "",
    price: prevData?.price ?? 0,
    stock: prevData?.stock ?? 0,
  };

  const form = useAppForm({
    defaultValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: formSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        if (prevData) {
          await updateMutation.mutateAsync({ productId: prevData.productId, ...value });
        } else {
          await createMutation.mutateAsync(value);
        }
        onClose?.();
      } catch (error) {
        // e.g. a taken name: the API's message shows under that field.
        applyApiFieldErrors(formApi, error);
      }
    },
  });

  return (
    <form.AppForm>
      <form.Form className="space-y-4">
        <DialogHeader>
          <DialogTitle>
            {prevData ? m.update_item({ item: m.products_product() }) : m.add_item({ item: m.products_product() })}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <form.AppField name="name">
              {(field) => <field.TextField label={m.products_name()} required />}
            </form.AppField>
          </div>
          <div className="col-span-2">
            <form.AppField name="description">
              {(field) => <field.TextareaField label={m.products_description()} required />}
            </form.AppField>
          </div>
          <div className="col-span-2">
            <form.AppField name="category">
              {(field) => (
                <field.SelectField
                  label={m.products_category()}
                  required
                  loading={categories.isPending}
                  items={(categories.data ?? []).map((category) => ({ value: category.slug, label: category.name }))}
                />
              )}
            </form.AppField>
          </div>
          <form.AppField name="price">
            {(field) => <field.NumberField thousandSeparator label={m.products_price()} required step={0.01} />}
          </form.AppField>
          <form.AppField name="stock">
            {(field) => <field.NumberField label={m.products_stock()} required step={1} />}
          </form.AppField>
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
