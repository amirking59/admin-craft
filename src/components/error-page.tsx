import { useEffect } from "react";
import { ErrorComponentProps, Link } from "@tanstack/react-router";
import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleIcon as ExclamationTriangleIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ErrorPage({ error, reset }: ErrorComponentProps) {
  const err = error instanceof Error ? error : new Error(String(error));
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
        <p className="h-125 text-muted-foreground">{t("unexpectedError")}</p>

        <Alert variant="destructive" className="h-125 text-start">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>{t("errorDetails")}</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="max-h-50 w-full overflow-auto rounded-md bg-destructive/5 p-2 font-mono text-sm break-all">
              {err.message || "Unknown error occurred"}
            </div>
            {err.stack && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs">{t("stackTrace")}</summary>
                <pre className="mt-2 max-h-50 overflow-auto rounded-md bg-destructive/5 p-2 text-xs break-all whitespace-pre-wrap">
                  {err.stack}
                </pre>
              </details>
            )}
          </AlertDescription>
        </Alert>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button onClick={() => reset()}>
          <RefreshCwIcon className="me-2 h-4 w-4" />
          {t("tryAgain")}
        </Button>
        <Button variant="outline" render={<Link to="/" />}>
          {t("backToDashboard")}
          <ArrowLeftIcon className="me-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
