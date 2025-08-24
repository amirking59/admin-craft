"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleIcon as ExclamationTriangleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useTranslation();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 py-12 md:px-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <div className="text-6xl font-bold text-destructive">{t("error")}</div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{t("somethingWentWrong")}</h1>
        <p className="max-w-[500px] text-muted-foreground">{t("unexpectedError")}</p>

        <Alert variant="destructive" className="w-[500px] text-left">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>{t("errorDetails")}</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="font-mono w-full break-all text-sm overflow-auto max-h-[200px] p-2 bg-destructive/5 rounded-md">
              {error.message || "Unknown error occurred"}
            </div>
            {error.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs">{t("stackTrace")}</summary>
                <pre className="mt-2 text-xs break-all overflow-auto max-h-[200px] p-2 bg-destructive/5 rounded-md whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </details>
            )}
            {error.digest && (
              <div className="mt-2 text-xs">
                {t("errorId")}: <span className="font-mono">{error.digest}</span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row mt-4">
        <Button onClick={() => reset()}>
          <RefreshCwIcon className="mr-2 h-4 w-4" />
          {t("tryAgain")}
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            {t("backToDashboard")}
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
