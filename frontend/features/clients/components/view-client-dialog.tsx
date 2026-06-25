"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClientTypeBadge } from "./client-type-badge";
import { clientDisplayName } from "../lib/display";
import type { Client } from "../types";

export function ViewClientDialog({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{clientDisplayName(client)}</DialogTitle>
        </DialogHeader>

        <dl className="space-y-3 text-sm">
          <Row label="Type">
            <ClientTypeBadge type={client.type} />
          </Row>
          {client.type === "COMPANY" ? (
            <>
              <Row label="Company name">{client.companyName ?? "—"}</Row>
              <Row label="SIRET">{client.siret ?? "—"}</Row>
            </>
          ) : (
            <>
              <Row label="First name">{client.firstName ?? "—"}</Row>
              <Row label="Last name">{client.lastName ?? "—"}</Row>
            </>
          )}
          <Row label="Email">{client.email ?? "—"}</Row>
          <Row label="Phone">{client.phone ?? "—"}</Row>
          <Row label="Created">
            {new Date(client.createdAt).toLocaleString()}
          </Row>
        </dl>
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-2 last:border-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
