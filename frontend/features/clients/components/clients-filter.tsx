import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ClientType } from "../types";

const OPTIONS: { label: string; value?: ClientType }[] = [
  { label: "All" },
  { label: "Companies", value: "COMPANY" },
  { label: "Individuals", value: "INDIVIDUAL" },
];

// Changing the filter resets to page 1 (we don't carry the old page over).
export function ClientsFilter({ current }: { current?: ClientType }) {
  return (
    <div className="flex gap-1">
      {OPTIONS.map((option) => {
        const active = current === option.value;
        const href = option.value ? `/clients?type=${option.value}` : "/clients";
        return (
          <Button
            key={option.label}
            asChild
            size="sm"
            variant={active ? "default" : "outline"}
          >
            <Link href={href}>{option.label}</Link>
          </Button>
        );
      })}
    </div>
  );
}
