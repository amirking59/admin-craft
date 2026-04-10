import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { EllipsisVertical } from "lucide-react";

interface DataTableActionsProps {
  children: React.ReactNode;
  title?: string;
}

export const DataTableActions = ({ children, title }: DataTableActionsProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="flex items-center gap-2 mb-3">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}

        <div className="flex-1" />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size={"icon"} className="p-1">
              <EllipsisVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="flex flex-col gap-4">{children}</div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 mb-3">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}

      <div className="flex-1" />

      {children}
    </div>
  );
};
