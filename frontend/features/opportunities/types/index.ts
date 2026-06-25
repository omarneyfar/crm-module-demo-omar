import type { ClientType } from "@/features/clients/types";

export type OpportunityStage =
  | "LEAD"
  | "CONTACTED"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export interface Opportunity {
  id: string;
  clientId: string;
  title: string;
  amount: string; // Decimal is serialized as a string by the backend
  stage: OpportunityStage;
  expectedCloseDate: string;
  lastStageChangedAt: string;
  createdAt: string;
  updatedAt: string;
  // Derived flags from the backend
  isLate: boolean;
  isStagnant: boolean;
  hasProblem: boolean;
}

export interface FindOpportunitiesQuery {
  stage?: OpportunityStage;
  clientType?: ClientType;
  page?: number;
  limit?: number;
}

export interface PipelineStageStat {
  stage: OpportunityStage;
  count: number;
  totalAmount: string | number;
}

export interface Pipeline {
  byStage: PipelineStageStat[];
  totalOpenValue: number;
  weightedForecast: number;
}
