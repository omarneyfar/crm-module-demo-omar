import type { Client } from "../types";

// A company shows its name; an individual shows first + last.
export function clientDisplayName(client: Client): string {
  if (client.type === "COMPANY") {
    return client.companyName ?? "—";
  }
  const name = [client.firstName, client.lastName].filter(Boolean).join(" ");
  return name || "—";
}
