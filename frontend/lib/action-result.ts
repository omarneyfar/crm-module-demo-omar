// What every server action returns, so callers get a result instead of a throw.
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong";
}
