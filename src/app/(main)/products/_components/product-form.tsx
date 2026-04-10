"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Product, ProductCategory } from "@/app/(main)/products/_types";
import { useCreateProduct, useUpdateProduct } from "@/app/(main)/products/_services";
import { Edit, Plus } from "lucide-react";
import { DialogClose, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { TextField } from "@/components/form/text-field";
import { NumberField } from "@/components/form/number-field";
import { EnumField } from "@/components/form/enum-field";
import { CheckboxField } from "@/components/form/checkbox-field";

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: prevData?.name ?? "",
      description: prevData?.description ?? "",
      category: prevData?.category ?? ProductCategory.Electronics,
      price: prevData?.price ?? 0,
      stock: prevData?.stock ?? 0,
      isActive: prevData?.isActive ?? true,
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (prevData) {
      updateMutation.mutate({ productId: prevData.productId, ...data }, { onSuccess: () => onClose?.() });
    } else {
      createMutation.mutate(data, { onSuccess: () => onClose?.() });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>
            {prevData
              ? t("updateItem", { item: t("product"), ns: "base" })
              : t("addItem", { item: t("product"), ns: "base" })}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <TextField name="name" label={t("name")} />
          </div>
          <div className="col-span-2">
            <TextField name="description" label={t("description")} />
          </div>
          <EnumField
            name="category"
            label={t("category")}
            enumObject={ProductCategory}
            getItemLabel={(v) => t(`productCategory.${v}`)}
          />
          <NumberField thousandSeparator name="price" label={t("price")} step={0.01} />
          <NumberField name="stock" label={t("stock")} step={1} />
          <div className="flex items-end pb-2">
            <CheckboxField name="isActive" label={t("isActive")} />
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
    </Form>
  );
};
