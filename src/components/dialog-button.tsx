import React, { ReactElement, useMemo, useState } from "react";
import { ButtonProps, Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DialogButtonProps extends Omit<ButtonProps, "onClick" | "content"> {
  title?: string;
  icon?: LucideIcon;
  content: ReactElement & { props: { onClose?: (value: boolean) => void } };
  onOpenChange?: (open: boolean) => void;
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
  children,
  dialogClassName,
  ...rest
}: DialogButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const clonedContent = useMemo(
    () => React.cloneElement(content, { onClose: () => handleOpenChange?.(false) }),
    [content, handleOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant={variant} size={size} className={className} disabled={disabled} loading={loading} {...rest} />
        }
      >
        {Icon && <Icon />}
        {title}
        {children}
      </DialogTrigger>

      <DialogContent className={cn("sm:max-w-fit sm:min-w-[512px]", dialogClassName)}>{clonedContent}</DialogContent>
    </Dialog>
  );
};
