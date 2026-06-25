import { getClients } from "@/features/clients/actions";
import { clientDisplayName } from "@/features/clients/lib/display";
import { ClientTypeBadge } from "@/features/clients/components/client-type-badge";
import { ClientsFilter } from "@/features/clients/components/clients-filter";
import { Pagination } from "@/components/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { ClientType } from "@/features/clients/types";

interface PageProps {
  searchParams: Promise<{ type?: string; page?: string }>;
}

export default async function ClientsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const type: ClientType | undefined =
    params.type === "COMPANY" || params.type === "INDIVIDUAL" ? params.type : undefined;
  const page = Math.max(1, Number(params.page) || 1);

  const result = await getClients({ type, page, limit: 10 });

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
        <p className="text-sm text-muted-foreground">Companies and individuals</p>
      </div>

      <ClientsFilter current={type} />

      {!result.success ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive">
          Failed to load clients: {result.error}
        </div>
      ) : (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No clients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  result.data.data.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {clientDisplayName(client)}
                      </TableCell>
                      <TableCell>
                        <ClientTypeBadge type={client.type} />
                      </TableCell>
                      <TableCell>{client.email ?? "—"}</TableCell>
                      <TableCell>{client.phone ?? "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Pagination
            basePath="/clients"
            page={result.data.page}
            totalPages={result.data.totalPages}
            hasNext={result.data.hasNext}
            hasPrevious={result.data.hasPrevious}
            params={{ type }}
          />
        </>
      )}
    </div>
  );
}
