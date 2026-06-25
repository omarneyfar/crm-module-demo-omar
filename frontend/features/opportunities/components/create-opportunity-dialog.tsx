"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OpportunityForm, type ClientOption } from "./opportunity-form";
import { createOpportunity } from "../actions";
import type { OpportunityFormValues } from "../validation/schemas";

export function CreateOpportunityDialog({ clients }: { clients: ClientOption[] }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(values: OpportunityFormValues) {
    const result = await createOpportunity(values);
    if (result.success) {
      toast.success("Opportunity created");
      setOpen(false);
      router.refresh();
    } else {
      toast.error(result.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          New opportunity
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New opportunity</DialogTitle>
        </DialogHeader>
        <OpportunityForm
          clients={clients}
          submitLabel="Create"
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
