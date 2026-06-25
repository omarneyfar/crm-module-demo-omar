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
import { ClientForm } from "./client-form";
import { updateClient } from "../actions";
import type { Client } from "../types";
import type { ClientFormValues, UpdateClientInput } from "../validation/schemas";

function toFormValues(client: Client): Partial<ClientFormValues> {
  return {
    type: client.type,
    email: client.email ?? "",
    phone: client.phone ?? "",
    companyName: client.companyName ?? "",
    siret: client.siret ?? "",
    firstName: client.firstName ?? "",
    lastName: client.lastName ?? "",
  };
}

export function EditClientDialog({ client }: { client: Client }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function handleSubmit(values: ClientFormValues) {
    const result = await updateClient(client.id, values as UpdateClientInput);
    if (result.success) {
      toast.success("Client updated");
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
          <DialogTitle>Edit client</DialogTitle>
        </DialogHeader>
        <ClientForm
          defaultValues={toFormValues(client)}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
