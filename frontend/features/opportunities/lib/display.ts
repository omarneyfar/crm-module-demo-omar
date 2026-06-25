import type { OpportunityStage } from "../types";

export const STAGE_LABELS: Record<OpportunityStage, string> = {
  LEAD: "Lead",
  CONTACTED: "Contacted",
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost",
};

export const STAGES: OpportunityStage[] = [
  "LEAD",
  "CONTACTED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
];

export function formatAmount(amount: string | number): string {
  const value = typeof amount === "number" ? amount : Number(amount);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString();
}
