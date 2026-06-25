"use server";

import { type ActionResult, toErrorMessage } from "@/lib/action-result";
import type { Paginated } from "@/lib/types";
import { clientQuerySchema, type ClientQueryInput } from "../validation/schemas";
import { getClientsApi } from "../lib/api";
import type { Client } from "../types";

export async function getClients(
  query: Partial<ClientQueryInput> = {},
): Promise<ActionResult<Paginated<Client>>> {
  try {
    const data = await getClientsApi(clientQuerySchema.parse(query));
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
