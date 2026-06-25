"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { StageBadge } from "./stage-badge";
import { ProblemBadges } from "./problem-badges";
import { formatAmount, formatDate } from "../lib/display";
import type { Opportunity } from "../types";

export function ViewOpportunityDialog({
  opportunity,
  clientName,
}: {
  opportunity: Opportunity;
  clientName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{opportunity.title}</DialogTitle>
        </DialogHeader>

        <dl className="space-y-3 text-sm">
          <Row label="Client">{clientName}</Row>
          <Row label="Amount">{formatAmount(opportunity.amount)}</Row>
          <Row label="Stage">
            <StageBadge stage={opportunity.stage} />
          </Row>
          <Row label="Status">
            <ProblemBadges opportunity={opportunity} />
          </Row>
          <Row label="Expected close">
            {formatDate(opportunity.expectedCloseDate)}
          </Row>
          <Row label="Last stage change">
            {formatDate(opportunity.lastStageChangedAt)}
          </Row>
          <Row label="Created">{formatDate(opportunity.createdAt)}</Row>
        </dl>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
