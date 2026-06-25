import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPipeline } from "../actions";
import { STAGES, formatAmount } from "../lib/display";
import { StageBadge } from "./stage-badge";

/**
 * Pipeline recap — the "récap chiffré" from the brief.
 * Server component: fetches the aggregation via the getPipeline action and
 * renders the two headline figures plus a per-stage breakdown.
 */
export async function PipelineRecap() {
  const result = await getPipeline();

  if (!result.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pipeline</CardTitle>
          <CardDescription className="text-destructive">
            Could not load the pipeline: {result.error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { byStage, totalOpenValue, weightedForecast } = result.data;
  const statByStage = new Map(byStage.map((s) => [s.stage, s]));
  const maxAmount = Math.max(1, ...byStage.map((s) => Number(s.totalAmount)));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardDescription>Total open value</CardDescription>
            <CardTitle className="text-3xl">
              {formatAmount(totalOpenValue)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Sum of amounts for deals still in play (excludes Won / Lost).
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Weighted forecast</CardDescription>
            <CardTitle className="text-3xl">
              {formatAmount(weightedForecast)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Each stage&apos;s value × its win-probability.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">By stage</CardTitle>
          <CardDescription>Count and total value per pipeline stage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {STAGES.map((stage) => {
            const stat = statByStage.get(stage);
            const count = stat?.count ?? 0;
            const amount = Number(stat?.totalAmount ?? 0);
            const pct = Math.round((amount / maxAmount) * 100);
            return (
              <div key={stage} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <StageBadge stage={stage} />
                    <span className="text-muted-foreground">
                      {count} {count === 1 ? "deal" : "deals"}
                    </span>
                  </div>
                  <span className="font-medium">{formatAmount(amount)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
