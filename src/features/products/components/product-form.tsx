import { m } from "@/paraglide/messages.js";
import { Button } from "@/components/ui/button";
import { revalidateLogic } from "@tanstack/react-form";
import { z } from "zod";
import { Product, ProductCategory } from "@/features/products/types";
import { useCreateProduct, useUpdateProduct } from "@/features/products/services";
import { Edit, Plus } from "lucide-react";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAppForm } from "@/components/form/use-app-form";
import { applyApiFieldErrors } from "@/components/form/api-errors";
import { categoryLabel } from "@/features/products/labels";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.enum(ProductCategory),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  isActive: z.boolean(),
});

interface ProductFormProps {
  /** The product to edit; without it, a new one. */
  prevData?: Product;
  onClose?: () => void;
}

export const ProductForm = ({ prevData, onClose }: ProductFormProps) => {
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const defaultValues: z.infer<typeof formSchema> = {
    name: prevData?.name ?? "",
    description: prevData?.description ?? "",
    category: prevData?.category ?? ProductCategory.Electronics,
    price: prevData?.price ?? 0,
    stock: prevData?.stock ?? 0,
    isActive: prevData?.isActive ?? true,
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
          <form.AppField name="category">
            {(field) => (
              <field.EnumField
                label={m.products_category()}
                required
                enumObject={ProductCategory}
                getItemLabel={(v) => categoryLabel[v as ProductCategory]()}
              />
            )}
          </form.AppField>
          <form.AppField name="price">
            {(field) => <field.NumberField thousandSeparator label={m.products_price()} required step={0.01} />}
          </form.AppField>

          <form.AppField name="stock">
            {(field) => <field.NumberField label={m.products_stock()} required step={1} />}
          </form.AppField>
          <div className="flex items-end pb-2">
            <form.AppField name="isActive">
              {(field) => <field.CheckboxField label={m.products_is_active()} />}
            </form.AppField>
          </div>
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
