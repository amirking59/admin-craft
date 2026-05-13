import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, LucideIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface ConfirmDialogButtonProps extends Omit<ButtonProps, "onClick" | "form"> {
  title?: string;
  icon?: LucideIcon;
  onOk: (onClose: () => void) => void;
  okTitle?: string;
  okVariant?: "default" | "destructive" | "success";
  cancelTitle?: string;
  titleDialog?: string;
  descriptionDialog?: string | ReactNode;
  iconDialog?: LucideIcon;
  // When set, the user must type this exact text into an input before the OK button enables.
  confirmText?: string;
  confirmTextLabel?: string;
}

export const ConfirmDialogButton = ({
  onOk,
  okTitle,
  okVariant = "default",
  cancelTitle,
  title,
  descriptionDialog,
  icon: Icon,
  iconDialog: IconDialog,
  titleDialog,
  variant,
  size = "default",
  className,
  disabled,
  loading,
  children,
  confirmText,
  confirmTextLabel,
  ...rest
}: ConfirmDialogButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typed, setTyped] = useState("");

  // Reset the typed value whenever the dialog re-opens.
  useEffect(() => {
    if (isOpen) setTyped("");
  }, [isOpen]);

  const typingGateOk = !confirmText || typed === confirmText;

  const handleConfirm = async () => {
    if (!typingGateOk) return;
    try {
      setIsLoading(true);
      onOk(() => {
        setIsOpen(false);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Confirm action failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogTrigger
        render={<Button variant={variant} size={size} className={className} disabled={disabled} {...rest} />}
      >
        {Icon && <Icon />}
        {title}
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {IconDialog ? (
              <IconDialog
                className={`h-5 w-5 ${okVariant === "destructive" ? "text-destructive" : "text-amber-500"}`}
              />
            ) : (
              <AlertTriangle
                className={`h-5 w-5 ${okVariant === "destructive" ? "text-destructive" : "text-amber-500"}`}
              />
            )}
            {titleDialog || "Are you sure?"}
          </AlertDialogTitle>
          <AlertDialogDescription>{descriptionDialog || "This action cannot be undone."}</AlertDialogDescription>
        </AlertDialogHeader>
        {confirmText && (
          <div className="space-y-2">
            <Label htmlFor="confirm-dialog-typing-gate" className="text-sm">
              {confirmTextLabel || (
                <span>
                  Type <span className="font-mono font-semibold text-destructive">{confirmText}</span> to confirm
                </span>
              )}
            </Label>
            <Input
              id="confirm-dialog-typing-gate"
              autoComplete="off"
              autoFocus
              value={typed}
              placeholder={confirmText}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && typingGateOk && !isLoading && !loading) {
                  e.preventDefault();
                  handleConfirm();
                }
              }}
              className="font-mono"
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading || loading}>{cancelTitle || "Cancel"}</AlertDialogCancel>
          <Button
            autoFocus={!confirmText}
            onClick={handleConfirm}
            variant={okVariant}
            loading={isLoading || loading}
            disabled={isLoading || loading || !typingGateOk}
          >
            {okTitle || "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
