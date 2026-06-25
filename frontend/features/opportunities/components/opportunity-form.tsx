"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { opportunityFormSchema, type OpportunityFormValues } from "../validation/schemas";
import { STAGE_LABELS, STAGES } from "../lib/display";
import type { OpportunityStage } from "../types";

export interface ClientOption {
  id: string;
  name: string;
}

interface Props {
  clients: ClientOption[];
  defaultValues?: Partial<OpportunityFormValues>;
  onSubmit: (values: OpportunityFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
}

const EMPTY: OpportunityFormValues = {
  clientId: "",
  title: "",
  amount: 0,
  stage: "LEAD",
  expectedCloseDate: "",
};

export function OpportunityForm({
  clients,
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OpportunityFormValues>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  });

  const clientId = watch("clientId");
  const stage = watch("stage");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Client" error={errors.clientId?.message}>
        <Select
          value={clientId}
          onValueChange={(value) => setValue("clientId", value, { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Title" error={errors.title?.message}>
        <Input {...register("title")} />
      </Field>

      <Field label="Amount (€)" error={errors.amount?.message}>
        <Input type="number" step="0.01" {...register("amount", { valueAsNumber: true })} />
      </Field>

      <Field label="Stage" error={errors.stage?.message}>
        <Select
          value={stage}
          onValueChange={(value) =>
            setValue("stage", value as OpportunityStage, { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {STAGE_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field label="Expected close date" error={errors.expectedCloseDate?.message}>
        <Input type="date" {...register("expectedCloseDate")} />
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
