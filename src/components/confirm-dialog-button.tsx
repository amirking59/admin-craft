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
import { cn } from "@/lib/utils";
import { AlertTriangle, LucideIcon } from "lucide-react";
import { ReactNode, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

interface ConfirmDialogButtonProps extends Omit<ButtonProps, "onClick" | "form"> {
  /** Visible trigger label. An icon-only trigger (no title/children) needs an `aria-label`. */
  title?: string;
  icon?: LucideIcon;
  /** Runs on confirm. Return a promise (e.g. `mutation.mutateAsync(...)`): the dialog closes when it resolves
   * and stays open, ready to retry, when it rejects. */
  onOk: () => unknown;
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
  iconDialog: DialogIcon = AlertTriangle,
  titleDialog,
  loading,
  children,
  confirmText,
  confirmTextLabel,
  ...buttonProps
}: ConfirmDialogButtonProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typed, setTyped] = useState("");

  const busy = isLoading || !!loading;
  const typingGateOk = !confirmText || typed === confirmText;

  const handleOpenChange = (open: boolean) => {
    if (open) setTyped("");
    setIsOpen(open);
  };

  const handleConfirm = async () => {
    if (!typingGateOk || busy) return;

    setIsLoading(true);
    try {
      await onOk();
      setIsOpen(false);
    } catch (error) {
      // The failing call reports its own error (e.g. the API client's toast); keep the dialog open for a retry.
      console.error("Confirm action failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog onOpenChange={handleOpenChange} open={isOpen}>
      <AlertDialogTrigger render={<Button {...buttonProps} />}>
        {Icon && <Icon />}
        {title}
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <DialogIcon className={cn("size-5", okVariant === "destructive" ? "text-destructive" : "text-amber-500")} />
            {titleDialog || t("areYouSure")}
          </AlertDialogTitle>
          <AlertDialogDescription>{descriptionDialog || t("thisActionCanNotUnDone")}</AlertDialogDescription>
        </AlertDialogHeader>
        {confirmText && (
          <div className="space-y-2">
            <Label htmlFor="confirm-dialog-typing-gate" className="text-sm">
              {confirmTextLabel || (
                <span>
                  <Trans
                    i18nKey="typeXToConfirm"
                    values={{ x: confirmText }}
                    components={{ code: <span className="font-mono font-semibold text-destructive" /> }}
                  />
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
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleConfirm();
                }
              }}
              className="font-mono"
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>{cancelTitle || t("cancel")}</AlertDialogCancel>
          <Button
            autoFocus={!confirmText}
            onClick={handleConfirm}
            variant={okVariant}
            loading={busy}
            disabled={!typingGateOk}
          >
            {okTitle || t("confirm")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
