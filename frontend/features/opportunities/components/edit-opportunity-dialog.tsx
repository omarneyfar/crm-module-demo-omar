"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OpportunityForm, type ClientOption } from "./opportunity-form";
import { updateOpportunity } from "../actions";
import type { Opportunity } from "../types";
import type { OpportunityFormValues } from "../validation/schemas";

function toFormValues(opportunity: Opportunity): Partial<OpportunityFormValues> {
  return {
    clientId: opportunity.clientId,
    title: opportunity.title,
    amount: Number(opportunity.amount),
    stage: opportunity.stage,
    expectedCloseDate: opportunity.expectedCloseDate.slice(0, 10),
  };
}

export function EditOpportunityDialog({
  opportunity,
  clients,
}: {
  opportunity: Opportunity;
  clients: ClientOption[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(values: OpportunityFormValues) {
    const result = await updateOpportunity(opportunity.id, values);
    if (result.success) {
      toast.success("Opportunity updated");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit opportunity</DialogTitle>
        </DialogHeader>
        <OpportunityForm
          clients={clients}
          defaultValues={toFormValues(opportunity)}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
