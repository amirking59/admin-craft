import React, { ReactElement, ReactNode, useState } from "react";
import { ButtonProps, Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

export interface DialogButtonProps extends Omit<ButtonProps, "onClick" | "content"> {
  title?: string;
  icon?: LucideIcon;
  content: ReactElement & { props: { onClose?: (value: boolean) => void } };
  onOpenChange?: (open: boolean) => void;
  customTrigger?: ReactNode;
  dialogClassName?: string;
}

export const DialogButton = ({
  title,
  icon: Icon,
  content,
  variant = "default",
  size = "default",
  className,
  disabled,
  loading,
  onOpenChange,
  customTrigger,
  dialogClassName,
  ...rest
}: DialogButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {customTrigger || (
          <Button variant={variant} size={size} className={className} disabled={disabled} loading={loading} {...rest}>
            {Icon && <Icon className="size-4" />}
            {title}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className={cn("sm:max-w-[512px]", dialogClassName)}>
        {React.cloneElement(content, { onClose: () => setOpen(false) })}
      </DialogContent>
    </Dialog>
  );
};
