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
