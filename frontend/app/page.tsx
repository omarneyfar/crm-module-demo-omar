import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PipelineRecap } from "@/features/opportunities/components/pipeline-recap";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Sales pipeline overview
      </p>

      <div className="mt-6">
        <Suspense fallback={<PipelineSkeleton />}>
          <PipelineRecap />
        </Suspense>
      </div>
    </div>
  );
}

function PipelineSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
