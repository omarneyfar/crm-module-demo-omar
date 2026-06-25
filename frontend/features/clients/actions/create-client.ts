"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, toErrorMessage } from "@/lib/action-result";
import { createClientSchema, type CreateClientInput } from "../validation/schemas";
import { createClientApi } from "../lib/api";
import type { Client } from "../types";

export async function createClient(
  input: CreateClientInput,
): Promise<ActionResult<Client>> {
  try {
    const data = await createClientApi(createClientSchema.parse(input));
    revalidatePath("/clients");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
