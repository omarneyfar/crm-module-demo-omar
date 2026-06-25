import { Badge } from "@/components/ui/badge";
import type { Opportunity } from "../types";

export function ProblemBadges({ opportunity }: { opportunity: Opportunity }) {
  if (!opportunity.hasProblem) {
    return <span className="text-sm text-muted-foreground">On track</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {opportunity.isLate && <Badge variant="destructive">Late</Badge>}
      {opportunity.isStagnant && (
        <Badge variant="outline" className="border-destructive text-destructive">
          Stagnant
        </Badge>
      )}
    </div>
  );
}
