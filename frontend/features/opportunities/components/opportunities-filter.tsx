"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STAGE_LABELS, STAGES } from "../lib/display";
import type { OpportunityStage } from "../types";
import type { ClientType } from "@/features/clients/types";

const ALL = "ALL"; // Radix Select can't use an empty value, so this is the "no filter" sentinel.

interface Props {
  stage?: OpportunityStage;
  clientType?: ClientType;
  limit: number;
}

export function OpportunitiesFilter({ stage, clientType, limit }: Props) {
  const router = useRouter();

  function navigate(next: { stage?: string; clientType?: string }) {
    const resolvedStage = next.stage ?? stage;
    const resolvedClientType = next.clientType ?? clientType;

    const params = new URLSearchParams();
    if (resolvedStage && resolvedStage !== ALL) params.set("stage", resolvedStage);
    if (resolvedClientType && resolvedClientType !== ALL) {
      params.set("clientType", resolvedClientType);
    }
    params.set("limit", String(limit));
    params.set("page", "1");
    router.push(`/opportunities?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={stage ?? ALL} onValueChange={(value) => navigate({ stage: value })}>
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All stages</SelectItem>
          {STAGES.map((s) => (
            <SelectItem key={s} value={s}>
              {STAGE_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={clientType ?? ALL}
        onValueChange={(value) => navigate({ clientType: value })}
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All client types</SelectItem>
          <SelectItem value="COMPANY">Companies</SelectItem>
          <SelectItem value="INDIVIDUAL">Individuals</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
