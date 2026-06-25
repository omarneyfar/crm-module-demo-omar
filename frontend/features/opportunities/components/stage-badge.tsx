import { Badge } from "@/components/ui/badge";
import { STAGE_LABELS } from "../lib/display";
import type { OpportunityStage } from "../types";

type Variant = "default" | "secondary" | "success" | "destructive" | "outline";

const VARIANT: Record<OpportunityStage, Variant> = {
  LEAD: "secondary",
  CONTACTED: "secondary",
  PROPOSAL: "default",
  NEGOTIATION: "default",
  WON: "success",
  LOST: "destructive",
};

export function StageBadge({ stage }: { stage: OpportunityStage }) {
  return <Badge variant={VARIANT[stage]}>{STAGE_LABELS[stage]}</Badge>;
}
