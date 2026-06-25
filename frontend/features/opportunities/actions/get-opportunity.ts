"use server";

import { type ActionResult, toErrorMessage } from "@/lib/action-result";
import { getOpportunityApi } from "../lib/api";
import type { Opportunity } from "../types";

export async function getOpportunity(id: string): Promise<ActionResult<Opportunity>> {
  try {
    const data = await getOpportunityApi(id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
