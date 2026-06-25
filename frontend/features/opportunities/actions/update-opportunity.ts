"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, toErrorMessage } from "@/lib/action-result";
import {
  updateOpportunitySchema,
  type UpdateOpportunityInput,
} from "../validation/schemas";
import { updateOpportunityApi } from "../lib/api";
import type { Opportunity } from "../types";

export async function updateOpportunity(
  id: string,
  input: UpdateOpportunityInput,
): Promise<ActionResult<Opportunity>> {
  try {
    const data = await updateOpportunityApi(id, updateOpportunitySchema.parse(input));
    revalidatePath("/opportunities");
    revalidatePath(`/opportunities/${id}`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
