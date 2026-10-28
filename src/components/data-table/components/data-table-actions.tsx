import { m } from "@/paraglide/messages.js";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { EllipsisVertical } from "lucide-react";

interface DataTableActionsProps {
  children: React.ReactNode;
  title?: string;
}

export const DataTableActions = ({ children, title }: DataTableActionsProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="mb-3 flex items-center gap-2">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}

        <div className="flex-1" />

        <Popover>
          <PopoverTrigger render={<Button variant="ghost" size="icon" aria-label={m.table_actions()} />}>
            <EllipsisVertical />
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="flex flex-col gap-4">{children}</div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="mb-3 flex items-center gap-3">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}

      <div className="flex-1" />

      {children}
    </div>
  );
};
