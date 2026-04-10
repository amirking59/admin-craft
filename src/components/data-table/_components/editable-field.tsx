import { zodResolver } from "@hookform/resolvers/zod";
import { cloneElement, RefObject, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { useOnClickOutside } from "usehooks-ts";
import { TextField } from "@/components/form/text-field";
import { cn } from "@/lib/utils";
import { Cell } from "@tanstack/react-table";

const formSchema = z.object({
  value: z.string().min(1, "").or(z.number()),
});

interface editableFieldProps<TData, TValue> {
  children?: React.ReactNode;
  cell: Cell<TData, TValue>;
}

export function EditableField<TData, TValue>({ children, cell }: editableFieldProps<TData, TValue>) {
  const formRef = useRef(null);
  const [editing, setEditing] = useState(false);

  const editableMeta = cell.column.columnDef.meta?.editable;

  const defaultValue = editableMeta?.getDefaultValue?.(cell.getContext()) || "";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: defaultValue,
    },
  });

  const onCancel = () => {
    form.handleSubmit(submitHandler)();

    form.setValue("value", defaultValue);
    setEditing(false);
  };

  const onEdit = () => {
    setEditing(true);
  };

  const submitHandler = ({ value }: z.infer<typeof formSchema>) => {
    if (value !== defaultValue) {
      editableMeta?.onSubmit?.(value, cell.getContext());
    }

    setEditing(false);
  };

  useOnClickOutside(formRef as unknown as RefObject<HTMLElement>, onCancel);

  if (!editableMeta) {
    return children;
  }

  if (!editing) {
    return (
      <div className={cn("", editableMeta.loading && "opacity-50")} onDoubleClick={onEdit}>
        {children}
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form
        className="flex gap-2 items-center w-fit"
        ref={formRef}
        onSubmit={form.handleSubmit(submitHandler, (errors) => console.error(errors))}
      >
        {cloneElement(
          (editableMeta.input || <TextField />) as React.ReactElement<{
            name: string;
            autoFocus: boolean;
            disabled: boolean;
          }>,
          {
            name: "value",
            autoFocus: true,
          },
        )}
      </form>
    </FormProvider>
  );
}
