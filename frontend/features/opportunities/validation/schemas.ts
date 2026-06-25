import { z } from "zod";

export const opportunityStageEnum = z.enum([
  "LEAD",
  "CONTACTED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
]);
const clientTypeFilter = z.enum(["COMPANY", "INDIVIDUAL"]);

export const opportunityQuerySchema = z.object({
  stage: opportunityStageEnum.optional(),
  clientType: clientTypeFilter.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
export type OpportunityQueryInput = z.infer<typeof opportunityQuerySchema>;

// API payload schemas (used by the actions). coerce handles the form's number.
export const createOpportunitySchema = z.object({
  clientId: z.string().uuid("Select a client"),
  title: z.string().min(1, "Title is required"),
  amount: z.coerce.number().nonnegative("Amount must be 0 or more"),
  stage: opportunityStageEnum.optional(),
  expectedCloseDate: z.string().min(1, "Expected close date is required"),
});
export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;

export const updateOpportunitySchema = createOpportunitySchema.partial();
export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;

// Flat schema for the form. amount stays a real number (register valueAsNumber)
// so react-hook-form types stay clean (no coerce -> no unknown input).
export const opportunityFormSchema = z.object({
  clientId: z.string().uuid("Select a client"),
  title: z.string().min(1, "Title is required"),
  amount: z.number().nonnegative("Amount must be 0 or more"),
  stage: opportunityStageEnum,
  expectedCloseDate: z.string().min(1, "Expected close date is required"),
});
export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;
