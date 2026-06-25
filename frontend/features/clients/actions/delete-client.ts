"use server";

import { revalidatePath } from "next/cache";
import { type ActionResult, toErrorMessage } from "@/lib/action-result";
import { deleteClientApi } from "../lib/api";
import type { Client } from "../types";

export async function deleteClient(id: string): Promise<ActionResult<Client>> {
  try {
    const data = await deleteClientApi(id);
    revalidatePath("/clients");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: toErrorMessage(error) };
  }
}
