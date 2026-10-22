import { cloneElement, RefObject, useRef, useState } from "react";
import { z } from "zod";
import { revalidateLogic } from "@tanstack/react-form";
import { useOnClickOutside } from "usehooks-ts";
import { TextField } from "@/components/form/text-field";
import { useAppForm } from "@/components/form/use-app-form";
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

  const form = useAppForm({
    defaultValues: {
      value: defaultValue,
    },
    validationLogic: revalidateLogic(),
    validators: { onDynamic: formSchema },
    onSubmit: ({ value: { value } }) => {
      if (value !== defaultValue) {
        editableMeta?.onSubmit?.(value, cell.getContext());
      }

      setEditing(false);
    },
  });

  const onCancel = async () => {
    // handleSubmit reads values after async validation, so reset only once it settles.
    await form.handleSubmit();

    form.reset();
    setEditing(false);
  };

  const onEdit = () => {
    setEditing(true);
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
    <form
      className="flex w-fit items-center gap-2"
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.AppField name="value">
        {() =>
          cloneElement((editableMeta.input || <TextField />) as React.ReactElement<{ autoFocus: boolean }>, {
            autoFocus: true,
          })
        }
      </form.AppField>
    </form>
  );
}
