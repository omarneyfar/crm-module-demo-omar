
export type ClientType = "COMPANY" | "INDIVIDUAL";

export interface Client {
  id: string;
  type: ClientType;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  siret: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FindClientsQuery {
  type?: ClientType;
  page?: number;
  limit?: number;
}
