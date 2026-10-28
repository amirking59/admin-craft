import { m } from "@/paraglide/messages.js";
import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export function NotFoundPage() {
  return (
    <Empty className="min-h-svh">
      <EmptyHeader>
        <EmptyMedia className="text-7xl font-bold tracking-tighter text-muted-foreground/40">404</EmptyMedia>
        <EmptyTitle className="text-xl">{m.page_not_found()}</EmptyTitle>
        <EmptyDescription>{m.we_could_not_find_page()}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button render={<Link to="/" />}>
          <ArrowLeftIcon className="rtl:rotate-180" />
          {m.back_to_dashboard()}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
