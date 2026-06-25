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
import { ClientForm } from "./client-form";
import { createClient } from "../actions";
import type { ClientFormValues, CreateClientInput } from "../validation/schemas";

export function CreateClientDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(values: ClientFormValues) {
    const result = await createClient(values as CreateClientInput);
    if (result.success) {
      toast.success("Client created");
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
          New client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New client</DialogTitle>
        </DialogHeader>
        <ClientForm
          submitLabel="Create"
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
