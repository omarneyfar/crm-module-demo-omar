"use server";

import { type ActionResult, toErrorMessage } from "@/lib/action-result";
import { getClientApi } from "../lib/api";
import type { Client } from "../types";

export async function getClient(id: string): Promise<ActionResult<Client>> {
  try {
    const data = await getClientApi(id);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
