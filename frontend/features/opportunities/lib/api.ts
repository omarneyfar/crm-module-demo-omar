// Server-side opportunities API. Called only from the opportunities actions.
import { API_BASE_URL } from "@/lib/api-config";
import type { Paginated } from "@/lib/types";
import type { FindOpportunitiesQuery, Opportunity, Pipeline } from "../types";
import type {
  CreateOpportunityInput,
  UpdateOpportunityInput,
} from "../validation/schemas";

const BASE = `${API_BASE_URL}/opportunities`;

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

function toQueryString(query: FindOpportunitiesQuery): string {
  const params = new URLSearchParams();
  if (query.stage) params.set("stage", query.stage);
  if (query.clientType) params.set("clientType", query.clientType);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getOpportunitiesApi(query: FindOpportunitiesQuery = {}) {
  const res = await fetch(`${BASE}${toQueryString(query)}`, { cache: "no-store" });
  return handle<Paginated<Opportunity>>(res);
}

export async function getPipelineApi() {
  const res = await fetch(`${BASE}/pipeline`, { cache: "no-store" });
  return handle<Pipeline>(res);
}

export async function getOpportunityApi(id: string) {
  const res = await fetch(`${BASE}/${id}`, { cache: "no-store" });
  return handle<Opportunity>(res);
}

export async function createOpportunityApi(input: CreateOpportunityInput) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<Opportunity>(res);
}

export async function updateOpportunityApi(id: string, input: UpdateOpportunityInput) {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return handle<Opportunity>(res);
}

export async function deleteOpportunityApi(id: string) {
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  return handle<Opportunity>(res);
}
