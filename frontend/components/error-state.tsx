"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shared error UI used by route-level error boundaries (error.tsx).
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {message ? (
          <p className="max-w-md text-sm text-muted-foreground">{message}</p>
        ) : null}
      </div>
      <Button onClick={onRetry}>Try again</Button>
    </div>
  );
}
