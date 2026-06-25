"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, toErrorMessage } from "@/lib/action-result";
import { deleteOpportunityApi } from "../lib/api";
import type { Opportunity } from "../types";

export async function deleteOpportunity(id: string): Promise<ActionResult<Opportunity>> {
  try {
    const data = await deleteOpportunityApi(id);
    revalidatePath("/opportunities");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
