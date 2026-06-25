import { ViewClientDialog } from "./view-client-dialog";
import { EditClientDialog } from "./edit-client-dialog";
import { DeleteClientDialog } from "./delete-client-dialog";
import type { Client } from "../types";

export function ClientRowActions({ client }: { client: Client }) {
  return (
    <div className="flex justify-end gap-1">
      <ViewClientDialog client={client} />
      <EditClientDialog client={client} />
      <DeleteClientDialog client={client} />
    </div>
  );
}
