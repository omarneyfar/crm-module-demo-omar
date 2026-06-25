import { Badge } from "@/components/ui/badge";
import type { ClientType } from "../types";

export function ClientTypeBadge({ type }: { type: ClientType }) {
  return (
    <Badge variant={type === "COMPANY" ? "default" : "secondary"}>
      {type === "COMPANY" ? "Company" : "Individual"}
    </Badge>
  );
}
