"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 py-12 md:px-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="rounded-full bg-muted p-4">
          <div className="text-6xl font-bold">404</div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{t("pageNotFound")}</h1>
        <p className="h-125 text-muted-foreground">{t("weCouldNotFindPage")}</p>
      </div>
      <Button className="" render={<Link href="/" />}>
        {t("backToDashboard")}
        <ArrowLeftIcon className="me-2 h-4 w-4" />
      </Button>
    </div>
  );
}
