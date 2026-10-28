import { m } from "@/paraglide/messages.js";
import { useEffect } from "react";
import { ErrorComponentProps, Link } from "@tanstack/react-router";
import { ArrowLeftIcon, RefreshCwIcon, TriangleAlertIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

export function ErrorPage({ error, reset }: ErrorComponentProps) {
  const err = error instanceof Error ? error : new Error(String(error));
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Empty className="min-h-svh">
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className="size-12 bg-destructive/10 text-destructive [&_svg:not([class*='size-'])]:size-6"
        >
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle className="text-xl">{m.something_went_wrong()}</EmptyTitle>
        <EmptyDescription>{m.unexpected_error()}</EmptyDescription>
      </EmptyHeader>

      <EmptyContent className="max-w-lg">
        {err.message && (
          <Alert variant="destructive" className="text-start">
            <AlertTitle>{m.error_details()}</AlertTitle>
            <AlertDescription className="min-w-0">
              <p className="font-mono break-all">{err.message}</p>
              {/* Stack traces are for developers; don't show them to users of a production build. */}
              {import.meta.env.DEV && err.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs">{m.stack_trace()}</summary>
                  <pre className="mt-2 max-h-50 overflow-auto rounded-md bg-destructive/5 p-2 text-xs break-all whitespace-pre-wrap">
                    {err.stack}
                  </pre>
                </details>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={() => reset()}>
            <RefreshCwIcon />
            {m.try_again()}
          </Button>
          <Button variant="outline" render={<Link to="/" />}>
            <ArrowLeftIcon className="rtl:rotate-180" />
            {m.back_to_dashboard()}
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}
