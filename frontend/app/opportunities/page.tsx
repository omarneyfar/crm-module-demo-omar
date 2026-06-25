import { getOpportunities } from "@/features/opportunities/actions";
import { getClients } from "@/features/clients/actions";
import { clientDisplayName } from "@/features/clients/lib/display";
import { StageBadge } from "@/features/opportunities/components/stage-badge";
import { ProblemBadges } from "@/features/opportunities/components/problem-badges";
import { OpportunitiesFilter } from "@/features/opportunities/components/opportunities-filter";
import { CreateOpportunityDialog } from "@/features/opportunities/components/create-opportunity-dialog";
import { OpportunityRowActions } from "@/features/opportunities/components/opportunity-row-actions";
import { formatAmount, formatDate, STAGES } from "@/features/opportunities/lib/display";
import { Pagination } from "@/components/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { OpportunityStage } from "@/features/opportunities/types";
import type { ClientType } from "@/features/clients/types";

interface PageProps {
  searchParams: Promise<{
    stage?: string;
    clientType?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function OpportunitiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const stage = STAGES.includes(params.stage as OpportunityStage)
    ? (params.stage as OpportunityStage)
    : undefined;
  const clientType: ClientType | undefined =
    params.clientType === "COMPANY" || params.clientType === "INDIVIDUAL"
      ? params.clientType
      : undefined;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 10));

  const [result, clientsResult] = await Promise.all([
    getOpportunities({ stage, clientType, page, limit }),
    getClients({ limit: 100 }),
  ]);

  const clients = clientsResult.success
    ? clientsResult.data.data.map((c) => ({ id: c.id, name: clientDisplayName(c) }))
    : [];
  const clientNameById = new Map(clients.map((c) => [c.id, c.name]));

  return (
    <div className="flex min-h-screen flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Opportunities</h1>
          <p className="text-sm text-muted-foreground">
            Track deals through the pipeline
          </p>
        </div>
        <CreateOpportunityDialog clients={clients} />
      </div>

      <OpportunitiesFilter stage={stage} clientType={clientType} limit={limit} />

      {!result.success ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive">
          Failed to load opportunities: {result.error}
        </div>
      ) : (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Close date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No opportunities found.
                    </TableCell>
                  </TableRow>
                ) : (
                  result.data.data.map((opportunity) => (
                    <TableRow
                      key={opportunity.id}
                      className={cn(opportunity.hasProblem && "bg-destructive/5")}
                    >
                      <TableCell className="font-medium">{opportunity.title}</TableCell>
                      <TableCell>
                        {clientNameById.get(opportunity.clientId) ?? "—"}
                      </TableCell>
                      <TableCell>{formatAmount(opportunity.amount)}</TableCell>
                      <TableCell>
                        <StageBadge stage={opportunity.stage} />
                      </TableCell>
                      <TableCell>{formatDate(opportunity.expectedCloseDate)}</TableCell>
                      <TableCell>
                        <ProblemBadges opportunity={opportunity} />
                      </TableCell>
                      <TableCell className="text-right">
                        <OpportunityRowActions
                          opportunity={opportunity}
                          clients={clients}
                          clientName={clientNameById.get(opportunity.clientId) ?? "—"}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-auto">
            <Pagination
              basePath="/opportunities"
              page={result.data.page}
              totalPages={result.data.totalPages}
              hasNext={result.data.hasNext}
              hasPrevious={result.data.hasPrevious}
              limit={result.data.limit}
              params={{ stage, clientType }}
            />
          </div>
        </>
      )}
    </div>
  );
}
