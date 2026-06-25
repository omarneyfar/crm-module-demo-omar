"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STAGE_LABELS, STAGES } from "../lib/display";
import type { OpportunityStage, OpportunityStatus } from "../types";
import type { ClientType } from "@/features/clients/types";

const ALL = "ALL"; // Radix Select can't use an empty value, so this is the "no filter" sentinel.

const STATUSES: { value: string; label: string }[] = [
  { value: ALL, label: "All statuses" },
  { value: "PROBLEM", label: "Problem" },
  { value: "LATE", label: "Late" },
  { value: "STAGNANT", label: "Stagnant" },
  { value: "ON_TRACK", label: "On track" },
];

interface Props {
  stage?: OpportunityStage;
  clientType?: ClientType;
  status?: OpportunityStatus;
  search?: string;
  limit: number;
}

export function OpportunitiesFilter({ stage, clientType, status, search, limit }: Props) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(search ?? "");

  function navigate(overrides: {
    stage?: string;
    clientType?: string;
    status?: string;
    search?: string;
  }) {
    const next = {
      stage: overrides.stage ?? stage,
      clientType: overrides.clientType ?? clientType,
      status: overrides.status ?? status,
      search: overrides.search ?? searchInput,
    };

    const params = new URLSearchParams();
    if (next.stage && next.stage !== ALL) params.set("stage", next.stage);
    if (next.clientType && next.clientType !== ALL) {
      params.set("clientType", next.clientType);
    }
    if (next.status && next.status !== ALL) params.set("status", next.status);
    if (next.search) params.set("search", next.search);
    params.set("limit", String(limit));
    params.set("page", "1");
    router.push(`/opportunities?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ search: searchInput });
        }}
        className="flex gap-2"
      >
        <Input
          placeholder="Search client…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-56"
        />
        <Button type="submit" variant="outline" size="icon">
          <Search />
        </Button>
      </form>

      <Select value={stage ?? ALL} onValueChange={(value) => navigate({ stage: value })}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All stages</SelectItem>
          {STAGES.map((s) => (
            <SelectItem key={s} value={s}>
              {STAGE_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={clientType ?? ALL}
        onValueChange={(value) => navigate({ clientType: value })}
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All client types</SelectItem>
          <SelectItem value="COMPANY">Companies</SelectItem>
          <SelectItem value="INDIVIDUAL">Individuals</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status ?? ALL} onValueChange={(value) => navigate({ status: value })}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
