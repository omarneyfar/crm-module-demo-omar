import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageSizeSelect } from "@/components/page-size-select";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  basePath: string;
  limit: number;
  // Active filters to keep when switching pages (e.g. { type } or { stage, clientType }).
  params?: Record<string, string | undefined>;
  pageSizeOptions?: number[];
}

export function Pagination({
  page,
  totalPages,
  hasNext,
  hasPrevious,
  basePath,
  limit,
  params = {},
  pageSizeOptions,
}: PaginationProps) {
  const hrefFor = (target: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
    search.set("limit", String(limit));
    search.set("page", String(target));
    return `${basePath}?${search.toString()}`;
  };

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Page {page} of {Math.max(totalPages, 1)}
      </span>
      <div className="flex items-center gap-4">
        <PageSizeSelect
          basePath={basePath}
          limit={limit}
          params={params}
          options={pageSizeOptions}
        />
        <div className="flex gap-2">
          {hasPrevious ? (
            <Button asChild variant="outline" size="sm">
              <Link href={hrefFor(page - 1)}>Previous</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
          )}
          {hasNext ? (
            <Button asChild variant="outline" size="sm">
              <Link href={hrefFor(page + 1)}>Next</Link>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
