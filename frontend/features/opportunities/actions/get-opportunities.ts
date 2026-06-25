"use server";

import { type ActionResult, toErrorMessage } from "@/lib/action-result";
import type { Paginated } from "@/lib/types";
import { opportunityQuerySchema, type OpportunityQueryInput } from "../validation/schemas";
import { getOpportunitiesApi } from "../lib/api";
import type { Opportunity } from "../types";

export async function getOpportunities(
  query: Partial<OpportunityQueryInput> = {},
): Promise<ActionResult<Paginated<Opportunity>>> {
  try {
    const data = await getOpportunitiesApi(opportunityQuerySchema.parse(query));
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
