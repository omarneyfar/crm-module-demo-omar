"use server";

import { type ActionResult, toErrorMessage } from "@/lib/action-result";
import { getPipelineApi } from "../lib/api";
import type { Pipeline } from "../types";

export async function getPipeline(): Promise<ActionResult<Pipeline>> {
  try {
    const data = await getPipelineApi();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
