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
import { clientFormSchema, type ClientFormValues } from "../validation/schemas";

interface Props {
  defaultValues?: Partial<ClientFormValues>;
  onSubmit: (values: ClientFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
}

const EMPTY: ClientFormValues = {
  type: "COMPANY",
  email: "",
  phone: "",
  companyName: "",
  siret: "",
  firstName: "",
  lastName: "",
};

export function ClientForm({ defaultValues, onSubmit, onCancel, submitLabel = "Save" }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  });

  const type = watch("type");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field label="Type">
        <Select
          value={type}
          onValueChange={(value) =>
            setValue("type", value as ClientFormValues["type"], { shouldValidate: true })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="COMPANY">Company</SelectItem>
            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {type === "COMPANY" ? (
        <>
          <Field label="Company name" error={errors.companyName?.message}>
            <Input {...register("companyName")} />
          </Field>
          <Field label="SIRET" error={errors.siret?.message}>
            <Input {...register("siret")} />
          </Field>
        </>
      ) : (
        <>
          <Field label="First name" error={errors.firstName?.message}>
            <Input {...register("firstName")} />
          </Field>
          <Field label="Last name" error={errors.lastName?.message}>
            <Input {...register("lastName")} />
          </Field>
        </>
      )}

      <Field label="Email" error={errors.email?.message}>
        <Input type="email" {...register("email")} />
      </Field>
      <Field label="Phone" error={errors.phone?.message}>
        <Input {...register("phone")} />
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
