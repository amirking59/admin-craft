import { m } from "@/paraglide/messages.js";
import { ReactNode, useCallback, useRef, useState } from "react";
import { ButtonProps, Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UnsavedChangesContext } from "@/components/form/form";
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

/**
 * A button that opens a dialog. With a form inside (`form.Form`) that has unsaved changes, closing it (Escape, a click
 * outside, Cancel) asks first; `close` doesn't, as it follows a save.
 */
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
  const [confirming, setConfirming] = useState(false);
  const unsaved = useRef(false);
  const setUnsaved = useCallback((value: boolean) => {
    unsaved.current = value;
  }, []);

  const setOpenAndReport = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && unsaved.current) setConfirming(true);
    else setOpenAndReport(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button {...buttonProps} />}>
        {Icon && <Icon />}
        {title}
        {children}
      </DialogTrigger>

      <DialogContent className={cn("sm:max-w-fit sm:min-w-[512px]", dialogClassName)}>
        <UnsavedChangesContext.Provider value={setUnsaved}>
          {content(() => setOpenAndReport(false))}
        </UnsavedChangesContext.Provider>

        {/* Inside the dialog, so it stacks on it as a nested dialog. */}
        <AlertDialog open={confirming} onOpenChange={setConfirming}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{m.discard_changes_title()}</AlertDialogTitle>
              <AlertDialogDescription>{m.discard_changes_description()}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{m.keep_editing()}</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => {
                  setConfirming(false);
                  setOpenAndReport(false);
                }}
              >
                {m.discard()}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};
