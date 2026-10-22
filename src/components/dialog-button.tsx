import { ReactNode, useState } from "react";
import { ButtonProps, Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DialogButtonProps extends Omit<ButtonProps, "onClick" | "content"> {
  /** Visible trigger label. An icon-only trigger (no title/children) needs an `aria-label`. */
  title?: string;
  icon?: LucideIcon;
  /** Dialog body; call `close` to close the dialog, e.g. after a successful submit. */
  content: (close: () => void) => ReactNode;
  onOpenChange?: (open: boolean) => void;
  dialogClassName?: string;
}

export const DialogButton = ({
  title,
  icon: Icon,
  content,
  onOpenChange,
  children,
  dialogClassName,
  ...buttonProps
}: DialogButtonProps) => {
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button {...buttonProps} />}>
        {Icon && <Icon />}
        {title}
        {children}
      </DialogTrigger>

      <DialogContent className={cn("sm:max-w-fit sm:min-w-[512px]", dialogClassName)}>
        {content(() => handleOpenChange(false))}
      </DialogContent>
    </Dialog>
  );
};
