import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <Empty className="min-h-svh">
      <EmptyHeader>
        <EmptyMedia className="text-7xl font-bold tracking-tighter text-muted-foreground/40">404</EmptyMedia>
        <EmptyTitle className="text-xl">{t("pageNotFound")}</EmptyTitle>
        <EmptyDescription>{t("weCouldNotFindPage")}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button render={<Link to="/" />}>
          <ArrowLeftIcon className="rtl:rotate-180" />
          {t("backToDashboard")}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
