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
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ConfirmDialogButtonProps extends Omit<React.ComponentProps<typeof Button>, "onClick" | "form"> {
  title?: string;
  icon?: LucideIcon;
  onOk: (onClose: () => void) => void;
  okTitle?: string;
  cancelTitle?: string;
  titleDialog?: string;
  descriptionDialog?: string;
}

export const ConfirmDialogButton = ({
  onOk,
  okTitle,
  cancelTitle,
  title,
  descriptionDialog,
  icon: Icon,
  titleDialog,
  variant,
  size = "default",
  className,
  disabled,
  loading,
  ...rest
}: ConfirmDialogButtonProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
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
        {Icon && <Icon className="size-4" />}
        {title}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titleDialog || t("areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>{descriptionDialog || t("thisActionCanNotUnDone")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading || loading}>{cancelTitle || t("cancel")}</AlertDialogCancel>
          <Button
            autoFocus
            onClick={handleConfirm}
            variant="default"
            loading={isLoading || loading}
            disabled={isLoading || loading}
          >
            {okTitle || t("ok")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
