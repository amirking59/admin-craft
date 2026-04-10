import { DialogButton, DialogButtonProps } from "@/components/dialog-button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DetailsDialogButtonProps {
  items: (
    | {
        label: string;
        value: React.ReactNode;
      }
    | boolean
  )[];
  title: string;
  dialogButtonProps: Omit<DialogButtonProps, "content">;
}

const Content = ({ items, title }: DetailsDialogButtonProps) => {
  const renderDetail = (label: string, value: string | React.ReactNode, index: number) => (
    <div key={label + "-" + index} className="grid grid-cols-2 py-2 border-b border-border">
      <div className="text-sm font-medium">{label}</div>
      <div className="text-sm">{value}</div>
    </div>
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>

      <ScrollArea className="h-[500px] pr-4">
        {items.map((item, index) => {
          if (typeof item === "object") return renderDetail(item.label, item.value, index);
          return null;
        })}
      </ScrollArea>
    </>
  );
};

export const DetailsDialogButton = ({ items, title, dialogButtonProps }: DetailsDialogButtonProps) => {
  return (
    <DialogButton
      {...dialogButtonProps}
      content={<Content dialogButtonProps={dialogButtonProps} items={items} title={title} />}
    ></DialogButton>
  );
};
