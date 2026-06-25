// Server-side client API. Called only from the clients server actions.
import { API_BASE_URL } from "@/lib/api-config";
import type { Paginated } from "@/lib/types";
import type { Client, FindClientsQuery } from "../types";
import type { CreateClientInput, UpdateClientInput } from "../validation/schemas";

const BASE = `${API_BASE_URL}/clients`;

async function handle<T>(res: Response): Promise<T> {
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = body?.message;
    throw new Error(
      Array.isArray(message) ? message.join(", ") : message || `Request failed (${res.status})`,
    );
  }

  return body as T;
}

function toQueryString(query: FindClientsQuery): string {
  const params = new URLSearchParams();
  if (query.type) params.set("type", query.type);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getClientsApi(query: FindClientsQuery = {}) {
  const res = await fetch(`${BASE}${toQueryString(query)}`, { cache: "no-store" });
  return handle<Paginated<Client>>(res);
}

export async function getClientApi(id: string) {
  const res = await fetch(`${BASE}/${id}`, { cache: "no-store" });
  return handle<Client>(res);
}

export async function createClientApi(input: CreateClientInput) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<Client>(res);
}

export async function updateClientApi(id: string, input: UpdateClientInput) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<Client>(res);
}

export async function deleteClientApi(id: string) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return handle<Client>(res);
}
