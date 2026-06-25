import { ViewOpportunityDialog } from "./view-opportunity-dialog";
import { EditOpportunityDialog } from "./edit-opportunity-dialog";
import { DeleteOpportunityDialog } from "./delete-opportunity-dialog";
import type { ClientOption } from "./opportunity-form";
import type { Opportunity } from "../types";

interface Props {
  opportunity: Opportunity;
  clients: ClientOption[];
  clientName: string;
}

export function OpportunityRowActions({ opportunity, clients, clientName }: Props) {
  return (
    <div className="flex justify-end gap-1">
      <ViewOpportunityDialog opportunity={opportunity} clientName={clientName} />
      <EditOpportunityDialog opportunity={opportunity} clients={clients} />
      <DeleteOpportunityDialog opportunity={opportunity} />
    </div>
  );
}
