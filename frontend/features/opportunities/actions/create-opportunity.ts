"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, toErrorMessage } from "@/lib/action-result";
import {
  createOpportunitySchema,
  type CreateOpportunityInput,
} from "../validation/schemas";
import { createOpportunityApi } from "../lib/api";
import type { Opportunity } from "../types";

export async function createOpportunity(
  input: CreateOpportunityInput,
): Promise<ActionResult<Opportunity>> {
  try {
    const data = await createOpportunityApi(createOpportunitySchema.parse(input));
    revalidatePath("/opportunities");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
