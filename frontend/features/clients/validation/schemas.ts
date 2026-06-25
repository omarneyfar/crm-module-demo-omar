import { z } from "zod";

export const clientTypeEnum = z.enum(["COMPANY", "INDIVIDUAL"]);

// Treat empty form fields as "not provided".
const optionalEmail = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.string().email("Invalid email").optional(),
);
const optionalString = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.string().optional(),
);

export const clientQuerySchema = z.object({
  type: clientTypeEnum.optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});
export type ClientQueryInput = z.infer<typeof clientQuerySchema>;

const shared = { email: optionalEmail, phone: optionalString };

// Same rule as the backend: a company needs a name, an individual needs first + last.
export const createClientSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("COMPANY"),
    companyName: z.string().min(1, "Company name is required"),
    siret: optionalString,
    ...shared,
  }),
  z.object({
    type: z.literal("INDIVIDUAL"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    ...shared,
  }),
]);
export type CreateClientInput = z.infer<typeof createClientSchema>;

// PATCH is partial, so everything is optional here.
export const updateClientSchema = z.object({
  type: clientTypeEnum.optional(),
  email: optionalEmail,
  phone: optionalString,
  companyName: optionalString,
  siret: optionalString,
  firstName: optionalString,
  lastName: optionalString,
});
export type UpdateClientInput = z.infer<typeof updateClientSchema>;

// Flat schema for the form (react-hook-form keeps every field mounted).
// Plain string fields (no preprocess) so the form value types stay simple;
// the empty-string -> undefined cleanup happens in the action's schema.
// The conditional "required" rules live in superRefine instead of a union.
export const clientFormSchema = z
  .object({
    type: clientTypeEnum,
    email: z.string().email("Invalid email").or(z.literal("")).optional(),
    phone: z.string().optional(),
    companyName: z.string().optional(),
    siret: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.type === "COMPANY" && !value.companyName) {
      ctx.addIssue({
        code: "custom",
        path: ["companyName"],
        message: "Company name is required",
      });
    }
    if (value.type === "INDIVIDUAL") {
      if (!value.firstName) {
        ctx.addIssue({
          code: "custom",
          path: ["firstName"],
          message: "First name is required",
        });
      }
      if (!value.lastName) {
        ctx.addIssue({
          code: "custom",
          path: ["lastName"],
          message: "Last name is required",
        });
      }
    }
  });
export type ClientFormValues = z.infer<typeof clientFormSchema>;
