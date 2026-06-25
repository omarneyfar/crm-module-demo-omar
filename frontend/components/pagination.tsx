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

// Page numbers to show, collapsing long ranges with ellipses.
function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push("ellipsis");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("ellipsis");

  items.push(total);
  return items;
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
  const total = Math.max(totalPages, 1);

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
      <PageSizeSelect
        basePath={basePath}
        limit={limit}
        params={params}
        options={pageSizeOptions}
      />

      <div className="flex items-center gap-1">
        {hasPrevious ? (
          <Button asChild variant="outline" size="sm">
            <Link href={hrefFor(page - 1)}>Previous</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
        )}

        {getPageItems(page, total).map((item, index) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : item === page ? (
            <Button key={item} variant="default" size="sm" className="min-w-9">
              {item}
            </Button>
          ) : (
            <Button key={item} asChild variant="outline" size="sm" className="min-w-9">
              <Link href={hrefFor(item)}>{item}</Link>
            </Button>
          )
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
  );
}
