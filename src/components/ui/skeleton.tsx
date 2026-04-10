import { cn } from "@/utils/cn";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("bg-accent animate-pulse rounded-md", className)} {...props} />;
}

const SVGSkeleton = ({ className }: React.ComponentProps<"svg">) => (
  <svg className={className + " animate-pulse rounded bg-accent"} />
);

export { Skeleton, SVGSkeleton };
