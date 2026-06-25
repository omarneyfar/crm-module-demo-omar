/**
 * Central API configuration. The CRM NestJS backend runs on port 3000 and
 * returns plain JSON (no { success, data } envelope), so the feature api
 * layers parse responses directly.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
