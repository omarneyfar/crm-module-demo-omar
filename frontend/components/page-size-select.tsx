"use client";

import { useRouter } from "next/navigation";

interface Props {
  basePath: string;
  limit: number;
  params?: Record<string, string | undefined>;
  options?: number[];
}

export function PageSizeSelect({
  basePath,
  limit,
  params = {},
  options = [10, 20, 50],
}: Props) {
  const router = useRouter();

  const onChange = (value: string) => {
    const search = new URLSearchParams();
    for (const [key, v] of Object.entries(params)) {
      if (v) search.set(key, v);
    }
    search.set("limit", value);
    search.set("page", "1"); // changing page size jumps back to the first page
    router.push(`${basePath}?${search.toString()}`);
  };

  return (
    <label className="flex items-center gap-2 text-sm text-muted-foreground">
      Rows per page
      <select
        value={limit}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-md border border-input bg-background px-2 text-sm text-foreground shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
