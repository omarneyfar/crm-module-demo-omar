"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, toErrorMessage } from "@/lib/action-result";
import { updateClientSchema, type UpdateClientInput } from "../validation/schemas";
import { updateClientApi } from "../lib/api";
import type { Client } from "../types";

export async function updateClient(
  id: string,
  input: UpdateClientInput,
): Promise<ActionResult<Client>> {
  try {
    const data = await updateClientApi(id, updateClientSchema.parse(input));
    revalidatePath("/clients");
    revalidatePath(`/clients/${id}`);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
