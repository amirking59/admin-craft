import { Button } from "@/components/ui/button";
import { revalidateLogic } from "@tanstack/react-form";
import { z } from "zod";
import { Product, ProductCategory } from "@/features/products/types";
import { useCreateProduct, useUpdateProduct } from "@/features/products/services";
import { Edit, Plus } from "lucide-react";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { useAppForm } from "@/components/form/use-app-form";

const formSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.nativeEnum(ProductCategory),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  isActive: z.boolean(),
});

interface ProductFormProps {
  prevData?: Product;
  onClose?: () => void;
}

export const ProductForm = ({ prevData, onClose }: ProductFormProps) => {
  const { t } = useTranslation("products");
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
    onSubmit: ({ value }) => {
      if (prevData) {
        updateMutation.mutate({ productId: prevData.productId, ...value }, { onSuccess: () => onClose?.() });
      } else {
        createMutation.mutate(value, { onSuccess: () => onClose?.() });
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
        <DialogTitle>
          {prevData
            ? t("updateItem", { item: t("product"), ns: "base" })
            : t("addItem", { item: t("product"), ns: "base" })}
        </DialogTitle>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <form.AppField name="name">{(field) => <field.TextField label={t("name")} />}</form.AppField>
        </div>
        <div className="col-span-2">
          <form.AppField name="description">{(field) => <field.TextField label={t("description")} />}</form.AppField>
        </div>
        <form.AppField name="category">
          {(field) => (
            <field.EnumField
              label={t("category")}
              enumObject={ProductCategory}
              getItemLabel={(v) => t(`productCategory.${v}`)}
            />
          )}
        </form.AppField>
        <form.AppField name="price">
          {(field) => <field.NumberField thousandSeparator label={t("price")} step={0.01} />}
        </form.AppField>

        <form.AppField name="stock">{(field) => <field.NumberField label={t("stock")} step={1} />}</form.AppField>
        <div className="flex items-end pb-2">
          <form.AppField name="isActive">{(field) => <field.CheckboxField label={t("isActive")} />}</form.AppField>
        </div>
      </div>

      <DialogFooter>
        <DialogClose render={<Button variant="outline" />}>{t("cancel", { ns: "base" })}</DialogClose>
        <Button loading={createMutation.isPending || updateMutation.isPending} type="submit">
          {prevData ? (
            <>
              <Edit />
              {t("update", { ns: "base" })}
            </>
          ) : (
            <>
              <Plus />
              {t("add", { ns: "base" })}
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};
